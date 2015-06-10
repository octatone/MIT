'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Time = React.createClass({

  'render': function () {

    return (
       <div className="time container">
        <div className="header time">
          <span className="pictogram-icon wundercon icon-reminder"></span>
          <h2 className="inline-block m0 mb1">When and at what time does this need to be completed?</h2>
        </div>
        <div className="content-wrapper">
          <h4 className="subheading">Pick a date and time that is practical</h4>
          <div className="fake-input mt1 mb1">
            <input type="date" className="due-date inline-block half-width" />
            <span className="blocker"></span>
            <input type="time" className="due-date inline-block " />
          </div>
          <div className="button-wrapper">
            <span className="pictogram-icon wundercon icon-back white"></span>
            <button className="bg-blue left-align white next">Next</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Time;