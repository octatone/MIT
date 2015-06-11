'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Details = React.createClass({

  'renderTask': function () {
    return '';
  },

  'fetchSubtasks': function (task) {

    var self = this;
    background.fetchSubtasks(task.id).always(function (subTasks) {
      subTasks = subTasks || [];
      self.setState({
        'subTasks': subTasks,
      });
    });
  },

  'renderSubtasks': function () {

    return this.state.subTasks.map(function (subtask) {
      return <li key={subtask.id} value={subtask.id}>
                <a className="pictogram-icon wundercon icon-checkbox gray mr1"></a>
                {subtask.title}
             </li>;
    });
  },

  'componentDidMount': function () {

    var self = this;
    var task = self.props.task;
    if (task) {
      self.fetchSubtasks(task);
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
    // get remaining time
    // separate main task from steps
    // add links
    // add editing

    return (
      <div className="details container">
        <div className="header details">
          <span className="pictogram-icon wundercon icon-inbox"></span>
          <h2>You have 3 days and 4 hours to get your task done.</h2>
        </div>
        <div className="content-wrapper">
          <a className="pictogram-icon wundercon icon-checkbox gray mr1"></a>
          <h2 className="inline-block m0 mb1 main-task">{task.title}</h2>
          <ul className="subtasks list-reset">
            {renderedSubtasks}
          </ul>

          <div className="options">
            <a className="pictogram-icon wundercon icon-background gray col col-4 bottom-options"></a>
            <a className="pictogram-icon wundercon icon-settings gray  col col-4 bottom-options"></a>
            <a className="pictogram-icon wundercon icon-support gray col col-4 bottom-options last"></a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Details;