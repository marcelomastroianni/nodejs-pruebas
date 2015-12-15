(function(){

  angular
       .module('demo.login')
       .controller('LoginController', [
          'loginService',
          'store',
          '$state',
          LoginController
       ]);

  function LoginController( loginService, store, $state ) {

    var self = this;
    this.loginData = {};
    
    this.send = function(){
      loginService.login(self.loginData).then(
        function(data){
          store.set('jwt', data.token);
          $state.go('users');
        },
        function(error){
          $state.go('login');
        }
      );
    };
    
    this.logout = function(){
     store.remove('jwt')
    }

  }

})();
