const {createStream, createProperty} = require('../patterns/two-sources');


const mixin = {

  _init({flushOnEnd = true} = {}) {
    this._buff = [];
    this._flushOnEnd = flushOnEnd;
  },

  _free() {
    this._buff = null;
  },

  _flush() {
    if (this._buff !== null && this._buff.length !== 0) {
      this._emitValue(this._buff);
      this._buff = [];
    }
  },

  _handlePrimaryEnd() {
    if (this._flushOnEnd) {
      this._flush();
    }
    this._emitEnd();
  },

  _onActivation() {
    this._primary.onAny(this._$handlePrimaryAny);
    if (this._alive && this._secondary !== null) {
      this._secondary.onAny(this._$handleSecondaryAny);
    }
  },

  _handlePrimaryValue(x) {
    this._buff.push(x);
  },

  _handleSecondaryValue(x) {
    this._flush();
  },

  _handleSecondaryEnd(x) {
    if (!this._flushOnEnd) {
      this._emitEnd();
    }
  }

};


const S = createStream('bufferBy', mixin);
const P = createProperty('bufferBy', mixin);


module.exports = function bufferBy(primary, secondary, options /* optional */) {
  return new (primary._ofSameType(S, P))(primary, secondary, options);
};
