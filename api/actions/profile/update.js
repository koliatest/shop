import User from '../../models/user';

export default function update(req) {
  return new Promise((resolve, reject) => {
    const { firstName, lastName, phoneNumber, address } = req.body;
    User.update({ _id: req.user._id }, { $set: {
      firstName, lastName, phoneNumber, address
    } })
    .catch(err => reject(err));
  });
}
