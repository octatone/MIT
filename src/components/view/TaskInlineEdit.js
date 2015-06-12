'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var TaskInlineEdit = React.createClass({

  'enterEditMode': function () {

    this.setState({
      'editMode': true
    })
  },

  'updateValue': function (ev) {

    var self = this;
    self.props.updateValue(ev.target.value);
    self.exitEditMode();
  },

  'exitEditMode': function () {

    this.setState({
      'editMode': false
    });
  },

   'getInitialState': function () {

    return {
      'editMode': false
    }
  },

  'render': function () {

    var self = this;
    var props = self.props;

    if (self.state.editMode === true) {
      return (
        <span>
          <input onBlur={self.updateValue} defaultValue={props.title}/>
        </span>
      );
    }
    else {
      return (
        <span>
          <a className={props.className} onClick={props.onClick}></a>
          <span className={props.textClasses} onClick={self.enterEditMode}>{props.title}</span>
        </span>
      );
    }
  }
});

module.exports = TaskInlineEdit;