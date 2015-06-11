'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();
var actions = require('../../actions/appActions');

var Steps = React.createClass({

  'onClickNext': function () {

    var self = this;
    self.props.onDone(self.state.steps);
  },

  'addStep': function () {

    var self = this;
    var state = self.state;
    var step = state.stepTitle;
    if (step && step.length) {
      var newSteps = state.steps.slice();
      newSteps.push(step);
      self.setState({
        'steps': newSteps,
        'stepTitle': undefined
      });
    }
  },

  'onStepKeydown': function (e) {

    if (e.which === 13) {
      this.addStep();
    }
  },

  'onStepChange': function (e) {

    var title = e.target.value;
    this.setState({
      'stepTitle': title
    });
  },

  'onAddStepClick': function () {

    this.addStep();
  },

  'deleteStep': function (index) {

    var self = this;
    var state = self.state;
    state.steps.splice(index, 1);
    self.setState({
      'steps': state.steps,
      'stepTitle': undefined
    });
  },

  'renderSteps': function () {

    var self = this;
    return this.state.steps.map(function (step, index) {
      return <li key={step} className="num-list">{step} <a className="right pictogram-icon wundercon icon-x-active delete-icon light-gray" onClick={self.deleteStep.bind(self, index)}></a></li>;
    });
  },

  'getInitialState': function () {

    return {
      'steps': [],
      'stepTitle': undefined
    };
  },

  'render': function () {

    var self = this;
    var steps = self.renderSteps();
    var stepTitle = self.state.stepTitle;

    return (
      <div className="steps container">
        <div className="header steps">
          <span className="pictogram-icon wundercon icon-add"></span>
          <h2 className="inline-block m0 mb1">
            What are the steps needed to get this done?
          </h2>
        </div>

        <div className="content-wrapper">
          <h4 className="subheading">
            Break this to do down into small steps
          </h4>

          <input
            value={stepTitle}
            className="step-input block inline-block field-light px1 mt1 mb1"
            placeholder="Add a step"
            onKeyDown={self.onStepKeydown}
            onChange={self.onStepChange}/>

          <button
            className="ml1 button button-outline yellow left-align inline-block add"
            onClick={self.onAddStepClick}>
              Add
          </button>

          <ul className="list-reset steps-list">
            {steps}
          </ul>

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

module.exports = Steps;