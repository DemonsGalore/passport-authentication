const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

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




// @route       GET api/users/signin
// @description sign in user / returning JWT token
// @access      public







// // @route       GET api/users/signin
// // @description sign in user / returning JWT token
// // @access      public
// router.post('/signin', (req, res) => {
//   // const { errors, isValid } = validateSignInInput(req.body);
//   const errors = {};
//
//   // check validation
//   // if (!isValid) {
//   //   return res.status(400).json(errors);
//   // }
//
//   const email = req.body.email;
//   const password = req.body.password;
//
//   // find user by email
//   User.findOne({ email })
//     .then(user => {
//       // check for user
//       if (!user) {
//         errors.email = 'Email not registered.';
//         return res.status(404).json(errors);
//       }
//
//       // check password
//       bcrypt.compare(password, user.password)
//         .then(isMatch => {
//           if (isMatch) {
//             // password matched
//
//             // create JWT payload
//             const payload = {
//               userId: user.id,
//               username: user.username,
//               firstname: user.firstname,
//               lastname: user.lastname,
//               email: user.email,
//             };
//
//             // sign token
//             jwt.sign(
//               payload,
//               'supersecretkey',
//               { expiresIn: '1h' }, // 3600 - 1 hour, 86400 - 1 day, 604800 - 1 week
//               (err, token) => {
//                 res.json({
//                   success: true,
//                   token: 'Bearer ' + token,
//                 });
//               }
//             );
//           } else {
//             errors.password = 'Wrong password.';
//             return res.status(400).json(errors);
//           }
//         });
//     });
// });

module.exports = router;
