'use strict';

var applicationState = require('../stores/applicationState');

var chrome = window.chrome;
var syncStorage = chrome.storage.sync;
var background = chrome.extension.getBackgroundPage();
var wunderbits = window.wunderbits;
var WBDeferred = wunderbits.core.WBDeferred;
var when = wunderbits.core.lib.when;

module.exports = {

  'setTaskID': function (taskID) {

    syncStorage.set({
      'taskID': taskID
    }, function () {

      applicationState.update('taskID', taskID);
    });
  },

  'createTaskAndSetTaskID': function (taskTitle, listID) {

    var self = this;
    return background.createTask(taskTitle, listID)
      .done(function (task) {

        self.setTaskID(task.id);
      })
      .fail(function () {

        console.error(arguments);
      });
  },

  'createSteps': function (stepTitles, taskID) {

    var self = this;
    var deferreds = [];

    stepTitles.forEach(function (title) {

      deferreds.push(background.createSubtask(title, taskID));
    });

    return when(deferreds).promise();
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
      taskIDDeferred.resolve(taskID);
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
        timeDeferred.resolve();
      }
    });

    return when(stepsDeferred, timeDeferred).promise();
  }
};