  // This code only runs on the client
  Template.tasklist.helpers({
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count(); //if data context set, would be this.collection.find
    },
    tasks: function () {
      if (Session.get("hideCompleted")) 
      {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } 
      else 
      {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    }
  });

    Template.tasklist.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted

      var text = event.target.text.value;

      var address = event.target.location.value;

      var coordinatesWithName;

      if (address != null)
      {
         Meteor.call("getGeoCoordinates", address, function(err, result){
          if (!err){
            console.log(result);
            coordinatesWithName = result;
            Meteor.call("addTask", text, coordinatesWithName);
          } else {
            console.log(err);
            coordinatesWithName = null;
          }
        });
      }

      // Clear form
      event.target.text.value = "";
      event.target.location.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });