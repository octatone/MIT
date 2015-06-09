'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Task = React.createClass({

  'fetchTasks': function (listID) {

    var self = this;

    background.fetchTasks(listID).always(function (tasks) {

      self.setState({
        'tasks': tasks || []
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

    return {
      'tasks': []
    };
  },

  'componentDidMount': function () {

    var self = this;
    var lists = self.props.lists;

    if (lists.length) {
      self.fetchTasks(lists[0].id);
    }
  },

  'render': function () {

    var listOptions = this.renderListOptions();
    var taskOptions = this.renderTaskOptions();

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
          <select className="tasks block px1 full-width">
            {taskOptions}
          </select>

          <h4 className="subheading">Or create a new one</h4>
          <input className="task block fit-width field-light px1" placeholder="Create a task" />
          <div className="button-wrapper">
            <span className="pictogram-icon wundercon icon-back white"></span>
            <button className="bg-blue left-align white">Next</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Task;