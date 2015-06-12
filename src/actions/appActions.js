'use strict';

var applicationState = require('../stores/applicationState');
var moment = require('moment');

var chrome = window.chrome;
var syncStorage = chrome.storage.sync;
var background = chrome.extension.getBackgroundPage();
var wunderbits = window.wunderbits;
var WBDeferred = wunderbits.core.WBDeferred;
var when = wunderbits.core.lib.when;

module.exports = {

  'setTaskID': function (taskID) {

    var deferred = new WBDeferred();

    syncStorage.set({
      'taskID': taskID
    }, function () {

      applicationState.update('taskID', taskID);
      deferred.resolve();
    });

    return deferred.promise();
  },

  'createTaskAndSetTaskID': function (taskTitle, listID) {

    var self = this;
    var deferred = new WBDeferred();
    background.createTask(taskTitle, listID)
      .done(function (task) {

        self.setTaskID(task.id)
          .done(function () {

            deferred.resolve(task);
          });
      })
      .fail(function () {

        console.error(arguments);
        deferred.reject();
      });

    return deferred.promise();
  },

  'createSteps': function (stepTitles, taskID) {

    var self = this;
    var deferreds = [];

    stepTitles.forEach(function (title) {

      deferreds.push(background.createSubtask(title, taskID));
    });

    return when(deferreds).promise();
  },

 'convertLocalTimeToServerTime': function (timeStamp) {

    var serverTimestamp = moment(timeStamp)
      .add('minutes', moment(timeStamp).zone())
      .format('YYYY-MM-DDTHH:mm:ss');

    return serverTimestamp + 'Z';
  },

  'createReminder': function (date, time, taskID) {

    var self = this;

    var deferred = new WBDeferred();
    var timeParts = time.split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var reminderDate = moment(date);
    reminderDate.add(hours, 'hours').add(minutes, 'minutes');
    var timestamp = self.convertLocalTimeToServerTime(reminderDate.format());

    background.fetchReminderForTask(taskID)
      .always(function (reminders) {

        var reminder = reminders && reminders.length && reminders[0];
        if (reminder) {
          background.updateReminder(timestamp, reminder.revision, reminder.id)
            .done(deferred.resolve, deferred);
        }
        else {
          background.createReminder(timestamp, taskID)
            .done(deferred.resolve, deferred);
        }
      });

    return deferred.promise();
  },

  'syncAllThethings': function (data) {

    var self = this;
    var shouldCreateTask = data.createTask;
    var listID = data.listID;
    var taskID = data.taskID;
    var taskTitle = data.taskTitle;
    var steps = data.steps;
    var date = data.date;
    var time = data.time;

    var taskIDDeferred = new WBDeferred();
    var stepsDeferred = new WBDeferred();
    var timeDeferred = new WBDeferred();

    if (shouldCreateTask) {
      self.createTaskAndSetTaskID(taskTitle, listID)
        .done(function (task) {

          taskIDDeferred.resolve(task.id);
        });
    }
    else {
      self.setTaskID(taskID)
        .done(function () {

          taskIDDeferred.resolve(taskID);
        });
    }

    taskIDDeferred.done(function (taskID) {

      if (steps && steps.length) {
        self.createSteps(steps, taskID)
          .done(stepsDeferred.resolve, stepsDeferred);
      }
      else {
        stepsDeferred.resolve();
      }

      if (date && time) {
        self.createReminder(date, time, taskID)
          .done(timeDeferred.resolve, timeDeferred);
      }
    });

    return when(stepsDeferred, timeDeferred).promise();
  }
};