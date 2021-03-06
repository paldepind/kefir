const {inherit} = require('./utils/objects');
const {VALUE, ERROR, END} = require('./constants');
const {callSubscriber} = require('./dispatcher');
const Observable = require('./observable');



function Property() {
  Observable.call(this);
  this._currentEvent = null;
}

inherit(Property, Observable, {

  _name: 'property',

  _emitValue(value) {
    if (this._alive) {
      if (!this._activating) {
        this._dispatcher.dispatch({type: VALUE, value, current: this._activating});
      }
      this._currentEvent = {type: VALUE, value, current: true};
    }
  },

  _emitError(value) {
    if (this._alive) {
      if (!this._activating) {
        this._dispatcher.dispatch({type: ERROR, value, current: this._activating});
      }
      this._currentEvent = {type: ERROR, value, current: true};
    }
  },

  _emitEnd() {
    if (this._alive) {
      if (!this._activating) {
        this._dispatcher.dispatch({type: END, current: this._activating});
      }
      this._clear();
    }
  },


  _on(type, fn) {
    if (this._alive) {
      this._dispatcher.add(type, fn);
      this._setActive(true);
    }
    if (this._currentEvent !== null) {
      callSubscriber(type, fn, this._currentEvent);
    }
    if (!this._alive) {
      callSubscriber(type, fn, {type: END, current: true});
    }
    return this;
  },

  getType() {
    return 'property';
  }

});

module.exports = Property;






