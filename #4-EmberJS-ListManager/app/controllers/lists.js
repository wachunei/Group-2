import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createList: function() {
      var title = this.get('listTitle');

      if(!title) {
        return false;
      }
      if(!title.trim()) {
        return;
      }
      var list = this.store.createRecord('list', {
        title: title,
        categories: []
      });

      var defCat = this.store.createRecord('category', {
        items: [],
        name: 'Default'
      });

      list.get('categories').pushObject(defCat);
      defCat.save();
      this.set('listTitle', '');

      var controller = this;
      list.save().then(function(result){
        controller.transitionToRoute('lists.show', result.id);
      });
    },
    deleteList: function(list) {
      var store = this.store;
      store.findRecord('list', list.get('id')).then(function(list) {
        list.destroyRecord();
      });
      this.transitionTo('lists');
    },
    cloneList: function(list) {
      var newList = this.store.createRecord('list', {
        title: list.get('title') + "-clone",
        categories: []
      });
      //Copy categories
      for (var i = 0; i < list.get('categories').length; i++) {
        var clonedCategory = this.store.createRecord('category', {
          name: list.get('categories').objectAt(i).get('name'),
          list: newList,
          items: []
        });
        //Copy items in that category
        for (var j = 0; j < list.get('categories').objectAt(i).get('items').length; j++) {
          var clonedItem = this.store.createRecord('list-item', {
            title: list.get('categories').objectAt(i).get('items').objectAt(j).get('title'),
            description: "",
            isChecked: false
          });
          clonedCategory.get('items').pushObject(clonedItem);
        }
        newList.get('categories').pushObject(clonedCategory);
      }
      newList.save();
    }
  }
});
