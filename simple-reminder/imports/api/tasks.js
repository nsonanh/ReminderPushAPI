import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find();
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.updateReminder'(taskId, date) {
    check(taskId, String);
    check(date, String);
    var reminderDate = moment(date, "DD.MM.YYYY h:mm a");
    //throw new Meteor.Error('inside ' + date +' ' + reminderDate.toString());

    if (reminderDate.isValid()) {
      Tasks.update(taskId, { $set: { remindAt: reminderDate.toISOString() } });
    }
  },
  'tasks.clearReminder'(taskId) {
    check(taskId, String);

    Tasks.update(taskId, { $set: { remindAt: null } });
  },
});
