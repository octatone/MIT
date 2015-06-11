'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Details = React.createClass({

  'renderTask': function () {
    return '';
  },

  'completeMainTask': function () {

    var self = this;
    background.toggleTaskComplete(self.props.task, true).always(function () {
      background.fetchTask(function () {
        self.state.subTasks.map(function (subtask) {
          self.toggleSubtask(subtask, true);
        });
      });
    });
  },

  'toggleSubtask': function (subtask, override) {

    var self = this;
    var shouldComplete = override === true ? true: !subtask.completed;
    background.toggleSubtaskComplete(subtask, shouldComplete).always(self.fetchSubtasks.bind(self));
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
               <a className={classList} onClick={self.toggleSubtask.bind(self, subtask)}></a>
               {subtask.title}
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
    console.log(classList)
    return (
      <div className="details container">
        <div className="header details">
          <span className="pictogram-icon wundercon icon-inbox"></span>
          <h2>You have 3 days and 4 hours to get your task done.</h2>
        </div>
        <div className="content-wrapper">
          <a className={classList} onClick={self.completeMainTask}></a>
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