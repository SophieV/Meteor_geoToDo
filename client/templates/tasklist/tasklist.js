  // This code only runs on the client
  Template.tasklist.helpers({
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

      Meteor.call("addTask", text);

      // Tasks.insert({
      //   text: text,
      //   owner: Meteor.userId(),
      //   username: Meteor.user().username,
      //   createdAt: new Date() // current time
      // });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });