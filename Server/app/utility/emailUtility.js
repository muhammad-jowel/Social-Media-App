import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config();

const SendEmail = async(EmailTo, EmailText, EmailSubject) => {


    let transporter = nodemailer.createTransport({
        service : 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURITY || false,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    let mailOptions = {
        from: `SoftDev Jowel <softdev.jowel@gmail.com>`,
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    }


    return await transporter.sendMail(mailOptions)
}


export default SendEmail;