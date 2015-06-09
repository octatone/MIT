'use strict';

var React = require('react/addons');
var applicationState = require('../stores/applicationState');
var bindableMixin = require('../mixins/bindable');
var Login = require('./Login');
var Edit = require('./edit/Edit');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var BrowserActionApp = React.createClass({

  'mixins': [
    bindableMixin
  ],

  'bindToApplicationState': function () {

    var self = this;


  },

  'bindToStorage': function () {

    var self = this;

    chrome.storage.onChanged.addListener(function (changes, namespace) {

      for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);
      }
    });

    chrome.runtime.onMessage.addListener(function (request, sender) {

      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

      if (request.notifications === 'update') {
      }
    });
  },

  'componentDidMount': function () {

    var self = this;
    self.bindToStorage();
    self.bindToApplicationState();
  },

  'render': function () {

    var props = this.props;
    var loggedIn = props.loggedIn;
    var taskDefined = props.taskID;

    if (loggedIn && !taskDefined) {
      return <Edit {...props}/>;
    }
    else if (loggedIn && taskDefined) {
      // view details
    }
    else {
      return <Login/>;
    }
  }
});

module.exports = BrowserActionApp;