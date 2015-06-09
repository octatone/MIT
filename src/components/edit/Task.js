'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();
var actions = require('../../actions/appActions');

var Task = React.createClass({

  'fetchTasks': function (listID) {

    var self = this;
    background.fetchTasks(listID).always(function (tasks) {

      tasks = tasks || [];
      self.setState({
        'tasks': tasks,
        'taskID': tasks.length ? tasks[0].id : undefined
      });
    });
  },

  'onListSelectChange': function (e) {

    var self = this;

    self.setState({
      'selectedList': e.target.value
    });

    self.fetchTasks(e.target.value);
  },

  'onTaskSelectChange': function (e) {

    this.setState({
      'selectedTask': e.target.value
    });
  },

  'onTaskInputChange': function (e) {

    this.setState({
      'taskTitle': e.target.value
    });
  },

  'onClickDone': function () {

    var self = this;
    var state = self.state;
    var taskTitle = state.taskTitle;
    if (taskTitle && taskTitle.length) {
      console.info('creating tast', taskTitle);
      actions.createTaskAndSetTaskID(taskTitle, self.state.selectedList);
    }
    else {
      console.log('setting task id to', state.taskID);
      actions.setTaskID(state.taskID);
    }
  },

  'renderTaskOptions': function () {

    return this.state.tasks.map(function (task) {

      return <option key={task.id} value={task.id}>{task.title}</option>;
    });
  },

  'renderListOptions': function () {

    return this.props.lists.map(function (list) {

      return <option key={list.id} value={list.id}>{list.title}</option>;
    });
  },

  'getInitialState': function () {

    var self = this;
    var lists = self.props.lists;
    return {
      'tasks': [],
      'selectedList': lists && lists.length && lists[0].id,
      'taskID': undefined,
      'taskTitle': undefined
    };
  },

  'componentDidMount': function () {

    var self = this;
    var lists = self.props.lists || [];
    if (lists.length) {
      self.fetchTasks(lists[0].id);
    }
  },

  'render': function () {

    var self = this;

    var state = self.state;
    var listOptions = self.renderListOptions();
    var taskOptions = self.renderTaskOptions();
    var hasTasks = !!(state.tasks && state.tasks.length);
    var ready = !!(state.taskID || state.taskTitle)

    return (
      <div className="task-choice container">
        <div className="header tasks">
          <span className="pictogram-icon wundercon icon-star-filled"></span>
          <h2 className="inline-block m0 mb1">What is the most important thing to get done today?</h2>
        </div>
        <div className="content-wrapper">
          <h4 className="subheading">Choose a list</h4>
          <select
            onChange={this.onListSelectChange}
            className="lists block px1 full-width"
          >
            {listOptions}
          </select>
          <h4 className="subheading">Choose an existing task</h4>
          <select
            onChange={self.onTaskInputChange}
            className="tasks block px1 full-width"
            disabled={!hasTasks}>
            {taskOptions}
          </select>

          <h4 className="subheading">Or create a new one</h4>
          <input
            className="task block fit-width field-light px1"
            placeholder="Input a thing you want to get done"
            onChange={self.onTaskInputChange}/>

          <div className="button-wrapper">
            <span className="pictogram-icon wundercon icon-back white"></span>
            <button
              className="bg-blue left-align white next"
              onClick={self.onClickDone}
              disabled={!ready}>
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Task;