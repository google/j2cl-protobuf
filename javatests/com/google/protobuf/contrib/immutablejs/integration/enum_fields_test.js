goog.module('proto.im.integration.EnumFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


class EnumFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalEnum());
    assertEqualsForProto(
        TestProto.TestEnum.UNKNOWN,
        TestProto.newBuilder().build().getOptionalEnum());
  }

  testOptionalFieldNoDefault_setValue() {
    const builder =
        TestProto.newBuilder().setOptionalEnum(TestProto.TestEnum.TWO);
    assertEqualsForProto(true, builder.hasOptionalEnum());
    assertEqualsForProto(TestProto.TestEnum.TWO, builder.getOptionalEnum());


    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalEnum());
    assertEqualsForProto(TestProto.TestEnum.TWO, proto.getOptionalEnum());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto =
        TestProto.newBuilder().setOptionalEnum(TestProto.TestEnum.TWO).build();

    // Test clear
    const builder = startProto.toBuilder();
    builder.clearOptionalEnum();
    assertEqualsForProto(false, builder.hasOptionalEnum());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalEnum());
  }

  testOptionalFieldWithDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalEnum());
    assertEqualsForProto(
        TestProto.TestEnum.THREE,
        TestProto.newBuilder().build().getOptionalEnumWithDefault());
  }

  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalEnumWithDefault(
        TestProto.TestEnum.TWO);
    assertEqualsForProto(true, builder.hasOptionalEnumWithDefault());
    assertEqualsForProto(
        TestProto.TestEnum.TWO, builder.getOptionalEnumWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalEnumWithDefault());
    assertEqualsForProto(
        TestProto.TestEnum.TWO, proto.getOptionalEnumWithDefault());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalEnumWithDefault(
        TestProto.TestEnum.THREE);
    assertEqualsForProto(true, builder.hasOptionalEnumWithDefault());
    assertEqualsForProto(
        TestProto.TestEnum.THREE, builder.getOptionalEnumWithDefault());


    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalEnumWithDefault());
    assertEqualsForProto(
        TestProto.TestEnum.THREE, proto.getOptionalEnumWithDefault());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedEnumCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedEnumList().size());
    assertThrows(() => TestProto.newBuilder().build().getRepeatedEnum(0));
  }

  testRepeatedField_add() {
    const builder = TestProto.newBuilder()
                        .addRepeatedEnum(TestProto.TestEnum.TWO)
                        .addRepeatedEnum(TestProto.TestEnum.FIVE);
    assertEqualsForProto(
        [TestProto.TestEnum.TWO, TestProto.TestEnum.FIVE],
        builder.getRepeatedEnumList().toArray());


    const proto = builder.build();
    assertEqualsForProto(
        [TestProto.TestEnum.TWO, TestProto.TestEnum.FIVE],
        proto.getRepeatedEnumList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedEnum(TestProto.TestEnum.TWO)
                           .addRepeatedEnum(TestProto.TestEnum.FIVE)
                           .build();

    const builder = startProto.toBuilder().addAllRepeatedEnum(ListView.copyOf([
      TestProto.TestEnum.ONE, TestProto.TestEnum.TWO, TestProto.TestEnum.THREE
    ]));
    assertEqualsForProto(
        [
          TestProto.TestEnum.TWO, TestProto.TestEnum.FIVE,
          TestProto.TestEnum.ONE, TestProto.TestEnum.TWO,
          TestProto.TestEnum.THREE
        ],
        builder.getRepeatedEnumList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          TestProto.TestEnum.TWO, TestProto.TestEnum.FIVE,
          TestProto.TestEnum.ONE, TestProto.TestEnum.TWO,
          TestProto.TestEnum.THREE
        ],
        proto.getRepeatedEnumList().toArray());
  }

  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedEnum(TestProto.TestEnum.TWO)
                           .addRepeatedEnum(TestProto.TestEnum.FIVE)
                           .addRepeatedEnum(TestProto.TestEnum.ONE)
                           .addRepeatedEnum(TestProto.TestEnum.TWO)
                           .addRepeatedEnum(TestProto.TestEnum.THREE)
                           .build();

    const builder =
        startProto.toBuilder().setRepeatedEnum(2, TestProto.TestEnum.SIX);
    assertEqualsForProto(
        [
          TestProto.TestEnum.TWO, TestProto.TestEnum.FIVE,
          TestProto.TestEnum.SIX, TestProto.TestEnum.TWO,
          TestProto.TestEnum.THREE
        ],
        builder.getRepeatedEnumList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          TestProto.TestEnum.TWO, TestProto.TestEnum.FIVE,
          TestProto.TestEnum.SIX, TestProto.TestEnum.TWO,
          TestProto.TestEnum.THREE
        ],
        proto.getRepeatedEnumList().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedEnum(TestProto.TestEnum.TWO)
                        .addRepeatedEnum(TestProto.TestEnum.FIVE)
                        .addRepeatedEnum(TestProto.TestEnum.ONE)
                        .addRepeatedEnum(TestProto.TestEnum.TWO)
                        .addRepeatedEnum(TestProto.TestEnum.THREE);

    assertEqualsForProto(5, builder.getRepeatedEnumCount());
    assertEqualsForProto(TestProto.TestEnum.TWO, builder.getRepeatedEnum(0));
    assertEqualsForProto(TestProto.TestEnum.FIVE, builder.getRepeatedEnum(1));
    assertEqualsForProto(TestProto.TestEnum.ONE, builder.getRepeatedEnum(2));
    assertEqualsForProto(TestProto.TestEnum.TWO, builder.getRepeatedEnum(3));
    assertEqualsForProto(TestProto.TestEnum.THREE, builder.getRepeatedEnum(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedEnum(5));
    } else {
      assertEqualsForProto(
          TestProto.TestEnum.UNKNOWN, builder.getRepeatedEnum(5));
    }

    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedEnumCount());
    assertEqualsForProto(TestProto.TestEnum.TWO, proto.getRepeatedEnum(0));
    assertEqualsForProto(TestProto.TestEnum.FIVE, proto.getRepeatedEnum(1));
    assertEqualsForProto(TestProto.TestEnum.ONE, proto.getRepeatedEnum(2));
    assertEqualsForProto(TestProto.TestEnum.TWO, proto.getRepeatedEnum(3));
    assertEqualsForProto(TestProto.TestEnum.THREE, proto.getRepeatedEnum(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedEnum(5));
    } else {
      assertEqualsForProto(
          TestProto.TestEnum.UNKNOWN, proto.getRepeatedEnum(5));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedEnum(TestProto.TestEnum.TWO)
                           .addRepeatedEnum(TestProto.TestEnum.FIVE)
                           .addRepeatedEnum(TestProto.TestEnum.ONE)
                           .addRepeatedEnum(TestProto.TestEnum.TWO)
                           .addRepeatedEnum(TestProto.TestEnum.THREE)
                           .build();

    const builder = startProto.toBuilder().clearRepeatedEnum();
    assertEqualsForProto(0, builder.getRepeatedEnumCount());
    assertEqualsForProto(0, builder.getRepeatedEnumList().size());

    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedEnumCount());
    assertEqualsForProto(0, proto.getRepeatedEnumList().size());
  }
}

testSuite(new EnumFieldsTest());
