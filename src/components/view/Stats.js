'use strict';

var React = require('react/addons');
var classNames = require('classnames');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var _naughtyDomains = [
  'reddit\.com',
  'facebook\.com',
  'slashdot\.org',
  'news\.ycombinator\.com',
  '9gag\.com'
];

var _naughtyPattern = new RegExp(_naughtyDomains.join('|'), 'i');

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

          var isNaughty = _naughtyPattern.test(domain || '');
          var domainClasses = classNames({
            'red': isNaughty,
            'bold': isNaughty
          });

          var seconds = domainTimes[domain];
          var minutes = Math.floor(seconds / 60);
          seconds = seconds - (minutes * 60);

          return (
            <div className="clearfix">
              <div className="col col-9 overflow-hidden">
                <span className={domainClasses}>
                  {domain}
                </span>
              </div>
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