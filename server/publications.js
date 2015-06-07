
// isServer is already checked because of folder name
// if (Meteor.isServer) {
  // we removed autopublish, not everything on client
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    });
  });
//}