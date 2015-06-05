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
      <div className="task-choice p2 center container">
        <h4 className="bold inline-block m0 mb1">What is the most important thing to get done today</h4>
        <select
          onChange={this.onListSelectChange}
          className="lists block px1 full-width"
        >
          {listOptions}
        </select>

        <select className="tasks block px1 full-width">
          {taskOptions}
        </select>

        <div className="divider mb2 mt2 absolute-center"> or </div>
        <input className="task block fit-width field-light px1" placeholder="Create a task" />
        <div className="block mt3 mb1">
          <span className="pictogram-icon wundercon icon-checkmark white absolute-center"></span>
          <button className="circle bg-blue"></button>
        </div>
      </div>
    );
  }
});

module.exports = Task;