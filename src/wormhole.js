var WormholeMessageSender = require('./wormhole_message_sender');
var WormholeMessagePublisher = require('./wormhole_message_publisher');
var WormholeMessageReceiver = require('./wormhole_message_receiver');
var WormholeBeaconSender = require('./wormhole_beacon_sender');
var WormholeReadinessChecker = require('./wormhole_readiness_checker');
var PendingMessageQueue = require('./pending_message_queue');
var liteUrl = require('lite-url');

var Wormhole = function(wormholeWindow, url) {
  var wormholeOrigin = liteUrl(url).origin;
  var subscribeCallbacks = {};
  var self = this;
  var wormholeMessageSender = new WormholeMessageSender(wormholeWindow, wormholeOrigin);
  var wormholeMessageReceiver = new WormholeMessageReceiver(wormholeWindow, wormholeOrigin, subscribeCallbacks, wormholeMessageSender);
  var wormholeReadinessChecker = new WormholeReadinessChecker(wormholeMessageReceiver);
  var pendingMessageQueue = new PendingMessageQueue(wormholeMessageSender, wormholeReadinessChecker);
  var wormholeMessagePublisher = new WormholeMessagePublisher(wormholeMessageReceiver, pendingMessageQueue);
  var wormholeBeaconSender = new WormholeBeaconSender(wormholeMessageSender, wormholeReadinessChecker, setTimeout);
  wormholeBeaconSender.start();
  wormholeMessageReceiver.startListening();

  this.subscribe = function(topic, callback) {
    subscribeCallbacks[topic] = subscribeCallbacks[topic] || [];
    subscribeCallbacks[topic].push(callback);
  };

  this.publish = function(topic, data) {
    return wormholeMessagePublisher.push(topic, data);
  };

  this.destroy = function() {
    wormholeMessageReceiver.stopListening();
  };
};

Wormhole.create = function(wormholeWindow, url) {
  return new Wormhole(wormholeWindow, url);
};

module.exports = Wormhole;
