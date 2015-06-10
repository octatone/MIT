'use strict';

var applicationState = require('../stores/applicationState');

var chrome = window.chrome;
var syncStorage = chrome.storage.sync;
var background = chrome.extension.getBackgroundPage();

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
    background.createTask(taskTitle, listID)
      .done(function (task) {

        self.setTaskID(task.id);
      })
      .fail(function () {

        console.error(arguments);
      });
  },

  'createSteps': function (stepTitles, taskID) {

    var self = this;
    stepTitles.forEach(function (title) {

      background.createSubtask(title, taskID);
    });
  }
};