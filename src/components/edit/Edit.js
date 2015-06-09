'use strict';

var React = require('react/addons');
var Task = require('./Task');
var Steps = require('./Steps');
var Time = require('./Time');
var actions = require('../../actions/appActions');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Edit = React.createClass({

  'onTaskDone': function () {

    this.setState({
      'subview': 'steps'
    });
  },

  'onStepsDone': function () {

    this.setState({
      'subview': 'time'
    });
  },

  'onTimeDone': function () {

    appActions.setDoneEditing();
  },

  'getInitialState': function () {

    return {
      'subview': 'task'
    };
  },

  'render': function () {

    var self = this;
    var props = this.props;
    var subviewState = self.state.subview;
    var subview;

    switch (subviewState) {
      case 'steps':
        subview = <Steps {...props} onDone={self.onStepsDone}/>;
        break;
      case 'time':
        subview = <Time {...props} onDone={self.onTimeDone}/>;
        break;
      default:
        subview = <Task {...props} onDone={self.onTaskDone}/>;
    }

    return (
      <div className="edit">
        {subview}
      </div>
    );
  }
});

module.exports = Edit;