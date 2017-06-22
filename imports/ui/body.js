import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
                if (instance.state.get('hideCompleted')) {
          // If hide completed is checked, filter tasks
            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }
        // Otherwise, return all of the tasks
        // Show newest tasks at the top
        return Tasks.find({}, { sort: { createdAt: -1 }});
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
});

Template.body.events({
    'submit [data-add-task]' (event) {
    // Prevent default browser form submit
        event.preventDefault();
        console.log(event);
        // Get value from form element
        const input = $('[data-task-input]');
        const text = input.val()

        // Insert a task into the collection
        Meteor.call('tasks.insert', text);

        // Clear form
        input.val('');
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
});
