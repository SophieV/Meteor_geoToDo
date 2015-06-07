Router.onBeforeAction(function() {
  GoogleMaps.load();
  console.log('loading GoogleMaps');
  this.next();
}, { only: ['map.index'] });

Router.route('/', {
  controller: 'HomeController',
  name: 'home'
});

Router.route('/map', {
  controller: 'MapController',
  action: 'index',
  name: 'map.index'
});

Router.route('/tasks', {
  controller: 'TasksListController',
  action: 'index',
  name: 'tasks.index'
});

Router.route('/task/:_id', {
  controller: 'TaskController',
  action: 'show',
  name: 'task.show'
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
      this.render('home_footer', {to: 'footer'});
    }
  });

  MapController = ApplicationController.extend({
    data: function () { 
      return Tasks.find({ loc: { $ne: null } });//$sort: { createdAt: -1 } 
    },
    waitOn: function() {
      return Meteor.subscribe('tasks');
    },
    index: function () {
      this.render('map');
    }
  });

  TasksListController = ApplicationController.extend({
    index: function(){
      this.render('tasklist');
    },
    waitOn: function () { 
      return Meteor.subscribe('tasks'); 
    },
    // data: function () { 
    //   return Tasks.find({});
    // }
  });

  TaskController = ApplicationController.extend({
    show: function () {
      this.render('task');
    }
  });
}