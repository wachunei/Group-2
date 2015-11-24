import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  isChecked: DS.attr('boolean', { defaultValue: false }),
  category: DS.belongsTo('category',{async: false})
});
