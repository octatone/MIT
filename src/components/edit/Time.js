'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Time = React.createClass({

  'render': function () {

    return (
      <input type="time" className="due-date" />
    );
  }
});

module.exports = Time;