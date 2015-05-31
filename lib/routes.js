Router.onBeforeAction(function() {
  GoogleMaps.load();
  console.log('loading GoogleMaps');
  this.next();
}, { only: ['map'] });

Router.route('/', {
  controller: 'HomeController'
});

Router.route('/map', {
  controller: 'MapController'
});

Router.route('/tasks', {
  controller: 'TaskController',
  action: 'index'
});

Router.route('/task/:_id', {
  controller: 'TaskController',
  action: 'show'
});

if (Meteor.isClient) {

  ApplicationController = RouteController.extend({
    layoutTemplate: 'appLayout',

    onBeforeAction: function () {
      console.log('app before hook!');
      this.next();
    },

    action: function () {
      console.log('this should be overridden!');
    }
  });

  HomeController = ApplicationController.extend({
    action: function () {
      this.render('home');
    }
  });

  MapController = ApplicationController.extend({
    action: function () {
      this.render('map');
    }
  });

  TaskController = ApplicationController.extend({
    show: function () {
      this.render('tasklist');
    },

    index: function () {
      this.render('task');
    }
  });
}