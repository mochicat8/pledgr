angular.module('pledgr.signup', [])

// .config(function($window){
//     $window.Stripe.setPublishableKey('pk_test_3Fzz9YSECJXQuhTlWhLzcj6P');
// })

.controller('SignupController', function($scope, $window, Auth, SMS) {

  // sets your application publishable key
  $window.Stripe.setPublishableKey('pk_test_3Fzz9YSECJXQuhTlWhLzcj6P');

  // Stripe Response Handler
  $scope.stripeCallback = function (code, result) {
    if (result.error) {
      console.error('it failed! error: ' + result.error.message);
    } else {
      console.log('success! token: ' + result.id);
    }
};

  $scope.user = {
    first:'First',
    last:'Last',
    username: 'username@example.com',
    password: '',
    male: false,
    female: false,
    animals: false,
    arts: false,
    education: false,
    environment: false,
    health: false,
    humanService: false,
    international: false,
    publicBenefit: false,
    religion: false,
    local: false,
    phone: '(111)111-1111',
    code:'test',
    pledge: 100.00
  };

  $scope.signup = function() {
    Auth.signup($scope.user)
    // .then(function(token) {
    //     $window.localStorage.setItem('token', token);
    //     // $location.path('/userhome');
    //   })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.sendCode = function() {
    var phone = $scope.user.phone.match(/\d/g).join('');
    SMS.sendCode({
      phone: phone
    })
    .then(function(sent) {
      if (!sent) {
        console.error('Error sending message. Please try again later.');
      }
    });
  };

  $scope.verifyCode = function() {
    var phone = $scope.user.phone.match(/\d/g).join('');
    SMS.verifyCode({
      phone: phone,
      code: $scope.user.code
    })
    .then(function(found) {
      if (found) {
        console.log('Code found');
        // add ability to show user that their number was verified
      } else {
        console.log('Code not found');
        $('#verify').$invalid = true;

      }
    });
  };
});
