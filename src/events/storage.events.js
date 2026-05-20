const EventEmitter = require("events");

class StorageEvents extends EventEmitter {}

module.exports = new StorageEvents();
