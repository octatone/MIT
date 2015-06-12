'use strict';

var React = require('react/addons');
var Task = require('./Task');
var Steps = require('./Steps');
var Time = require('./Time');
var actions = require('../../actions/appActions');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();
var classNames = require('classnames');
var wunderbits = window.wunderbits;
var WBDeferred = wunderbits.core.WBDeferred;
var when = wunderbits.core.lib.when;

var Edit = React.createClass({

  'transitionEnded': function () {

    var self = this;
    self.transitionCallbacks.forEach(function (callback) {

      callback();
    });
    self.transitionCallbacks = [];
  },

  'onTransitionEnd': function (callback) {

    this.transitionCallbacks.push(callback);
  },

  'showTaskEdit': function () {

    var self = this;
    self.setState({
      'subview': 'task'
    }, function () {
      self.onTransitionEnd(function () {
        self.refs.taskEdit.focus();
      });
    });
  },

  'showStepsEdit': function () {

    var self = this;
    self.setState({
      'subview': 'steps'
    }, function () {
      self.onTransitionEnd(function () {
        self.refs.stepsEdit.focus();
      });
    });
  },

  'showTimeEdit': function () {

    var self = this;
    self.setState({
      'subview': 'time'
    }, function () {
      self.onTransitionEnd(function () {
        self.refs.timeEdit.focus();
      });
    });
  },

  'onStepsBack': function () {

    this.showTaskEdit();
  },

  'onTimeBack': function () {

    this.showStepsEdit();
  },

  'onTaskDone': function (taskData) {

    var self = this;
    self.setState({
      'listID': taskData.listID,
      'taskTitle': taskData.taskTitle,
      'taskID': taskData.taskID,
      'createTask': taskData.createTask
    }, function () {

      self.showStepsEdit();
    });
  },

  'onStepsDone': function (steps) {

    var self = this;
    self.setState({
      'steps': steps
    }, function () {

      self.showTimeEdit();
    });
  },

  'onTimeDone': function (timeData) {

    var self = this;
    self.setState({
      'time': timeData.time,
      'date': timeData.date
    }, function () {

      actions.syncAllThethings(self.state).done(self.props.onComplete, self);
    });
  },

  'getInitialState': function () {

    return {
      'subview': 'task'
    };
  },

  'componentWillMount': function () {

    this.transitionCallbacks = [];
  },

  'componentDidMount': function () {

    var self = this;
    React.findDOMNode(self.refs.edit).addEventListener(
      'transitionend',
      self.transitionEnded,
      false
    );
  },

  'render': function () {

    var self = this;
    var props = self.props;
    var state = self.state;
    var subviewState = state.subview;

    var isTimeVisible = subviewState === 'time';
    var isStepsVisible = subviewState === 'steps';
    var isTaskVisible = subviewState === 'task';

    var editClasses = classNames(
      'edit',
      {
        'step-2': isStepsVisible,
        'step-3': isTimeVisible
    });

    var taskClasses = classNames(
      'inline-block',
      {
        'muted': !isTaskVisible,
        'no-height': !isTaskVisible
    });

    var stepsClasses = classNames(
      'inline-block',
      {
        'muted': !isStepsVisible,
        'no-height': !isStepsVisible
    });

    var timeClasses = classNames(
      'inline-block',
      {
        'muted': !isTimeVisible,
        'no-height': !isTimeVisible
    });

    return (
      <div ref="edit" className={editClasses}>
        <div className={taskClasses}>
          <Task ref="taskEdit" {...props} onDone={self.onTaskDone}/>
        </div>

        <div className={stepsClasses}>
          <Steps ref="stepsEdit" {...props} taskID={state.taskID} onDone={self.onStepsDone} onBack={self.onStepsBack}/>
        </div>

        <div className={timeClasses}>
          <Time ref="timeEdit" {...props} taskID={state.taskID} onDone={self.onTimeDone} onBack={self.onTimeBack}/>
        </div>
      </div>
    );
  }
});

module.exports = Edit;