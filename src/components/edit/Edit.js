'use strict';

var React = require('react/addons');
var Task = require('./Task');
var Steps = require('./Steps');
var Time = require('./Time');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Edit = React.createClass({

  'getInitialState': function () {

    return {
      'subview': 'task'
    };
  },

  'render': function () {

    var self = this;
    var props = this.props;
    var subviewState = self.state.subview;
    var subview;

    switch (subviewState) {
      case 'steps':
        subview = <Steps {...props} />;
        break;
      case 'time':
        subview = <Time {...props} />;
        break;
      default:
              subview = <Steps {...props} />;

//        subview = <Task {...props} />;
    }

    return (
      <div className="edit">
        {subview}
      </div>
    );
  }
});

module.exports = Edit;