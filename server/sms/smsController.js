require('dotenv').load();
var AuthCodeModel = require('./authCodeModel');
var SmsModel = require('./sentMessagesModel');
var UserModel = require('../users/userModel');
var CharityModel = require('../charity/charityModel');
// var Q = require('q');

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
// var STRIPE_TEST_ROUTING = 000123456789;
// var STRIPE_TEST_BANK_ACCT = 110000000;

var fromPhone = process.env.TWILIO_NUMBER;

// Generate a random authentication code and save it in the db
var generateCode = function(userPhone) {
  var code = Math.floor(Math.random() * 90000) + 10000;
  var codeModel = new AuthCodeModel.AuthCode({ phone: userPhone, code: code });
  // save or update so only the latest code can be used to verify the number
  codeModel.save(function(err) {
    if (err) { throw err; }
  });
  return code;
};

var weekNumber = function(date) {
  var dayOne = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - dayOne) / 86400000) / 7);
};

module.exports = {
  // Receive the user's choice and process the donation
  smsReceiver: function(req, res) {
    if (req.method === 'POST') {
      // Store the user's choice from the POST request sent by Twilio
      var userChoice = 'choice' + req.body.Body;
      var userPhone = req.body.From.slice(2);
      // Query the user choices collection with the phone number that sent the response
      SmsModel.SentMessages.findOne({ phone: userPhone }, function(err, sms) {
        if (err) {return console.error(err);}
        if (sms[userChoice]) {
          var chosenCharityId = sms[userChoice];
          // Query the User collection to find out how much they want to donate
          UserModel.findOne({ phone: sms.phone }, function(err, user) {
            var today = new Date();
            // Set the donation to the amount of the yearly pledge divided by the number of weeks remaining in the year
            var donationAmount = Math.round((user.pledge / (53 - weekNumber(today))) * 100) / 100;
            // Create a new donation in the donations collection
            var donation = new SmsModel.Donations({
              phone: user.phone,
              charity: chosenCharityId,
              amount: donationAmount
            });
            // Save the donation to the collection
            donation.save(function(err) {
              if (err) { throw err; }
              else {
                chosenCharityId = parseInt(chosenCharityId);
                // send thank you w/ charity name back to user
                CharityModel.findOne({ orgid: chosenCharityId }, function(err, charity) {
                  client.sendMessage({
                    to: '+1' + userPhone,
                    from: fromPhone,
                    body: 'Thank you for your donation of $' + donationAmount + ' to ' + charity.name + '.'
                  }, function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      // TODO: allow server to transfer money to charities, rather than holding it
                      // transfer the money to our account
                      stripe.charges.create({
                        amount: donationAmount * 100,
                        currency: 'usd',
                        customer: user.stripeData.id,
                        description: 'PLEDGR to: ' + charity.name
                      }).then(function(charge) {
                        console.log('charge receipt from stripe', charge);
                      });
                    }
                  });
                });
              }
            });
            res.status(204).send();
          });
        } else {
          res.status(500).send();
        }
      });
    }
  },
  // Send an auth code to the user
  sendVerification: function(req, res) {
    var userPhone = req.body.phone;
    var code = generateCode(userPhone);

    client.sendMessage({
      to: '+1' + userPhone,
      from: fromPhone,
      body: 'Enter ' + code + ' on the signup page to verify your account.'
    }, function(err) {
      if (err) {
        console.error(err);
        res.status(500).send({ sent: false });
      } else {
        res.status(204).send({ sent: true });
      }
    });
  },
  // Check to see if the verification code exists in the DB
  verifyCode: function(req, res) {
    var userPhone = req.body.phone;
    var code = req.body.code;
    AuthCodeModel.AuthCode.find({ phone: userPhone, code: code }, function(err, data) {
      if (err) { return console.error(err); }
      if (data.length === 0) {
        res.status(201).send({ found: false });
      } else {
        res.status(201).send({ found: true });
      }
    });
  }
};
