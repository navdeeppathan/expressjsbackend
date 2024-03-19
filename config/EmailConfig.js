import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER, //ADMIN GMAIL ID
      pass: process.env.EMAIL_PASS, //ADMIN GMAIL PASSWORD
    },
  });

  export default transporter;