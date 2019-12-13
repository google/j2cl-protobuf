goog.module('proto.im.integration.MessageEqualityTest');
goog.setTestOnly();

const MessageA = goog.require('improto.protobuf.contrib.immutablejs.protos.MessageA');
const MessageB = goog.require('improto.protobuf.contrib.immutablejs.protos.MessageB');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');


class MessageEqualityTest {
  testEqualsForStructurallySameMessage() {
    const protoA = MessageA.newBuilder().setFoo('Foo').build();
    const protoB = MessageB.newBuilder().setFoo('Foo').build();
    const otherProtoA = MessageA.newBuilder().setFoo('Foo').build();
    const otherProtoB = MessageB.newBuilder().setFoo('Foo').build();


    assertEqualsForProto(protoA, protoA);
    assertEqualsForProto(protoB, protoB);
    assertEqualsForProto(protoA, otherProtoA);
    assertEqualsForProto(protoB, otherProtoB);
    // Makes sure that messages with the same structure are not seen as equal
    assertFalse(protoA.equals(protoB));
  }
}


testSuite(new MessageEqualityTest());
