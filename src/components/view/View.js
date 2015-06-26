'use strict';

var React = require('react/addons');
var Options = require('./Options');
var Stats = require('./Stats');
var Details = require('./Details');
var actions = require('../../actions/appActions');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var View = React.createClass({

  'onClickDetails': function () {

    this.setState({
      'subview': 'details'
    });
  },

  'onClickBack': function () {

    this.setState({
      'subview': 'details'
    });
  },

  'onClickSettings': function () {

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
      case 'details':
      default:
        subview = <Details {...props} onUpdateTask={self.setTask}/>;
    }

    return (
      <div className="view container">
        {subview}
        <div className="options">
          <a
            className="pictogram-icon wundercon icon-list gray col col-4 bottom-options"
            onClick={self.onClickDetails}></a>
          <a
            className="pictogram-icon wundercon icon-background gray col col-4 bottom-options"
            onClick={self.onClickStats}></a>
          <a
            className="pictogram-icon wundercon icon-settings gray col col-4 bottom-options last"
            onClick={self.onClickSettings}></a>
        </div>
      </div>
    );
  }
});

module.exports = View;