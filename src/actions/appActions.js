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

    console.info('createTaskAndSetTaskID', taskTitle, listID);
    var self = this;
    background.createTask(taskTitle, listID).done(function (task) {

      console.info('created task', task.id);
      self.setTaskID(task.id);
    });
  }
};