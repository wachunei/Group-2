(function() {
  var app = angular.module('unitConverter-converter', ['unitConverter-storage']);

  app.service('converterService', ['dataService', function(dataService) {
    var self = this;
    self.evaluate = function(m) {
      return function(c) {
        return function(x) {
          return m * x + c;
        };
      };
    };

    if (dataService.storedData.length > 0) {
      var converter = {
        length: {},
        temperature: {},
        weigth: {},
        area: {},
        volume: {},
        time: {}
      };

      dataService.storedData.forEach(function(obj)  {
        var type = obj.type,
          fUnit = obj.fUnit,
          sUnit = obj.sUnit,
          m = obj.slope,
          c = obj.intercept;

        if (!converter[type][fUnit]) {
          converter[type][fUnit] = {};
        }

        if (!converter[type][fUnit][sUnit]) {
          converter[type][fUnit][sUnit] = {};
        }
        converter[type][fUnit][sUnit] = self.evaluate(m)(c);
      });

      self.converter = converter;

    } else {
      self.converter = {
        length: {},
        temperature: {},
        weigth: {},
        area: {},
        volume: {},
        time: {}
      };
    }
  }]);

  app.service('dataService', ['storageService',
    function(storageService, converterService) {
      var self = this;
      self.storedData = storageService.getData() ||  [];

      self.newConvertion = function(type, fUnit, sUnit, m, c) {
        var index = self.storedData
                    .map(function(e) { return e.type+"|"+e.fUnit+"|"+e.sUnit;})
                    .indexOf(type+"|"+fUnit+"|"+sUnit);

        if (index != -1) {
          self.storedData[index].slope = m;
          self.storedData[index].intercept = c;
        } else {
          self.storedData.push({
            type: type,
            fUnit: fUnit,
            sUnit: sUnit,
            slope: m,
            intercept: c
          });
        }
      };

      self.saveData = function() {
        storageService.saveData(self.storedData);
      };



    }
  ]);

})();
