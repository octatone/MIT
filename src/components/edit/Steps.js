'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Steps = React.createClass({

  'keydown': function (ev) {
    if (ev.which === 13) {
      // add a subtask
    }
  },

  'renderSteps': function () {

    return <li >{''}</li>;
  },

  'render': function () {

    var steps = this.renderSteps();

    return (
      <div className="steps p2 center container">
        <h4 className="inline-block m0 mb1">What are the steps to do this today? </h4>
        <input className="step-input block fit-width field-light px1 mt1 mb1" placeolder="Step 1" onKeyDown={this.keydown}/>
        <ul>
        {steps}
        </ul>
      </div>
    );
  }
});

module.exports = Steps;