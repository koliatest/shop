import User from '../../models/user';
import bcrypt from 'bcrypt-nodejs';

var isValidPassword = function(user, password){
  return bcrypt.compareSync(password, user.password);
}

export default function changePassword(req) {
  return new Promise((resolve, reject) => {
    const { oldPassword, newPassword, newPasswordConfirmed } = req.body;
    User.findById(req.user._id)
      .then(user => {
        if (!isValidPassword(user, oldPassword)) {
          reject({ message: 'Old password is not correct.' });
        } else {
          if(newPassword !== newPasswordConfirmed) {
            reject({ message: 'New passwords are not match.' })
          } else {
            user.password = newPassword;
            resolve({ message: 'OK' });
            user.save();
          }
        }
      })
      .catch(err => reject(err));
  });
}
