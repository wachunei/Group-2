import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createListItem: function() {
      var category = this.store.peekRecord('category', this.get('selectedCategory'));
      var itemTitle = this.get('listItemTitle');
      if (!itemTitle) {
        return false;
      }
      if (!itemTitle.trim()) {
        return;
      }
      var item = this.store.createRecord('list-item', {
        title: itemTitle,
        description: "",
        isChecked: false,
      });

      this.set('listItemTitle', '');
      if(category){
        category.get('items').pushObject(item);
        item.save();
        category.save();
      } else {
        var list = this.store.peekRecord('list', this.get('model').get('id'));
        var id = list.get('categories').get('firstObject').get('id');
        var cat = this.store.peekRecord('category', id);
        cat.get('items').pushObject(item);
        item.save();
        cat.save();
      }
    },
    toggleIsChecked: function(listItem) {
      var value = listItem.get('isChecked');
      listItem.set('isChecked', !value);
      listItem.save();
    },
    createCategory: function() {
      var list = this.store.peekRecord('list', this.get('model').get('id'));
      var categoryName = this.get('categoryName');

      var newCat = this.store.createRecord('category', {
        name: categoryName,
        items: [],
        list: list
      });

      this.set('categoryName', '');

      newCat.save();
      list.get('categories').pushObject(newCat);
      list.save();
    }
  },
  listTitle: function() {
    return this.get('model').get('title');
  }.property('model.title'),
  isChecked: function() {
    return this.get('model').get('isChecked');
  }.property('model.isChecked'),
  categories: function() {
    return this.get('model').get('categories');
  }.property('model'),
  items: function() {
    var items = [];
    var hide = this.get('hideChecked');

    this.get('model').get('categories').forEach(function (cat) {
      cat.get('items').forEach(function(item) {
        if(hide) {
          if(!item.get('isChecked')){items.push(item);}
        }else {
          items.push(item);
        }
      });
    });

    items.sort(function(a,b){return a.get('title').localeCompare(b.get('title')); });
    return items;
  }.property('model.categories.@each.items', 'model.categories.[]', 'model.categories', 'hideChecked', 'asCategories')
});
