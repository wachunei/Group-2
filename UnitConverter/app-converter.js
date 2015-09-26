(function() {
  var app = angular.module('unitConverter-converter', []);

  app.service('converterService', function() {

    this.evaluate = function(m) {
      return function(c) {
        return function(x) {
          return m*x + c;
        };
      };
    };

    this.converter = {
      length: {},
      temperature: {},
      weigth: {},
      area: {},
      volume: {},
      time: {}

    };
  });

})();
