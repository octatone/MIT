'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Edit = React.createClass({

  'render': function () {

    return (
      <div className="edit">
        <button onClick={this.next}>Checkmark</button>
      </div>
    );
  }
});

module.exports = Edit;