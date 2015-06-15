'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();
var classNames = require('classnames');

var messages = {
  'loggingIn': 'Launching Wunderlist login ...',
  'exchangingCode': 'Almost done ...'
};

var Login = React.createClass({

  'login': function () {

    background.login();
    this.setState({
      'state': 'loggingIn'
    });
  },

  'componentWillReceiveProps': function (nextProps) {

    if (nextProps.exchangingCode) {
      this.setState({
        'state': 'exchangingCode'
      });
    }
  },

  'getInitialState': function () {

    return {
      'state': this.props.exchangingCode ? 'exchangingCode' : undefined
    };
  },

  'render': function () {

    var self = this;
    var state = self.state;

    var buttonClasses = classNames(
      'button bg-green white',
      {
        'display-none': state.state !== undefined
    });

    var messageClasses = classNames({
      'display-none': state.state === undefined
    });

    var message = messages[state.state];

    return (
      <div className="login container">

        <div className="center pt3">
          <img src="../icons/clock.png" width="150px"/>
        </div>

        <h4 className="center mb0 bold">
          The Most Important Thing
        </h4>
        <h5 className="center m0">
          powered by Wunderlist
        </h5>

        <div className="center py3">
          <button
            className={buttonClasses}
            onClick={this.login}>
              Login
          </button>
          <div className={messageClasses}>
            {message}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Login;