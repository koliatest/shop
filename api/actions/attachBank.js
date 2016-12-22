import request from 'request';

import config from '../../src/config';

export default function attachBank(req) {
  return new Promise((resolve, reject) => {
    request({
      url: config.bankAPIHost + '/getUserId',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.bankAPIKey
      },
      json: { email: req.body.email,
              password: req.body.password }
    }, (err, response, body) => {
      if (body.body === 'wrong request! \'email\' paramether is not define' ||
          body.body === 'wrong request! \'password\' paramether is not define' ||
          body.body === 'wrong pass' ||
          body.body === 'wrong email') {
            resolve({ bankResponse: 'BAD'});
          } else {
            resolve({ bankResponse: body });
          }
    });
  });
}
