var mongoose = require('mongoose');
    // bcrypt   = require('bcrypt-nodejs'),
// var Q = require('q');
    // SALT_WORK_FACTOR  = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  first: String,
  last: String,
  male: Boolean,
  female: Boolean,
  animals: Boolean,
  arts: Boolean,
  education: Boolean,
  evironment: Boolean,
  health: Boolean,
  humanService: Boolean,
  international: Boolean,
  publicBenefit: Boolean,
  religion: Boolean,
  local: Boolean,
  phone: String,
  code: String,
  pledge: Number,
  joinDate : {
    type: Date,
    default: Date.now
  },
  // stripeToken: String
  stripeData: Mixed
});

// UserSchema.methods.comparePasswords = function(candidatePassword) {
//   var defer = Q.defer();
//   var savedPassword = this.password;
//   bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
//     if (err) {
//       defer.reject(err);
//     } else {
//       defer.resolve(isMatch);
//     }
//   });
//   return defer.promise;
// };

// UserSchema.pre('save', function (next) {
//   var user = this;

//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) {
//     return next();
//   }

//   // generate a salt
//   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) {
//       return next(err);
//     }

//     // hash the password along with our new salt
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       if (err) {
//         return next(err);
//       }

//       // override the cleartext password with the hashed one
//       user.password = hash;
//       user.salt = salt;
//       next();
//     });
//   });
// });

module.exports = mongoose.model('User', UserSchema);
