var app = app || {};
var helpers = helpers || {};
(function($) {
		helpers.statusFilterLink = function(path) {
			return (app.TodoFilter.priorityFilter)?'/'+app.TodoFilter.priorityFilter+path: path;
		};

    helpers.priorityFilterLink = function(path) {
      return (app.TodoFilter.statusFilter)?path+'/'+app.TodoFilter.statusFilter: path;
    };

    helpers.statusFilterClass = function(status) {
      if(status) {
        return (app.TodoFilter.statusFilter === status)? 'selected' : '';
      }
      return (!app.TodoFilter.statusFilter)? 'selected' : '';
    };

    helpers.priorityFilterClass = function(priority) {
      if(priority) {
        return (app.TodoFilter.priorityFilter === priority)? 'selected' : '';
      }
      return (!app.TodoFilter.priorityFilter)? 'selected' : '';
    };
})(jQuery);
