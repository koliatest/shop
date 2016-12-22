import http from 'http';
import request from 'request';

import config from '../../src/config';

export default function getUserCards(req) {
  return new Promise((resolve, reject) => {
    request({
      url: config.bankAPIHost + '/getUserCards',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.bankAPIKey
      },
      json: { id: req.user.bankId }
    }, (err, response, body) => {
      resolve(body);
    });
  });
}
