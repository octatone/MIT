'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Details = React.createClass({

  'render': function () {

    return (
      <div className="details container">
        hi
      </div>
    );
  }
});

module.exports = Details;