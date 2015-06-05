'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Task = React.createClass({

  'render': function () {

    return (
      <div className="task-choice">
        <select className="lists">
        </select>

        <select className="tasks">
        </select>

        <input className="task" />
      </div>
    );
  }
});

module.exports = Task;