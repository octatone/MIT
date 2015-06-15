'use strict';

var React = require('react/addons');
var applicationState = require('./stores/applicationState');
var BrowserActionApp = React.createFactory(require('./components/BrowserActionApp'));
var mountNode = document.getElementById('react-main-mount');

var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

function renderApp (lists, task, storageData) {

  storageData = storageData || {};

  var browserActionApp = new BrowserActionApp({
    'lists': lists || [],
    'task': task,
    'loggedIn': !!storageData.accessToken,
    'exchangingCode': !!storageData.exchangingCode
  });

  React.render(browserActionApp, mountNode);
}

background.fetchData(function (storageData) {

  if (storageData.accessToken) {
    background.fetchLists().always(function (lists) {
      background.fetchTask(function (task) {
        renderApp(lists, task, storageData);
      });
    });
  }
  else {
    renderApp(undefined, undefined, storageData);
  }
});