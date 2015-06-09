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

    return <li>{''}</li>;
  },

  'render': function () {

    var steps = this.renderSteps();

    return (
      <div className="steps container">
        <div className="header steps">
          <span className="pictogram-icon wundercon icon-add"></span>
          <h2 className="inline-block m0 mb1">What steps are needed to get this done?</h2>
        </div>
        <div className="content-wrapper">
          <h4 className="subheading">Break down this task into small pieces</h4>
          <input className="step-input block inline-block field-light px1 mt1 mb1" placeholder="Add a step" onKeyDown={this.keydown}/>
          <button className="ml1 button button-outline yellow left-align inline-block add ">Add</button>
          <ul className="list-reset">
          {steps}
          </ul>
          <div className="button-wrapper">
            <span className="pictogram-icon wundercon icon-back white"></span>
            <button className="bg-blue left-align white next">Next</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Steps;