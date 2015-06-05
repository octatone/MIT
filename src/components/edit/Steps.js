'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Steps = React.createClass({


  'onKeydown': function (e) {

    // if enter, add an li with the input val
  },

  'render': function () {

    return (
      <div className="steps">
        <h2> What are the steps to get this done today </h2>

        <input className="step-input" placeolder="Add a Step" onKeydown={onKeydown} />
        <ul>

        </ul>
      </div>
    );
  }
});

module.exports = Steps;