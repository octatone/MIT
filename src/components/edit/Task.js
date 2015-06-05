'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Task = React.createClass({

  'render': function () {

    return (
      <h2>What is the most important thing to get done <b>today</b></h2>
      <div className="task-choice">
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