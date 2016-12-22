import User from '../models/user';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

export default function sendPasswordBack(req) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          reject({ message: 'There is no user with such email.' });
        } else {
          var options = {
            service: 'Gmail',
            auth: {
              user: 'mykola.syniuha',
              pass: '123456QWERTY'
            }
          };
          var transporter = nodemailer.createTransport(smtpTransport(options));
          var mailOptions, host;
          host = req.get('host');
          mailOptions = {
            to : req.user.email,
            subject : 'Please confirm your Email account',
            html : 'Hello,' + user.firstName + ' ' + user.lastName + ', from <b>TrueShop1997</b>. <br> Please Click on the link to verify your email.<br><a href='+link+'>Click here to verify</a>'
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
        }
      })
      .catch(err => reject(err));
  });
}
