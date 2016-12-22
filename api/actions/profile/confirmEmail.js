import User from '../../models/user';

export default function confirmEmail(req) {
  return new Promise((resolve, reject) => {
    console.log('USER ID = ' + req.user._id);
    User.update({ _id: req.user._id }, { $set: { isEmailVerified: true } })
      .catch(err => reject(err));
  });
};
