'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();
var actions = require('../../actions/appActions');
var classNames = require('classnames');

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
    var listID = e.target.value && parseInt(e.target.value, 10);

    self.setState({
      'selectedList': listID
    });

    self.fetchTasks(listID);
  },

  'onTaskSelectChange': function (e) {

    var taskID = e.target.value && parseInt(e.target.value, 10);
    this.setState({
      'selectedTask': taskID
    });
  },

  'onTaskInputChange': function (e) {

    this.setState({
      'taskTitle': e.target.value
    });
  },

  'onCreateNewClicked': function () {

    this.setState({
      'entryMode': 'createNew'
    });
  },

  'onChooseExistingClicked': function () {

    this.setState({
      'entryMode': 'chooseExisting'
    });
  },

  'onBackClicked': function () {

    this.setState({
      'entryMode': undefined
    });
  },

  'onClickDone': function () {

    var self = this;
    var state = self.state;
    var props = self.props;

    props.onDone({
      'taskTitle': state.taskTitle,
      'taskID': state.taskID,
      'listID': state.selectedList,
      'createTask': state.entryMode === 'createNew'
    });
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
      'taskTitle': undefined,
      'entryMode': undefined
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
    var ready = !!(state.taskID || state.taskTitle);

    var entryContainerClasses = classNames({
      'display-none': !!state.entryMode
    });
    var chooseListContainerClasses = classNames({
      'display-none': !state.entryMode
    });
    var chooseExistingContainerClasses = classNames({
      'display-none': state.entryMode !== 'chooseExisting'
    });
    var createNewContainerClasses = classNames({
      'display-none': state.entryMode !== 'createNew'
    });
    var buttonContainerClasses = classNames(
      'button-wrapper',
      {
        'display-none': !state.entryMode
    });

    return (
      <div className="task-choice container">
        <div className="header tasks">
          <span className="pictogram-icon wundercon icon-star-filled"></span>
          <h2 className="inline-block m0 mb1">
            What is the most important thing to get done?
          </h2>
        </div>
        <div className="content-wrapper">

          <div className={entryContainerClasses}>
            <button
              onClick={self.onChooseExistingClicked}
              className="button mt2 mb1 button-outline blue full-width">
              choose from existing
            </button>
            <button
              onClick={self.onCreateNewClicked}
              className="button button-outline blue full-width">
              add something new
            </button>
          </div>

          <div className={chooseListContainerClasses}>
            <h4 className="subheading">Choose a list</h4>
            <select
              onChange={this.onListSelectChange}
              className="lists block px1 full-width"
            >
              {listOptions}
            </select>
          </div>

          <div className={chooseExistingContainerClasses}>
            <h4 className="subheading">
              and a to do
            </h4>
            <select
              onChange={self.onTaskInputChange}
              className="tasks block px1 full-width"
              disabled={!hasTasks}>
              {taskOptions}
            </select>
          </div>

          <div className={createNewContainerClasses}>
            <input
              className="task block fit-width field-light px1"
              placeholder="Add the most important thing"
              onChange={self.onTaskInputChange}/>
          </div>

          <div className={buttonContainerClasses}>
            <button
              onClick={self.onBackClicked}
              className="left ml1 button button-outline blue">
                Back
            </button>
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