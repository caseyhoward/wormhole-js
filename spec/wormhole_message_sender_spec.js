var wormholeMessageBuilder = require('../src/wormhole_message_builder');
var WormholeMessageSender = require('../src/wormhole_message_sender');
var messagePoster = require('../src/message_poster');

describe('wormholeMessageSender', function() {
  var wormholeMessageSender, sandbox, message, wormholeWindow;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    message = {a: 1, uuid: 'some uuid'};
    wormholeWindow = {};
    sandbox.mock(messagePoster).expects('postMessage').withArgs(wormholeWindow, message, '*');
    wormholeMessageSender = new WormholeMessageSender(wormholeWindow);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#publish', function() {
    it('publishes', function() {
      sandbox.stub(wormholeMessageBuilder, 'build').withArgs('publish', 'log in', sinon.match({abc: 123})).returns(message);
      expect(wormholeMessageSender.publish('log in', {abc: 123})).to.equal('some uuid');
    });
  });

  describe('#respond', function() {
    it('responds', function() {
      sandbox.stub(wormholeMessageBuilder, 'build').withArgs('response', 'log in', sinon.match({abc: 123})).returns(message);
      wormholeMessageSender.respond('log in', {abc: 123});
    });
  });

  describe('#sendReady', function() {
    it('sends ready', function() {
      sandbox.stub(wormholeMessageBuilder, 'build').withArgs('ready').returns(message);
      wormholeMessageSender.sendReady();
    });
  });

  describe('#sendBeacon', function() {
    it('sends beacon', function() {
      sandbox.stub(wormholeMessageBuilder, 'build').withArgs('beacon').returns(message);
      wormholeMessageSender.sendBeacon();
    });
  });
});
