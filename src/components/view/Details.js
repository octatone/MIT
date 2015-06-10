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
      console.log(subTasks)

      subTasks = subTasks || [];
      self.setState({
        'subTasks': subTasks,
      });
    });
  },

  'renderSubtasks': function () {
    return this.props.subTasks && this.props.subTasks.map(function (subtask) {
      return <li key={subtask.id} value={subtask.id}>{subtask.title}</li>;
    });
  },

  'componentDidMount': function () {

    var self = this;
    console.log(task)
    if (task) {
      self.fetchSubtasks(task);
    }
  },

  'render': function () {

    var self = this;
    var task = self.props.task;
    var renderedSubtasks = self.renderSubtasks();

    return (
      <div className="details  container">
        <div className="header details">
          <a className="pictogram-icon wundercon icon-checkbox white"></a>
          <h2 className="inline-block m0 mb1">{task.title}</h2>
        </div>
        <div className="content-wrapper">
          <ul>
          {renderedSubtasks}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Details;