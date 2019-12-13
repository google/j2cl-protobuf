goog.module('proto.im.integration.BuilderTest');
goog.setTestOnly();

const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');


class BuilderTest {
  testClone() {
    const builder1 = TestProto.newBuilder().setOptionalBool(true);
    const builder2 = builder1.clone();

    // Make sure they are both identical
    assertEqualsForProto(true, builder1.build().equals(builder2.build()));

    // change the first builder
    builder1.setOptionalString('foo');

    // Assert that the first has changed, but not the second
    assertEqualsForProto(false, builder1.build().equals(builder2.build()));
    assertEqualsForProto('foo', builder1.getOptionalString());
    assertEqualsForProto('', builder2.getOptionalString());
    assertEqualsForProto(false, builder2.hasOptionalString());
  }
}

testSuite(new BuilderTest());
