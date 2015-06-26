'use strict';

var React = require('react/addons');
var chrome = window.chrome;
var background = chrome.extension.getBackgroundPage();

var Options = React.createClass({

  'fetchSites': function () {

    var self = this;
    background.fetchSites(function (sites) {
      self.setState({'sites': sites || []});
    });
  },

  'renderSites': function () {

    var self = this;
    var sites = self.state.sites;
    return sites.map(function (site) {
      return <li>{site}</li>;
    });
  },

  'getInitialState': function () {

    return {
      'sites':[]
    };
  },

  'addSite': function (site) {

    var self = this;
    background.addSite(site, function (sites) {
      self.setState({'sites': sites});
    });
  },

  'onInputChange': function (e) {
    if (e.which === 13) {
      this.addSite(e.target.value);
    }
  },

  'componentDidMount': function () {
    this.fetchSites();
  },

  'render': function () {

    var self = this;
    var sites = self.renderSites();

    return (
      <div className="settings">
        <div className="header bg-green">
          <span className="pictogram-icon wundercon icon-settings"></span>
          <h2>Customize what sites you should stay away from</h2>
        </div>
        <div className="content-wrapper">
          <input
              ref="addSite"
              className="block fit-width field-light px1"
              placeholder="Add a new site to your blacklist"
              onKeyDown={self.onInputChange}/>
          <ul>
            {sites}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Options;