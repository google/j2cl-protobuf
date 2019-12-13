goog.module('proto.im.integration.MessageDefaultInstanceTest');
goog.setTestOnly();

const MessageA = goog.require('improto.protobuf.contrib.immutablejs.protos.MessageA');
const testSuite = goog.require('goog.testing.testSuite');

class MessageDefaultInstanceTest {
  testGetDefaultInstance() {
    assertTrue(MessageA.getDefaultInstance() instanceof MessageA);
    assertEquals(
        "getDefaultInstance should always return the same instance.",
        MessageA.getDefaultInstance(),
        MessageA.getDefaultInstance());
  }
}

testSuite(new MessageDefaultInstanceTest());
