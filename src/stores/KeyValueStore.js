'use strict';

var util = require('util');
var _ = window._;
var BaseStore = require('./BaseStore');

function KeyValueStore () {
  BaseStore.call(this);
}

util.inherits(KeyValueStore, BaseStore);

_.extend(KeyValueStore.prototype, {

  'add': function (key, value) {

    var self = this;

    if (key && value) {
      self._index[key] = value;
      self.emitChange();
    }
  },

  'update': function (key, value) {

    this.add(key, value);
  },

  'remove': function (key) {

    var self = this;
    delete self._index[key];
    self.emitChange();
  },

  'reset': function (data) {

    var self = this;
    self._index = {};

    Object.keys(data).forEach(function (key) {

      var item = data[key];
      self._index[key] = item;
    });
    self.emitChange();
  },

  'init': function (items) {

    this.reset(items);
  },

  'get': function (key) {

    return this._index[key];
  },

  'getAll': function () {

    var clone = {};
    for (var key in this._index) {
      clone[key] = this._index[key];
    }

    return clone;
  }
});

module.exports = KeyValueStore;