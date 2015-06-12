'use strict';

var React = require('react/addons');
var Options = require('./Options');
var Stats = require('./Stats');
var Details = require('./Details');
var actions = require('../../actions/appActions');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var View = React.createClass({

  'onClickBack': function () {

    this.setState({
      'subview': 'details'
    });
  },

  'onClickOptions': function () {

    this.setState({
      'subview': 'options'
    });
  },

  'onClickStats': function () {

    this.setState({
      'subview': 'stats'
    });
  },

  'getInitialState': function () {

    return {
      'subview': 'details'
    };
  },

  'setTask': function () {

    this.props.onComplete();
  },

  'render': function () {

    var self = this;
    var props = this.props;
    var subviewState = self.state.subview;
    var subview;

    switch (subviewState) {
      case 'options':
        subview = <Options {...props} onBack={self.onClickBack}/>;
        break;
      case 'stats':
        subview = <Stats {...props} onBack={self.onClickBack}/>;
        break;
      default:
        subview = <Details {...props} onUpdateTask={self.setTask}/>;
    }

    return (
      <div className="view">
        {subview}
      </div>
    );
  }
});

module.exports = View;