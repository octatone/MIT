'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Stats = React.createClass({

  'render': function () {

    return (
      <div className="stats container">
        hi
      </div>
    );
  }
});

module.exports = Stats;