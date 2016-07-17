import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Tasks } from '../api/tasks.js';
 
import './task.html';
 
Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .updateReminder'() {
  	var date = document.getElementById("datetimepicker" + this._id);
    Meteor.call('tasks.updateReminder', this._id, date.value);
  },
  'click .clearReminder'() {
    Meteor.call('tasks.clearReminder', this._id);
  },
});
