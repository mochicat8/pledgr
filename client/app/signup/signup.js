angular.module('pledgr.signup', [])

// .config(function($window){
//     $window.Stripe.setPublishableKey('pk_test_3Fzz9YSECJXQuhTlWhLzcj6P');
// })

.controller('SignupController', function($scope, $window, Auth, SMS) {

  // sets your application publishable key
  $window.Stripe.setPublishableKey('pk_test_3Fzz9YSECJXQuhTlWhLzcj6P');
  // Stripe Response Handler

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

  $scope.getToken = function(){
    console.log("scope in get token",$scope);
    var Cardinfo = {
      number : $scope.number,
      exp_month : $scope.expiry.split("/")[0],
      exp_year : $scope.expiry.split('/')[1].split('').splice(2).join(''),
      cvc : $scope.cvc
    };
    
    $window.Stripe.createToken(Cardinfo, function(status, res){
      console.log('status in create token', status);
      console.log('response in create token', res);
      $scope.user.stripeToken = res.id;
    });

  };

  $scope.signup = function() {
    console.log("checkout form in signup",$scope.checkoutForm);
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
