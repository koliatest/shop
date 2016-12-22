import passport from 'passport';

export default function signin(req) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return reject(err); // will generate a 500 error
      }
      if (! user) {
        return reject({ message: 'Bad credentials', status: 406 });
      }
      req.login(user, loginErr => {
        if (loginErr) {
          return reject(loginErr);
        }
        return resolve(user);
      });
    })(req);
  });
};
