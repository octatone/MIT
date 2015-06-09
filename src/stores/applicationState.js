'use strict';

var util = require('util');
var KeyValueStore = require('./KeyValueStore');
var _ = window._;

function ApplicationState () {
  KeyValueStore.call(this);
}

util.inherits(ApplicationState, KeyValueStore);

module.exports = new ApplicationState();