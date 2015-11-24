/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Router
	// ----------
	var TodoRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			var params = param? param.split('/') : null;

			var filter = {
				priorityFilter: _.intersection(params, ['now','soon', 'later', 'someday'])[0],
				statusFilter:  _.intersection(params, ['active','completed'])[0]
			};

			app.TodoFilter = params ? filter : {};

			// Trigger a collection filter event, causing hiding/unhiding
			// of Todo view items
			app.todos.trigger('filter');
		}
	});

	app.TodoRouter = new TodoRouter();
	Backbone.history.start();
})();
