'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var TaskInlineEdit = React.createClass({

  'render': function () {

    var self = this;
    var props = self.props;
    return (
      <span>
        <a className={props.className} onClick={props.onClick}></a>
        <span className={props.textClasses}>{props.title}</span>
      </span>
    );
  }
});

module.exports = TaskInlineEdit;