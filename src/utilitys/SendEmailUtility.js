const nodemailer = require('nodemailer');

const SendEmailUtility = async (emailTo, emailText, emailSubject) => {

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "chowdhuryimran262@gmail.com",
      pass: "nbpccnvjantoreqd"
    },
  });

  let mailOptions = {
    from: 'Todo Planner <chowdhuryimran262@gmail.com>',
    to: emailTo,
    subject: emailSubject,
    text: emailText,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = SendEmailUtility;
