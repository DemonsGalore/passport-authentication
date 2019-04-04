const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');

// load user model
const User = require('../../models/User');

// @route       GET api/auth/register
// @description register user
// @access      public
router.post('/register', (req, res, next) => {
  passport.authenticate('register', (error, user, info) => {
    if (error) console.log(error);
    if (info !== undefined) {
      res.status(403).send(info.message);
    } else {
      req.logIn(user, error => {
        // adapt to values on registration
        const { firstname, lastname, username } = req.body;
        const userData = {
          firstname,
          lastname,
          username,
        };
        User.findOneAndUpdate(
          { email: user.email },
          { $set: userData },
          { new: false }
        )
        .then(() => {
          res.status(200).send({ message: 'user created' });
        });
      });
    }
  })(req, res, next);
});

// @route       GET api/auth/signin
// @description sign in user / returning JWT token
// @access      public
router.post('/login', (req, res, next) => {
  passport.authenticate('login', (error, user, info) => {
    if (error) console.log(error);
    if (info !== undefined) {
      res.status(403).send(info.message);
    } else {
      req.logIn(user, error => {
        User.findOne({ email: user.email })
          .then(user => {
            const { _id, username, email, firstname, lastname, role } = user;
            const jwtPayload = {
              id: _id,
              username,
              email,
              firstname,
              lastname,
              role,
            };

            const jwtOptions = {
              expiresIn: '2w', // examples: 30s, 15m, 12h, 30d, 2w, 1y
            };

            jwt.sign(
              jwtPayload,
              keys.secret,
              jwtOptions,
              (error, token) => {
                // TODO: check what is needed; only set one token (Bearer)
                res.status(200)
                  .set({
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true'
                  })
                  // TODO: expires needed? token has own expiration date/time
                  .cookie('Authorization', 'Bearer ' + token, {
                    expires: new Date(Date.now() + 1209600000),
                    httpOnly: true,
                    secure: true,
                  })
                  .cookie('jwt', token, {
                    expires: new Date(Date.now() + 1209600000),
                    httpOnly: false,
                    secure: false,
                  })
                  .send({
                    auth: true,
                    token: 'Bearer ' + token, // TODO: remove token from response?
                    message: 'user found & logged in'
                  });
              }
            );
          });
      });
    }
  })(req, res, next);
});

// TODO: passport.authenticate jwt first? check if logged in at all
// @route       GET api/auth/signout
// @description sign out user / delete JWT token cookie on client
// @access      public
router.post('/logout', (req, res, next) => {
  res.status(200)
    // TODO: expires needed? token has own expiration date/time
    .cookie('jwt', '', {
      expires: new Date(Date.now()),
      httpOnly: false,
      secure: false,
    })
    .send({
      auth: false,
      message: 'user signed out'
    });
});

// TODO: only for testing
// @route       GET api/auth/users
// @description get all users with authentication
// @access      private
router.get('/users', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) console.log(error);
    if (info !== undefined) {
      res.send(info.message);
    } else {
      res.status(200).send({
        message: 'user found in db'
      });
    }
  })(req, res, next);
});

module.exports = router;
