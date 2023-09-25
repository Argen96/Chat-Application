import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

let Transporter = nodemailer.createTransport({
    port: 587,
    host: process.env.HOST,
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASSWORD,
    },
});
  
export { Transporter }