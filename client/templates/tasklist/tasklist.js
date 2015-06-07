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
    },
    taskTitleNotPopulated: function() {
      return !Template.instance().state.get('titlePopulated');
    },
    taskLocationNotRecognized: function() {
      return !Template.instance().state.get('locationIdentified');
    }
  });

  Template.tasklist.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.set('titlePopulated', true);
    this.state.set('locationIdentified',true);
  });

  Template.tasklist.events({
    "reset .new-task": function (event, template) {
      event.target.text.value = "";
      event.target.location.value = "";
      template.state.set('titlePopulated', true);
      template.state.set('locationIdentified', true);
    },
    "submit .new-task": function (event, template) {

    template.state.set('titlePopulated', true);
    template.state.set('locationIdentified', true);

    var text = event.target.text.value;

    try
    {
      NonEmptyString = Match.Where(function (x) {
        check(x, String);
        return x.length > 0;
      });
      check(text, NonEmptyString);
    }
    catch (err)
    {
      template.state.set('titlePopulated', false);
      console.log('the new task is missing a title');
      event.preventDefault();
    }

    if (template.state.get('titlePopulated'))
    {
      var address = event.target.location.value;

      if (address != '')
      {
         Meteor.call("getGeoCoordinates", address, function(err, coordinatesWithName){
          if (!err){
            Meteor.call("addTask", text, coordinatesWithName);
          } else {
            console.log('error' + err);
            template.state.set('locationIdentified', false);
            event.preventDefault();
          }
        });
      }
      else
      {
        Meteor.call("addTask", text);

        // Clear form
        event.target.text.value = "";
        event.target.location.value = "";
      }

      // Prevent default form submit
      return false;
    }
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });