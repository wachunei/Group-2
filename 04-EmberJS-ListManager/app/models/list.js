import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  categories: DS.hasMany('category', {async: false})
});
