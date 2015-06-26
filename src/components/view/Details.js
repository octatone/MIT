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

  'renderReminderTime': function () {

    var self = this;
    var reminderTime = self.state.reminderTime;
    var str = 'Fetching task info ...'

    if (reminderTime) {
      var now = moment();
      var reminder = moment(reminderTime);
      var difference = reminder.diff(now);
      var duration = moment.duration(difference);

      if (difference >= 0) {
        str = 'You have ' +  duration.humanize() + ' to get your task done.';
      }
      else {
        str = 'Your task was due ' + duration.humanize(true);
      }
    }

    return str;
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

  'fetchReminderTime': function () {

    var self = this;
    actions.fetchReminderForTask(self.props.task.id).done(function (reminder) {

      if (reminder && reminder.date) {
        self.setState({
          'reminderTime': reminder.date
        });
      }
    });
  },

  'componentDidMount': function () {

    var self = this;
    var task = self.props.task;
    if (task) {
      self.fetchSubtasks();
      self.fetchReminderTime();
    }
  },

  'getInitialState': function () {

    return {
      'subTasks': [],
      'reminderTime': undefined
    }
  },

  'render': function () {

    var self = this;
    var task = self.props.task;
    var renderedSubtasks = self.state.subTasks && self.renderSubtasks();
    var classList = self.taskStyles(task);

    var reminderString = self.renderReminderTime();

    return (
      <div className="details">
        <div className="header details">
          <span className="pictogram-icon wundercon icon-inbox"></span>
          <h2>{reminderString}</h2>
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