'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Time = React.createClass({

  'render': function () {

    return (
      <div className="time p2 center container">
        <h4 className="bold inline-block m0 mb1">What time today does it need to be completed? </h4>
        <input type="time" className="due-date block full-width field-light px1 mt1 mb1" />
        <div className="block mt3 mb1">
          <span className="pictogram-icon wundercon icon-checkmark white absolute-center"></span>
          <button className="circle bg-blue"></button>
        </div>
      </div>
    );
  }
});

module.exports = Time;