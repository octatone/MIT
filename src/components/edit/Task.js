'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Task = React.createClass({

  'render': function () {

    return (
      <div className="task-choice">
        <h2>What is the most important thing to get done today</h2>
        <select className="lists">
        </select>

        <select className="tasks">
        </select>

        <div className="divider"> or </div>

        <input className="task" placeholder="Create a task" />
      </div>
    );
  }
});

module.exports = Task;