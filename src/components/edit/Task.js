'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Task = React.createClass({

  'render': function () {

    return (
      <div className="task-choice p2 center container">
        <h4 className="bold inline-block m0 mb1">What is the most important thing to get done today?</h4>
        <select className="lists block px1 full-width">
          <option> Select a List </option>
        </select>

        <select className="tasks block px1 full-width">
          <option> Select a Task in List X </option>
        </select>

        <div className="divider mb2 mt2 absolute-center"> or </div>
        <input className="task block fit-width field-light px1" placeholder="Create a task" />
      </div>
    );
  }
});

module.exports = Task;