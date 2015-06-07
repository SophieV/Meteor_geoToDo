Meteor.methods({
  getGeoCoordinates: function (addressText) {
    var url = ["http://maps.google.com/maps/api/geocode/json?address=", addressText].join('');
    var result = HTTP.get(url, {timeout:30000});

    if(result.statusCode==200) 
    {
      var response = JSON.parse(result.content);
      console.log("response received.");
      console.log(response);

      if (response != null && response.results != null && response.results.length === 1)
      {
        if (response.results[0].geometry != null)
        {
          console.log(response.results[0].geometry.location);

          return coordinates = {coordinates: response.results[0].geometry.location, name: response.results[0].formatted_address };
        }
      }
      else
      {
        throw new Meteor.Error('tooManyOptions', 'toom many results to choose from');
      }
    } 
    else 
    {
      console.log("Response issue: ", result.statusCode);
      var errorJson = JSON.parse(result.content);
      throw new Meteor.Error(result.statusCode, errorJson.error);
    }
  },
  addTask: function (text, coordinatesWithName) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (coordinatesWithName != null)
    {
      Tasks.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username,
        loc : { type: "Point", 
                coordinates: coordinatesWithName.coordinates, 
                name: coordinatesWithName.name }
      });
    }
    else
    {
      Tasks.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
    }
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  setPrivate: function (taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});