'use strict'

const { EventEmitter } = require('events')
const { app, deprecate } = require('electron')
const { fromPartition, Session, Cookies, NetLog, Protocol } = process.electronBinding('session')

// Public API.
Object.defineProperties(exports, {
  defaultSession: {
    enumerable: true,
    get () { return fromPartition('') }
  },
  fromPartition: {
    enumerable: true,
    value: fromPartition
  }
})

Object.setPrototypeOf(Session.prototype, EventEmitter.prototype)
Object.setPrototypeOf(Cookies.prototype, EventEmitter.prototype)

Session.prototype._init = function () {
  this.on('-will-download', (event, ...args) => {
    // prevent default in secure mode without listeners for the event
    if (app.secureModeEnabled && this.listenerCount('will-download') === 0) {
      event.preventDefault()
    }

    this.emit('will-download', event, ...args)
  })

  app.emit('session-created', this)
}
