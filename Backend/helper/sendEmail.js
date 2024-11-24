import nodemailer from 'nodemailer'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { error } from 'console'
import hbs from 'nodemailer-express-handlebars'

dotenv.config()
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

const sendEmail = async(
  subject,
  send_to,
  replay_to,
  template,
  send_from,
  name,
  link
)=>{
   const transport = nodemailer.createTransport({
     service: "Gmail",
     auth: {
       user: process.env.USER_EMAIL,
       pass: process.env.EMAIL_PASS,
     },
     tls: {
       ciphers: "SSLv3",
     },
   });
const handlerBarsOptions = {
  viewEngine: {
    extName: ".handlebars",
    partailsDir: path.resolve(__dirname, "../views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../views/"),
  extName: ".handlebars",
};

transport.use("compile",hbs(handlerBarsOptions))
const mailOptions = {
  subject: subject,
  to: send_to,
  replyTo: replay_to,
  template: template,
  from: send_from,
  context: {
    name: name,
    link: link,
  },
};

try{
 const information=await transport.sendMail(mailOptions)
 console.log('email send',information)
 // retun the value neccecarey
 return information
}catch(err){
    console.log(err)
    throw new Error('No email send')
}

};

export default sendEmail
