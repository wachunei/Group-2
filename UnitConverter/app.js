(function() {
  var app = angular.module('unitConverter', ['unitConverter-converter']);
  
  app.directive('convertUnit', function() {
    return {
      restrict: 'E',
      templateUrl: 'convert-unit.html',
      controller: function(converterService, $log) {

        this.firstMagnitude = 0;
        this.secondMagnitude = 0;
        this.c = converterService.converter;
        this.currentType = "length";

        this.updateMagnitudes = function(sender) {
          $log.log(this.c);
          if(this.currentFirstUnit === this.currentSecondUnit) {
            if (sender === 1) this.secondMagnitude = this.firstMagnitude;
            else if (sender === 2) this.firstMagnitude = this.secondMagnitude;
            return;
          }

          if(sender === 1) {
            this.secondMagnitude = this.c[this.currentType][this.currentFirstUnit][this.currentSecondUnit].calc(this.firstMagnitude);
          } else if(sender ===2) {
            this.firstMagnitude = this.c[this.currentType][this.currentSecondUnit][this.currentFirstUnit].calc(this.secondMagnitude);
          }
        };

        this.toggleFavorite = function (type, unit, favorite) {
          converterService.setFavorite(type, unit, favorite);
        };
    },
    controllerAs: 'converter'
    };
  });
  /* Main conversion form controller */

  app.directive('addConversion', function() {
    return {
      restrict: 'E',
      templateUrl: 'add-conversion.html',
      controller: function(converterService, dataService) {
        this.selectedType = "length";

        this.addConversion = function() {
          var type = this.selectedType,
            fUnit = this.firstUnit,
            sUnit = this.secondUnit,
            m = this.slope,
            c = this.intercept,
            m_ = (1.0)/m;
            c_ = (c/m);
            converter = converterService.converter;

          if (!converter[type][fUnit]) {
            converter[type][fUnit] = {};
          }

          if (!converter[type][sUnit]) {
            converter[type][sUnit] = {};
          }

          if (!converter[type][fUnit][sUnit]) {
            converter[type][fUnit][sUnit] = {};
          }

          if (!converter[type][sUnit][fUnit]) {
            converter[type][sUnit][fUnit] = {};
          }
          converter[type][fUnit][sUnit].calc = converterService.evaluate(m)(c);
          converter[type][sUnit][fUnit].calc = converterService.evaluate(m_)(c_);

          dataService.newConvertion(type, fUnit, sUnit, m, c);
          dataService.newConvertion(type, sUnit, fUnit, m_, c_);

          dataService.saveData();

          this.firstUnit = this.secondUnit = this.slope = this.intercept = null;
        };
      },
      controllerAs: 'unitFormCtrl'
    };
  });

  /* new Unit convertion controller */

})();
