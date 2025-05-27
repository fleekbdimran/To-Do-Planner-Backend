const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UsersModel = require("../models/UsersModel");
const SendEmailUtility = require('../utilitys/SendEmailUtility');
const OtpModel = require('../models/OtpModel');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(200).json({
        status: "fail",
        message: "Password and confirm password do not match",
      });
    }

    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await UsersModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      status: "success",
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    res.status(200).json({ status: "fail", message: error.message });
  }
};

// Login
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(200).json({ status: "fail", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ status: "fail", message: "Wrong password" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(200).json({ status: "fail", message: error.message });
  }
};

// Profile Update
exports.ProfileUpdate = async (req, res) => {
  try {
    const email = req.headers.email;
    const body = req.body;
    const result = await UsersModel.updateOne({ email }, body);

    if (result.modifiedCount === 0) {
      return res.status(200).json({ status: "fail", message: "No changes made" });
    }

    res.status(200).json({ status: "success", message: "Profile updated", data: result });
  } catch (error) {
    res.status(200).json({ status: "fail", message: error.message });
  }
};


// Profile Details
exports.ProfileDetails = async (req, res) => {
    try {
        let email = req.headers.email;
        let user = await UsersModel.findOne({ email: email });
        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        res.status(200).json({ status: "fail", data: error });
    }
};


//RecoverVerifyEmail
exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email
  let otp = Math.floor(Math.random() * 1000000) // 6 digit otp

  try{
    let user = await UsersModel.findOne({email:email})
    if(!user){
      return res.status(200).json({ status: "fail", data: "User not found" });
    }
    else{
      // 1 send email database
      let createotp = await OtpModel.create({email:email, otp:otp})
      // 2 send otp email
      let sendEmail = SendEmailUtility( email, `Your OTP is ${otp}`, "To-Do-Planner Password Verification" )

      return res.status(200).json({ status: "success", data: "OTP sent successfully"});
    }
  }

  catch (error){
    res.status(200).json({status: "fail", data: error});
  }
}


//OTP Verify
exports.OtpVerify = async (req, res) => {
    let email = req.params.email
    let otp = req.params.otp
    let status = 0
    let updateStatus = 1

    try {
        let otpCheck = await OtpModel.aggregate([
            { $match: { email: email, otp: otp, status: status } },
            { $count: "total" }
        ])

        if (otpCheck.length > 0) {
            let otpUpdate = await OtpModel.updateOne(
                { email: email, otp: otp },
                { $set: { status: updateStatus } }
            )
            return res.status(200).json({ status: "success", data: otpUpdate })
        } else {
            return res.status(200).json({ status: "fail", data: "Invalid OTP" })
        }
    } catch (error) {
        return res.status(200).json({ status: "error", message: error.message })
    }
}
