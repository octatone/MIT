'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Time = React.createClass({

  'render': function () {

    return (
      <div class="time">
        <h2> By when does it need to be completed? </h2>
        <input type="time" className="due-date" />
      </div>
    );
  }
});

module.exports = Time;