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


  'showTaskEdit': function () {

    this.setState({
      'subview': 'task'
    });
  },

  'showStepsEdit': function () {

    this.setState({
      'subview': 'steps'
    });
  },

  'showTimeEdit': function () {

    this.setState({
      'subview': 'time'
    });
  },

  'onStepsBack': function () {

    this.showTaskEdit();
  },

  'onTimeBack': function () {

    this.showStepsEdit();
  },

  'onTaskDone': function (taskData) {

    console.log(taskData);

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

    console.log(steps);

    var self = this;
    self.setState({
      'steps': steps
    }, function () {

      self.showTimeEdit();
    });
  },

  'onTimeDone': function (timeData) {

    console.log(timeData);

    var self = this;
    self.setState({
      'time': timeData.time,
      'date': timeData.date
    }, function () {

      console.dir(self.state);

      actions.syncAllThethings(self.state).done(self.props.onComplete, self);
    });
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
      <div className={editClasses}>
        <div className={taskClasses}>
          <Task {...props} onDone={self.onTaskDone}/>
        </div>

        <div className={stepsClasses}>
          <Steps {...props} onDone={self.onStepsDone} onBack={self.onStepsBack}/>
        </div>

        <div className={timeClasses}>
          <Time {...props} onDone={self.onTimeDone} onBack={self.onTimeBack}/>
        </div>
      </div>
    );
  }
});

module.exports = Edit;