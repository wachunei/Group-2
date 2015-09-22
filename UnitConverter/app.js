var app = angular.module('unitConverter', []);

app.controller('UnitController', function() {
  this.units = units;
});

var units = [
  {
    name: 'Length'
  },
  {
    name: 'Mass'
  },
  {
    name: 'Temperature'
  }
];
