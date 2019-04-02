const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const keys = require('../config/keys');

const User = require('../models/User');

// TODO: extend to email- and username-check on register/login
// TODO: login and jwt to async

// INFO: always use usernameField for strategy!!! emailField ist not working!!!

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          return done(null, false, { message: 'Email already registered.' });
        } else {
          const hashedPassword = await bcrypt.hash(password, 12);
          const newUser = new User({
            email,
            password: hashedPassword,
          });
          const user = await newUser.save();
          return done(null, user)
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    (email, password, done) => {
      try {
        User.findOne({ email: jwt_payload.id })
          .then(user => {
            if (!user) {
              console.log("email not found");
              return done(null, false, { message: 'Email not registered' });
            } else {
              bcrypt.compare(password, user.password)
              .then(passwordMatch => {
                if (passwordMatch) {
                  console.log("user found & authenticated");
                  return done(null, user)
                } else {
                  console.log("password does not match");
                  return done(null, false, { message: 'Wrong password' });
                }
              })
            }
          });
      } catch (error) {
        done(error);
      }
    }
  )
);

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: keys.secret,
};

passport.use(
  'jwt',
  new JWTStrategy(options, (jwt_payload, done) => {
    try {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            console.log("USER FOUND", user);
            done(null, user);
          } else {
            console.log("USER NOT FOUND");
            done(null, false);
          }
        });
    } catch (error) {
      done(error);
    }
  })
);
