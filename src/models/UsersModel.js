const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  createdDate: { type: Date, default: Date.now() },
});

const UsersModel = mongoose.model("Users", UsersSchema);
module.exports = UsersModel;
