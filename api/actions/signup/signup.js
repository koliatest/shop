import User from '../../models/user';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

export default function signup(req) {
  return new Promise((resolve, reject) => {
    const credentials = req.body;
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
      to : credentials.email,
      subject : 'TrueShop info',
      html : 'Hello,' + credentials.firstName + ' ' + credentials.lastName + ', from <b>TrueShop1997</b>. <br> Here is your password: <b>' + credentials.password + '</b></a>'
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.log(error);
        // res.end("error");
      } else {
        console.log("Message sent: " + response.message);
        //res.end("sent");
      }
    });
    //
    User.create(credentials, (err, user) => {
      if(err) {
        reject('error signup');
      } else {
        resolve(user);
      }
    });
  });
};
