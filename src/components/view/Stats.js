'use strict';

var React = require('react/addons');
var classNames = require('classnames');
var pad = require('pad');
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

  'padTime': function (str) {

    return pad(2, str, '0');
  },

  'renderStats': function () {

    var self = this;
    var domainTimes = self.props.domainTimes || {};

    var domains = Object.keys(domainTimes);
    domains.sort(function (a, b) {

      var timeA = domainTimes[a];
      var timeB = domainTimes[b];
      return timeA < timeB ? 1 : timeA > timeB ? -1 : 0;
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
          var hours = Math.floor(seconds / 60 / 60);
          seconds = seconds - (hours * 60 * 60);
          var minutes = Math.floor(seconds / 60);
          seconds = seconds - (minutes * 60);

          minutes = self.padTime(minutes);
          seconds = self.padTime(seconds);

          return (
            <div className="clearfix">
              <div className="col col-9 overflow-hidden nowrap ellipses">
                <span className={domainClasses}>
                  {domain}
                </span>
              </div>
              <div className="col col-3 right-align">
                {hours}:{minutes}:{seconds}
              </div>
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
        <div className="content-wrapper extend">
          {stats}
        </div>
      </div>
    );
  }
});

module.exports = Stats;