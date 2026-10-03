const fs = require("fs/promises");
const path = require("path");

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err);
  }

  await transporter.sendMail({
    from: "elnawawyseif@gmail.com",
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

const sendResetCode = async (resetCode, email) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "reset-password.html",
  );

  let html = (await fs.readFile(templatePath)).toString();
  html = html.replace("{{RESET_CODE}}", resetCode);

  await sendEmail({
    to: email,
    subject: "Ecommerce password reset code",
    html,
  });
};

module.exports = { sendResetCode };
