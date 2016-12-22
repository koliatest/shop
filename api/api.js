import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import PrettyError from 'pretty-error';
import http from 'http';
import bcrypt from 'bcrypt-nodejs';
import SocketIo from 'socket.io';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import morgan from 'morgan';

import config from '../src/config';
import * as actions from './actions/index';
import { mapUrl } from 'utils/url.js';
import errorHandler from './middlewares/errorHandler';
import User from './models/user';

const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

const pretty = new PrettyError();
const app = express();

mongoose.Promise = bluebird;
mongoose.connect(config.database, err => {
    if (err) {
        throw err;
    }
    console.info('==> MongoDB connected success');
});

const server = new http.Server(app);

const io = new SocketIo(server);
io.path('/ws');

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 60 }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

//
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
      if(!err) done(null, user);
      else done(err, null);
    });
});
//

// facebook auth
passport.use(new FacebookStrategy({
    clientID: '1851793888384017',
    clientSecret: '164d473fa600dccc74a0fbb1498ddea5',
    profileFields: ['id', 'displayName', 'email'],
    callbackURL: 'http://localhost:3000/api/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ facebookId: profile.id }, function(err, user) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        let newUser = new User({
          facebookId: profile.id,
          firstName: profile.displayName.split(' ')[0],
          lastName: profile.displayName.split(' ')[1]
          // email: profile.emails[0].value
        });
        newUser.save(function(err) {
          if(err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, newUser);
          }
        });
      }
    });
  }
));

// local auth
var isValidPassword = function(user, password){
  return bcrypt.compareSync(password, user.password);
}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done){
  User.findOne({ email : username},function(err,user){
    return err
      ? done(err)
      : user
        ? isValidPassword(user, password)
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' });
  });
}));
//

// facebook auth
app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
  function(req, res) {}
);

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/attach-info');
  }
);
//

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);

  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});


const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`});

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}

app.use(errorHandler);
