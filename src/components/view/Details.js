'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();
var TaskInlineEdit = require('./TaskInlineEdit');
var classNames = require('classnames');
var actions = require('../../actions/appActions');
var moment = require('moment');

var Details = React.createClass({

  'renderTask': function () {
    return '';
  },

  'onClickStats': function () {

  },

  'onClickSettings': function () {

  },

  'onClickHelp': function () {

  },

  'completeMainTask': function () {

    var self = this;
    background.fetchTask(function (task) {
      background.updateTask(task, {'completed':!self.props.task.completed}).always(function () {
        self.props.onUpdateTask();
        self.state.subTasks.map(function (subtask) {
          self.toggleSubtask(subtask, true);
        });

        background.resetTimers();
        actions.setTaskID('');
      });
    });
  },

  'updateTaskTitle': function (newTitle) {

    var self = this;
    background.updateTask(self.props.task, {'title':newTitle}).always(function () {
      self.props.onUpdateTask();
    });
  },

  'updateSubtaskTitle': function (subtask, newTitle) {

    var self = this;
    background.updateSubtask(subtask, {'title':newTitle}).always(self.fetchSubtasks, self);
  },

  'toggleSubtask': function (subtask, override) {

    var self = this;
    var shouldComplete = override === true ? true: !subtask.completed;
    background.updateSubtask(subtask, {'completed':shouldComplete}).always(self.fetchSubtasks, self);
  },

  'fetchSubtasks': function () {

    var self = this;
    background.fetchSubtasks(self.props.task.id).always(function (subTasks) {
      subTasks = subTasks || [];
      self.setState({
        'subTasks': subTasks,
      });
    });
  },

  'taskStyles': function (task) {

    return classNames(
      'pictogram-icon', 'wundercon', 'gray', 'mr1',
      {
        'icon-checkbox-filled': task.completed,
        'icon-checkbox': !task.completed
    });
  },

  'renderSubtasks': function () {

    var self = this;
    return self.state.subTasks.map(function (subtask) {
      var classList = self.taskStyles(subtask);
      return <li key={subtask.id} value={subtask.id}>
               <TaskInlineEdit className={classList} onClick={self.toggleSubtask.bind(self, subtask)} updateValue={self.updateSubtaskTitle.bind(self, subtask)} title={subtask.title}/>
             </li>;
    });
  },

  'componentDidMount': function () {

    var self = this;
    var task = self.props.task;
    if (task) {
      self.fetchSubtasks();
    }
  },

  'getTimeString': function () {

    return actions.fetchReminderForTask(taskID).done(function (reminder) {

      if (reminder && reminder.date) {
        var date = moment(reminder.date);
        var daysLeft = '';

        return 'You have 3 days and 4 hours to get your task done.'
      }
    });
  },

  'getInitialState': function () {

    return {
      'subTasks': []
    }
  },

  'render': function () {

    var self = this;
    var task = self.props.task;
    var renderedSubtasks = self.state.subTasks && self.renderSubtasks();
    var classList = self.taskStyles(task);

    return (
      <div className="details">
        <div className="header details">
          <span className="pictogram-icon wundercon icon-inbox"></span>
          <h2>You have 3 days and 4 hours to get your task done.</h2>
        </div>
        <div className="content-wrapper">
          <TaskInlineEdit className={classList} textClasses="main-task mb1 inline-block" onClick={self.completeMainTask} updateValue={self.updateTaskTitle} title={task.title}/>
          <ul className="subtasks list-reset">
            {renderedSubtasks}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Details;