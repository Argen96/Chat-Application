import fsp from 'fs/promises'
import handlebars from 'handlebars'
import { Transporter } from '../configuration/mailConfiguration.js';
import * as dotenv from "dotenv";
dotenv.config();
  
async function sendEmail(account) {
    const resetCode  = account.email_token
    const resetLink = `http://localhost:3000/reset-password?code=${resetCode}`;
    const html = await fsp.readFile('./src/services/index.html', 'utf-8')
    const template = handlebars.compile(html)
    const replacements = {
      username: account.first_name,
      resetLink: resetLink
    };
    const htmlToSend = template(replacements);
    const mailOptions = {
      from: "noreply@kromin.it",
      to: account.email,
      subject: "'Password Reset'",
      html: htmlToSend
    };
    Transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent successfully," + info);
      }
    });
  }
  
export { sendEmail };