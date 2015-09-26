(function() {
  var app = angular.module('unitConverter', ['unitConverter-converter']);

  app.controller('UnitController',['converterService', '$log', function(converterService, $log) {

    this.c = converterService.converter;
    this.currentType = "length";
  }]);


  app.controller('UnitFormController', ['converterService', function(converterService) {
    this.selectedType = "length";
    this.addConversion = function() {
      var type = this.selectedType,
          fUnit = this.firstUnit,
          sUnit = this.secondUnit,
          m = this.slope,
          c = this.intercept,
          converter = converterService.converter;

      if(!converter[type][fUnit]) {
        converter[type][fUnit] = {};
      }

      if(!converter[type][sUnit]) {
        converter[type][sUnit] = {};
      }

      if(!converter[type][fUnit][sUnit]) {
        converter[type][fUnit][sUnit] = {};
      }

      if(!converter[type][sUnit][fUnit]) {
        converter[type][sUnit][fUnit] = {};
      }
      converter[type][fUnit][sUnit] = converterService.evaluate(m)(c);
      converter[type][sUnit][fUnit] = converterService.evaluate(1.0/m)(c/m);
      this.firstUnit = this.secondUnit = this.slope = this.intercept = null;
      console.log(converter);
    };
  }]);
})();
