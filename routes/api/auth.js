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

            const token = jwt.sign(
              jwtPayload,
              keys.secret,
              jwtOptions,
              (error, token) => {
                res.status(200).send({
                  auth: true,
                  token: 'Bearer ' + token,
                  message: 'user found & logged in'
                });
              }
            );
          });
      });
    }
  })(req, res, next);
});

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
