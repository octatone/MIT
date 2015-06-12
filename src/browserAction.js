'use strict';

var React = require('react/addons');
var applicationState = require('./stores/applicationState');
var BrowserActionApp = React.createFactory(require('./components/BrowserActionApp'));
var mountNode = document.getElementById('react-main-mount');

var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

function renderApp (lists, task, accessToken) {

  var browserActionApp = new BrowserActionApp({
    'lists': lists || [],
    'loggedIn': !!accessToken,
    'task': task
  });

  React.render(browserActionApp, mountNode);
}

background.fetchToken(function (accessToken) {

  if (accessToken) {
    background.fetchLists().always(function (lists) {
      background.fetchTask(function (task) {
        renderApp(lists, task, accessToken);
      });
    });
  }
  else {
    renderApp();
  }
});