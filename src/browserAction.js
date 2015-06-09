'use strict';

var React = require('react/addons');
var applicationState = require('./stores/applicationState');
var BrowserActionApp = React.createFactory(require('./components/BrowserActionApp'));
var mountNode = document.getElementById('react-main-mount');

var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

background.fetchToken(function (accessToken) {

  background.fetchLists().always(function (lists) {

    var browserActionApp = new BrowserActionApp({
      'lists': lists || [],
      'loggedIn': !!accessToken
    });

    React.render(browserActionApp, mountNode);
  });
});