import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('lists', function() {
    this.route('show', { path: '/:list_id'});
  });
  this.route('list-items', {});
  this.route('categories', {});
});

export default Router;
