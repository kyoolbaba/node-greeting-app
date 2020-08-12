
let text="Node js Server has Started";
const EventEmitter=require('events').EventEmitter
const emitter=new EventEmitter();
require('dotenv').config()
const nodemailer=require('nodemailer');
// const { getMaxListeners } = require('../server');
 
const transporter=nodemailer.createTransport({
    host:'smtp.mailtrap.io',
    port:2525,
    service:process.env.EMAILSERVICE,
    auth:{
        user:process.env.sampleemail,
        pass:process.env.samplepass
    }
})

let mailOptions={
    from:process.env.sampleemail,
    to:'jpmilangowda@gmail.com',
    subject:"Sending mail from node js",
    text:text
}



emitter.on('sendEmail',(message)=>{
    mailOptions.text=message;
    transporter.sendMail(mailOptions,(error,info)=>{
        console.log(info)
        if(error){
            console.log("email could not be sent", error)
        }else{
            console.log(info.response)
        }
    })
})


// console.log("HEY")

// console.log(process.env.sampleemailservice)
// console.log(process.env.sampleemail)
// console.log(process.env.samplepass)

// exports.triggerEmail=(message)=>{
// text=message;
// sendmail();
// }

exports.emitter=emitter;