// defined by folder
//if (Meteor.isClient) {

  // Meteor.startup(function() {
  //   GoogleMaps.load();
  // });

  Template.appLayout.helpers({
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
//}