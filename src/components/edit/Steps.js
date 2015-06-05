'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Steps = React.createClass({

  'render': function () {

    return (
      <div className="steps">
      <input className="step-input" />
      <ul>

      </ul>
      </div>
    );
  }
});

module.exports = Steps;