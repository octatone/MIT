'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Time = React.createClass({

  'render': function () {

    return (
      <div class="time p2 center container">
        <h4 className="bold inline-block m0 mb1">By when does it need to be completed? </h4>
        <input type="time" className="due-date" />
      </div>
    );
  }
});

module.exports = Time;