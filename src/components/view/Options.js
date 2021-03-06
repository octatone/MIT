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
      return <li className="clearfix blacklist-item">{site} <a className="right pictogram-icon wundercon icon-x-active delete-icon light-gray" onClick={self.deleteSite.bind(self, site)}></a></li>;
    });
  },

  'getInitialState': function () {

    return {
      'sites':[],
      'siteValue':''
    };
  },

  'addSite': function (site) {

    var self = this;
    background.addSite(site, function (sites) {
      self.setState({'sites': sites});
    });
  },

  'deleteSite': function (site) {

    var self = this;
    console.log(site, 'delete called')
    background.removeSite(site, function (sites) {
      self.setState({'sites': sites});
    });
  },

  'onInputKeydown': function (e) {

    var self = this;
    var value = e.target.value;

    if (e.which === 13) {
      self.addSite(value);
      self.setState({'siteValue': ''});
    }
  },

  'onInputChange': function (e) {

    this.setState({'siteValue': e.target.value});
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
        <div className="content-wrapper extend">
          <input
              ref="addSite"
              className="block fit-width field-light px1"
              placeholder="Add a new site to your blacklist"
              value={self.state.siteValue}
              onKeyDown={self.onInputKeydown}
              onChange={self.onInputChange} />
          <ul className="list-reset blacklist">
            {sites}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Options;