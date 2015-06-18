'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Stats = React.createClass({

  'renderStats': function () {

    var self = this;
    var domainTimes = self.props.domainTimes || {};

    var domains = Object.keys(domainTimes);
    domains.sort(function (a, b) {

      return domainTimes[a] < domainTimes[b];
    });

    return (
      <div>
        {domains.map(function (domain) {

          var seconds = domainTimes[domain];
          var minutes = Math.floor(seconds / 60);
          seconds = seconds - (minutes * 60);

          return (
            <div className="clearfix">
              <div className="col col-9 overflow-hidden">{domain}</div>
              <div className="col col-3 right-align">{minutes}:{seconds}</div>
            </div>
          );
        })}
      </div>
    );
  },

  'render': function () {

    var stats = this.renderStats();

    return (
      <div className="stats">
        <div className="header bg-red">
          <span className="pictogram-icon wundercon icon-background"></span>
          <h2>Where you spend your time online ...</h2>
        </div>
        <div className="content-wrapper">
          {stats}
        </div>
      </div>
    );
  }
});

module.exports = Stats;