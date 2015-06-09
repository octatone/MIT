'use strict';

/**
  * Provides bindTo method to react components
  * for bookkeeping of created binds and cleanup
  * on component destruction.
  *
  * Usage:
  *   component.bindTo(someEventEmitter, 'eventName', handlerFn);
  */
module.exports = {

  'bindTo': function (target, event, handler) {

    var binding = {
      'event': event,
      'target': target,
      'handler': handler
    };

    target.on(event, handler);

    this._bindings.push(binding);
  },

  'componentWillMount': function () {

    this._bindings = [];
  },

  'componentWillUnmount': function () {

    this._bindings.forEach(function (binding) {

      var target = binding.target;
      if (target.removeListener) {
        target.removeListener(binding.event, binding.handler);
      }
    });

    delete this._bindings;
  }
};