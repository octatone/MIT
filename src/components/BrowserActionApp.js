'use strict';

var React = require('react/addons');
var applicationState = require('../stores/applicationState');
var bindableMixin = require('../mixins/bindable');
var Login = require('./Login');
var Edit = require('./edit/Edit');
var View = require('./view/View');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var BrowserActionApp = React.createClass({

  'mixins': [
    bindableMixin
  ],

  'bindToApplicationState': function () {

    var self = this;
    self.bindTo(applicationState, 'change', function () {

      var state = applicationState.getAll();
      self.setState(state);
    });
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

      if (changes.accessToken) {
        self.onChangeAccessToken(changes.accessToken.newValue);
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

  'onChangeAccessToken': function (accessToken) {

    var self = this;
    background.fetchLists().always(function (lists) {

      self.setProps({
        'lists': lists || [],
        'loggedIn': !!accessToken
      });
    });
  },

  'componentDidMount': function () {

    var self = this;
    self.bindToStorage();
    self.bindToApplicationState();
  },

  'getInitialState': function () {

    return {};
  },

  'render': function () {

    var self = this;
    var props = self.props;
    var state = self.state;
    var loggedIn = props.loggedIn;
    var taskDefined = props.taskID;

    if (loggedIn && !taskDefined) {
      return <Edit {...props} {...state}/>;
    }
    else if (loggedIn && taskDefined) {
      return <View {...props} {...state}/>;
    }
    else {
      return <Login/>;
    }
  }
});

module.exports = BrowserActionApp;