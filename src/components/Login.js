'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Login = React.createClass({

  'login': function () {

    console.log('login clicked');
    background.login();
  },

  'render': function () {

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
            className="button bg-green white"
            onClick={this.login}>
              Login
          </button>
        </div>
      </div>
    );
  }
});

module.exports = Login;