// defined by folder
//if (Meteor.isClient) {

  // Meteor.startup(function() {
  //   GoogleMaps.load();
  // });

  Meteor.subscribe("tasks");

  Template.appLayout.helpers({
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Accounts.ui.config({
    // label "Username", not "Username or email"
    passwordSignupFields: "USERNAME_ONLY"
  });
//}