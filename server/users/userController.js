var User = require('./userModel');
var Q = require('q');
var jwt  = require('jwt-simple');
var sendText = require('../sms/sendDonationText');
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  signin: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          // findUser({ username: username, password: password })
          // .then(function(password) {
          if (user.password !== password) {
            next(new Error('password incorrect'));
          } else {
            var token = jwt.encode(user, 'secret');
            res.status(200);
            res.json({ token: token });
          }
          // });

          // return user.comparePasswords(password)
          //   .then(function(foundUser) {
          //     if (foundUser) {
          //       var token = jwt.encode(user, 'secret');
          //       res.json({token: token});
          //     } else {
          //       return next(new Error('No user'));
          //     }
          //   });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  signup: function(req, res, next) {
    var newUser = req.body;
    var username = newUser.username;
    //parse phone number
    newUser.phone = newUser.phone.match(/\d/g).join('');

    // add some way of verifying the sent code against known sent codes before allowing user to finishing registering

    var findOne = Q.nbind(User.findOne, User);
    // check to see if user already exists
    findOne({ username: username })
      .then(function(user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          // make a new user at this username if one doesn't already exist
          var create = Q.nbind(User.create, User);

          return stripe.customers.create({
            card: newUser.stripeToken,
            description: 'pledgr token for: ' + username
          }).then(function(customer) {
            newUser.stripeData = customer;
            return create(newUser);
          });
        }
      })
      .then(function(user) {
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
//        console.log('token is:', token);
        res.status(201);
        res.json({ token: token });
        return Q.fcall(function() {
          return user;
        });
      })
      .then(function(user) {
        // send first donation text message after signup
        return sendText.getCharities([user]);
      })
      .fail(function(error) {
        next(error);
      });
  }

  // checkAuth: function (req, res, next) {
  //   // checking to see if the user is authenticated
  //   // grab the token in the header is any
  //   // then decode the token, which we end up being the user object
  //   // check to see if that user exists in the database
  //   var token = req.headers['x-access-token'];
  //   if (!token) {
  //     next(new Error('No token'));
  //   } else {
  //     var user = jwt.decode(token, 'secret');
  //     var findUser = Q.nbind(User.findOne, User);
  //     findUser({username: user.username})
  //       .then(function (foundUser) {
  //         if (foundUser) {
  //           res.send(200);
  //         } else {
  //           res.send(401);
  //         }
  //       })
  //       .fail(function (error) {
  //         next(error);
  //       });
  //   }
  // }
};
