goog.module('proto.im.testdata.CycleReferenceTest');
goog.setTestOnly('proto.im.testdata.CycleReferenceTest');


const TopLevel1 = goog.require('improto.protobuf.contrib.immutablejs.protos.TopLevel1');
const TopLevel2 = goog.require('improto.protobuf.contrib.immutablejs.protos.TopLevel2');
const TopLevel3 = goog.require('improto.protobuf.contrib.immutablejs.protos.TopLevel3');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');


class CycleReferenceTest {
  test() {
    const topLevel1 =
        TopLevel1.newBuilder()
            .setTopLevel2Sub2First(TopLevel2.Sub2First.newBuilder().setPayload(
                'TopLevel2.Sub2First'))
            .setTopLevel2Sub2Second(TopLevel2.Sub2Second.TWO)
            .setTopLevel2(TopLevel2.newBuilder().setPayload('TopLevel2'))
            .setTopLevel3(TopLevel3.ONE)
            .setPayload('TopLevel1')
            .build();

    assertEqualsForProto('TopLevel1', topLevel1.getPayload());
    assertEqualsForProto(TopLevel3.ONE, topLevel1.getTopLevel3());
    assertEqualsForProto('TopLevel2', topLevel1.getTopLevel2().getPayload());
    assertEqualsForProto(
        TopLevel2.Sub2Second.TWO, topLevel1.getTopLevel2Sub2Second());
    assertEqualsForProto(
        'TopLevel2.Sub2First', topLevel1.getTopLevel2Sub2First().getPayload());

    const topLevel2 =
        TopLevel2.newBuilder()
            .setTopLevel1Sub2First(TopLevel1.Sub2First.newBuilder().setPayload(
                'TopLevel1.Sub2First'))
            .setPayload('TopLevel2')
            .build();

    assertEqualsForProto('TopLevel2', topLevel2.getPayload());
    assertEqualsForProto(
        'TopLevel1.Sub2First', topLevel2.getTopLevel1Sub2First().getPayload());
  }
}

testSuite(new CycleReferenceTest());
