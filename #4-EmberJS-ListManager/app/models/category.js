import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  list: DS.belongsTo('list'),
  items: DS.hasMany('list-items', {async: false})
});
