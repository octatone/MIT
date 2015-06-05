'use strict';

var React = require('react/addons');
var Login = require('./Login');
var Edit = require('./edit/Edit');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var BrowserActionApp = React.createClass({

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

    this.bindToStorage();
  },

  'render': function () {

    var props = this.props;
    var loggedIn = props.loggedIn;
    var task = props.task;

    if (loggedIn && !task) {
      return <Edit {...props}/>;
    }
    else if (loggedIn && task) {
      // view details
    }
    else {
      return <Login/>;
    }
  }
});

module.exports = BrowserActionApp;