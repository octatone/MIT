'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();
var TaskInlineEdit = require('./TaskInlineEdit');

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
    background.updateTask(self.props.task, {'completed':!self.props.task.completed}).always(function () {
      self.props.onUpdateTask();
      self.state.subTasks.map(function (subtask) {
        self.toggleSubtask(subtask, true);
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
    background.updateSubtask(subtask, {'title':newTitle}).always(self.fetchSubtasks.bind(self));
  },

  'toggleSubtask': function (subtask, override) {

    var self = this;
    var shouldComplete = override === true ? true: !subtask.completed;
    background.updateSubtask(subtask, {'complete':shouldComplete}).always(self.fetchSubtasks.bind(self));
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

  'renderSubtasks': function () {

    var self = this;
    return self.state.subTasks.map(function (subtask) {
      var classList = 'pictogram-icon wundercon gray mr1';
      classList += (subtask.completed ? ' icon-checkbox-filled': ' icon-checkbox');
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

  'getInitialState': function () {

    return {
      'subTasks': []
    }
  },

  'render': function () {

    var self = this;
    var task = self.props.task;
    var renderedSubtasks = self.state.subTasks && self.renderSubtasks();
    var classList = 'pictogram-icon wundercon gray mr1';
    classList += (task.completed ? ' icon-checkbox-filled': ' icon-checkbox');

    return (
      <div className="details container">
        <div className="header details">
          <span className="pictogram-icon wundercon icon-inbox"></span>
          <h2>You have 3 days and 4 hours to get your task done.</h2>
        </div>
        <div className="content-wrapper">
          <TaskInlineEdit className={classList} textClasses="main-task mb1 inline-block" onClick={self.completeMainTask} updateValue={self.updateTaskTitle} title={task.title}/>
          <ul className="subtasks list-reset">
            {renderedSubtasks}
          </ul>

          <div className="options">
            <a className="pictogram-icon wundercon icon-background gray col col-4 bottom-options" onClick={self.onClickStats}></a>
            <a className="pictogram-icon wundercon icon-settings gray  col col-4 bottom-options" onClick={self.onClickSettings}></a>
            <a className="pictogram-icon wundercon icon-support gray col col-4 bottom-options last" onClick={self.onClickHelp}></a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Details;