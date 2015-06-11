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

        <div className="center py4">
          <img src="../icons/clock.png" width="150px"/>
        </div>

        <div className="center pb3">
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