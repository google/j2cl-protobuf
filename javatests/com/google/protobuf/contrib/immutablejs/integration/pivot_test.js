goog.module('proto.im.integration.PivotTest');
goog.setTestOnly();

const MutablePivot = goog.require('proto.protobuf.contrib.immutablejs.protos.Pivot');
const Pivot = goog.require('improto.protobuf.contrib.immutablejs.protos.Pivot');
const pivot = goog.require('improto.protobuf.contrib.immutablejs.protos.pivot');
const pivotExtension = goog.require('proto.protobuf.contrib.immutablejs.protos.pivotExtension');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');

class PivotTest {
  testFieldInExtensionObject() {
    const builder = Pivot.newBuilder()
                        .setExtension(
                            pivot.pivotExtension,
                            Pivot.newBuilder().setPayload('child').build())
                        .setPayload('parent');

    assertEqualsForProto(
        Pivot.newBuilder().setPayload('child').build(),
        builder.getExtension(pivot.pivotExtension));
    assertEqualsForProto(
        Pivot.newBuilder().setPayload('child').build(),
        builder.build().getExtension(pivot.pivotExtension));
  }

  testInteropWithAppsJspb_fromImmutable() {
    const immutableProto =
        Pivot.newBuilder()
            .setExtension(
                pivot.pivotExtension,
                Pivot.newBuilder().setPayload('child').build())
            .setPayload('parent')
            .build();

    const mutableProto = MutablePivot.deserialize(immutableProto.serialize());

    assertEqualsForProto(
        'child',
        immutableProto.getExtension(pivot.pivotExtension).getPayload());
    assertEqualsForProto(
        mutableProto.getExtension(pivotExtension).getPayload(),
        immutableProto.getExtension(pivot.pivotExtension).getPayload());
  }

  testInteropWithAppsJspb_fromMutable() {
    const mutableProto = new MutablePivot();
    const child = new MutablePivot().setPayload('child');
    mutableProto.setExtension(pivotExtension, child);

    const immutableProto = Pivot.parse(mutableProto.serialize());

    assertEqualsForProto(
        'child',
        immutableProto.getExtension(pivot.pivotExtension).getPayload());
    assertEqualsForProto(
        mutableProto.getExtension(pivotExtension).getPayload(),
        immutableProto.getExtension(pivot.pivotExtension).getPayload());
  }
}

testSuite(new PivotTest());
