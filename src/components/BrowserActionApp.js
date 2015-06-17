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

      if ('accessToken' in changes) {
        self.onChangeAccessToken(changes.accessToken.newValue);
      }
      else if ('backgroundState' in changes) {
        self.onChangeBackgroundState(changes.backgroundState.newValue);
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

  'onChangeBackgroundState': function (backgroundState) {

    this.setProps({
      'backgroundState': backgroundState
    });
  },

  'componentDidMount': function () {

    var self = this;
    self.bindToStorage();
    self.bindToApplicationState();
  },

  'fetchTaskData': function () {

    var self = this;
    background.fetchTask(function (task) {
      self.setProps({
        'task': task
      });
    });
  },

  'getInitialState': function () {

    return {};
  },

  'render': function () {

    var self = this;
    var props = self.props;
    var state = self.state;
    var loggedIn = props.loggedIn;
    var taskDefined = props.task;

    if (loggedIn && !taskDefined) {
      return <Edit {...props} {...state} onComplete={self.fetchTaskData}/>;
    }
    else if (loggedIn && taskDefined) {
      return <View {...props} {...state} onComplete={self.fetchTaskData}/>;
    }
    else {
      return <Login {...props} {...state}/>;
    }
  }
});

module.exports = BrowserActionApp;