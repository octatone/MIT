'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Time = React.createClass({

  'onChangeDate': function (e) {

    this.setState({
      'date': e.target.value
    });
  },

  'onChangeTime': function (e) {

    this.setState({
      'time': e.target.value
    });
  },

  'onClickNext': function () {

    var self = this;
    var state = self.state;
    self.props.onDone({
      'date': state.date,
      'time': state.time
    });
  },

  'getInitialState': function () {

    return {
      'date': undefined,
      'time': undefined
    };
  },

  'render': function () {

    var self = this;
    return (
      <div className="time container">
        <div className="header time">
          <span className="pictogram-icon wundercon icon-reminder"></span>
          <h2 className="inline-block m0 mb1">When and at what time does this need to be completed?</h2>
        </div>
        <div className="content-wrapper">
          <h4 className="subheading">Pick a date and time that is practical</h4>
          <div className="fake-input mt1 mb1">
            <input
              onChange={self.onChangeDate}
              type="date"
              className="due-date inline-block half-width" />
            <span className="blocker"></span>
            <input
              onChange={self.onChangeTime}
              type="time"
              className="due-date inline-block " />
          </div>
          <div className="button-wrapper">
            <button
              onClick={self.props.onBack}
              className="left ml1 button button-outline blue">
              Back
            </button>
            <span className="pictogram-icon wundercon icon-back white"></span>
            <button
              onClick={self.onClickNext}
              className="bg-blue left-align white next">
                Next
            </button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Time;