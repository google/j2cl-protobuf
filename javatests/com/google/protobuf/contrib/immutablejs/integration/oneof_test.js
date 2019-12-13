goog.module('proto.im.integration.OneOfsTest');
goog.setTestOnly();

const TestProtoWithOneOfs = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProtoWithOneOfs');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');


class OneOfsTest {
  testNothingSet() {
    const builder = TestProtoWithOneOfs.newBuilder().setRequiredString('str');
    const proto = builder.build();

    assertEqualsForProto('str', proto.getRequiredString());
    assertEqualsForProto('str', builder.getRequiredString());
    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, builder.getAOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        proto.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        builder.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  testSingleFieldSet() {
    const builder =
        TestProtoWithOneOfs.newBuilder().setRequiredString('str').setABool(
            true);  // member of a_union
    const proto = builder.build();

    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.A_BOOL, proto.getAOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.A_BOOL, builder.getAOneofCase());
    assertEqualsForProto(true, proto.getABool());
    assertEqualsForProto(true, builder.getABool());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        proto.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        builder.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  testSingleFieldSetThenCleared() {
    const builder = TestProtoWithOneOfs.newBuilder()
                        .setRequiredString('str')
                        .setABool(true)  // member of a_union
                        .clearABool();   // member of a_union
    const proto = builder.build();

    assertEqualsForProto('str', proto.getRequiredString());
    assertEqualsForProto('str', builder.getRequiredString());
    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, builder.getAOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        proto.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        builder.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }



  testMultipleFieldsSet() {
    const builder = TestProtoWithOneOfs.newBuilder()
                        .setRequiredString('str')
                        .setABool(true)           // member of a_union
                        .setDoubleWithDefault(0)  // member of a_union
                        .setAFloat(2.5);          // member of a_union
    const proto = builder.build();

    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.A_FLOAT, proto.getAOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.A_FLOAT, builder.getAOneofCase());
    assertEqualsForProto(2.5, proto.getAFloat());
    assertEqualsForProto(2.5, builder.getAFloat());

    assertEqualsForProto(false, proto.hasDoubleWithDefault());
    assertEqualsForProto(false, builder.hasDoubleWithDefault());
    assertEqualsForProto(
        2.46 /* default value */, proto.getDoubleWithDefault());
    assertEqualsForProto(
        2.46 /* default value */, builder.getDoubleWithDefault());

    assertEqualsForProto(false, proto.hasABool());
    assertEqualsForProto(false, builder.hasABool());
    assertEqualsForProto(false /* default value */, proto.getABool());
    assertEqualsForProto(false /* default value */, builder.getABool());

    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        proto.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        builder.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  testMultipleFieldsSetThenCleared() {
    const builder = TestProtoWithOneOfs.newBuilder()
                        .setRequiredString('str')
                        .setABool(true)           // member of a_union
                        .setDoubleWithDefault(0)  // member of a_union
                        .setAFloat(2.5)           // member of a_union
                        .clearAFloat();           // member of a union
    const proto = builder.build();

    assertEqualsForProto(
        TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());

    assertEqualsForProto(false, proto.hasAFloat());
    assertEqualsForProto(false, builder.hasAFloat());
    assertEqualsForProto(0 /* default value */, proto.getAFloat());
    assertEqualsForProto(0 /* default value */, builder.getAFloat());

    assertEqualsForProto(false, proto.hasDoubleWithDefault());
    assertEqualsForProto(false, builder.hasDoubleWithDefault());
    assertEqualsForProto(
        2.46 /* default value */, proto.getDoubleWithDefault());
    assertEqualsForProto(
        2.46 /* default value */, builder.getDoubleWithDefault());

    assertEqualsForProto(false, proto.hasABool());
    assertEqualsForProto(false, builder.hasABool());
    assertEquals(false /* default value */, proto.getABool());
    assertEquals(false /* default value */, builder.getABool());

    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        proto.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET,
        builder.getAnotherOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEqualsForProto(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
            .ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }
}


testSuite(new OneOfsTest());
