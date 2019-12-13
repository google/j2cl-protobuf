goog.module('proto.im.integration.MessageIdTest');
goog.setTestOnly();

const Child = goog.require('improto.protobuf.contrib.immutablejs.protos.Child');
const Foo = goog.require('improto.protobuf.contrib.immutablejs.protos.Foo');
const testSuite = goog.require('goog.testing.testSuite');

class MessageIdTest {
  testMessageIds() {
    assertEquals('["child_message_id"]', Child.parse('[]').serialize());
    assertEquals('["foo_message_id"]', Foo.parse('[]').serialize());

    const foo = Foo.parse('[[],[],[[]]]');
    assertEquals('["child_message_id"]', foo.getPayload().serialize());
    assertEquals('["child_message_id"]', foo.getPayloads(0).serialize());
    assertEquals(
        '["child_message_id"]',
        foo.getExtension(Child.fooExtension).serialize());
  }
}

testSuite(new MessageIdTest());
