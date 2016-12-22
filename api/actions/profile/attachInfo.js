import request from 'request';

import User from '../../models/user';
import config from '../../../src/config';

export default function attachInfo(req) {
  return new Promise((resolve, reject) => {
    request({
      url: config.bankAPIHost + '/getUserId',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.bankAPIKey
      },
      json: { email: req.body.bankEmail,
        password: req.body.bankPassword }
    }, (err, response, body) => {
      if (body.body === 'wrong request! \'email\' paramether is not define' ||
        body.body === 'wrong request! \'password\' paramether is not define' ||
        body.body === 'wrong pass' ||
        body.body === 'wrong email') {
        reject({ bankResponse: 'BAD' });
      } else {
        if (req.body.email.length) {
          User.update({_id: req.user._id}, {$set: {email: req.body.email, bankId: body}})
            .then(user => resolve(user));
        } else {
          User.update({_id: req.user._id}, {$set: {bankId: body}})
            .then(user => resolve(user));
        }
      }
    });
  });
}
