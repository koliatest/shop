import User from '../../models/user';

export default function isValid(req) {
  return new Promise((resolve, reject) => {
    const email = req.body.email;
    const errors = {};
    User.findOne({ email }, (err, user) => {
      if (err) {
        throw err;
      }
      if (user) {
        errors.email = 'Email address already used';
        reject(errors);
      } else {
        resolve();
      }
    });
  });
}
