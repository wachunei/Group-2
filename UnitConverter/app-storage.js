(function() {
  var app = angular.module('unitConverter-storage', []);

  app.service('storageService', function() {
    var dbID = 'CONVERTER_DB';
    var self = this;
    self.save = function(key, value) {
      localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
    };

    self.get = function(key) {
      return JSON.parse(localStorage.getItem(JSON.stringify(key)));
    };

    self.saveData = function(data) {
      self.save(dbID, data);
    };

    self.getData = function() {
      return self.get(dbID);
    };

  });
})();
