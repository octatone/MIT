'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var _ = window._;

var defaultOptions = {
  idKey: 'id'
};

function BaseStore (options) {

  options || (options = {});

  this.options = _.extend({}, defaultOptions, options);

  EventEmitter.call(this);
  this._index = {};
}

util.inherits(BaseStore, EventEmitter);

_.extend(BaseStore.prototype, {

  'add': function (item) {

    var self = this;

    if (item) {
      self._index[item[this.options.idKey]] = item;
      self.emitChange();
    }
  },

  'update': function (item) {

    this.add(item);
  },

  'remove': function (itemId) {

    var self = this;
    delete self._index[itemId];
    self.emitChange();
  },

  'reset': function (items) {

    var self = this;
    self._index = {};
    items.forEach(function (item) {

      item && (self._index[item[self.options.idKey]] = item);
    });
    self.emitChange();
  },

  'init': function (items) {

    this.reset(items);
  },

  'get': function (itemId) {

    return this._index[itemId];
  },

  'getAll': function () {

    var self = this;

    return Object.keys(self._index).map(function (itemId) {

      return self._index[itemId];
    });
  },

  'emitChange': function () {

    this.emit(constants.change);
  }
});

module.exports = BaseStore;