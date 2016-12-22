import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import config from '../../../src/config';

export default function sendConfirmationEmail(req) {
  return new Promise((resolve, reject) => {
     var options = {
      service: 'Gmail',
      auth: {
      user: 'mykola.syniuha',
      pass: '123456QWERTY'
      }
     };
     var transporter = nodemailer.createTransport(smtpTransport(options));
     var mailOptions, host, link;
     host = req.get('host');
     link = "http://"+req.get('host')+"/verify/"+config.verifyEmailId;
     mailOptions = {
      to : req.user.email,
      subject : 'Please confirm your Email account',
      html : 'Hello,' + req.user.firstName + ' ' + req.user.lastName + ', from <b>TrueShop1997</b>. <br> Please Click on the link to verify your email.<br><a href='+link+'>Click here to verify</a>'
     };
     console.log(mailOptions);
     transporter.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.log(error);
        reject({ message: 'BAD' });
      } else {
        console.log("Message sent: " + response.message);
        resolve({ message: 'OK' });
      }
     });
  });
};
