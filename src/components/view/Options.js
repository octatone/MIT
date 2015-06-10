'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Options = React.createClass({

  'render': function () {

    return (
      <div className="options container">
        hi
      </div>
    );
  }
});

module.exports = Options;