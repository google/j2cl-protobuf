// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.module('proto.im.integration.ToBuilderTest');
goog.setTestOnly();

const Base = goog.require('improto.protobuf.contrib.immutablejs.protos.Base');
const ByteString = goog.require('proto.im.ByteString');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const Primitives = goog.require('improto.protobuf.contrib.immutablejs.protos.Primitives');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');


class ToBuilderTest {
  testBoolean() {
    const testProtoBoolean = TestProto.newBuilder()
                                 .setOptionalBool(true)
                                 .setOptionalBoolWithDefault(true)
                                 .addRepeatedBool(true)
                                 .addRepeatedBool(true)
                                 .build();

    const booleanBuilder = testProtoBoolean.toBuilder();
    const testProtoBoolean2 = booleanBuilder.setOptionalBool(false)
                                  .setOptionalBoolWithDefault(false)
                                  .addRepeatedBool(false)
                                  .addRepeatedBool(false)
                                  .build();


    assertEqualsForProto(true, testProtoBoolean.getOptionalBool());
    assertEqualsForProto(true, testProtoBoolean.getOptionalBoolWithDefault());
    assertEqualsForProto(
        [true, true], testProtoBoolean.getRepeatedBoolList().toArray());

    assertEqualsForProto(false, testProtoBoolean2.getOptionalBool());
    assertEqualsForProto(false, testProtoBoolean2.getOptionalBoolWithDefault());
    assertEqualsForProto(
        [true, true, false, false],
        testProtoBoolean2.getRepeatedBoolList().toArray());
  }

  testInt() {
    const testIntBoolean = TestProto.newBuilder()
                               .setOptionalInt(1)
                               .setOptionalIntWithDefault(2)
                               .addRepeatedInt(3)
                               .addRepeatedInt(4)
                               .build();

    const intBuilder = testIntBoolean.toBuilder();
    const testProtoInt2 = intBuilder.setOptionalInt(5)
                              .setOptionalIntWithDefault(6)
                              .addRepeatedInt(7)
                              .addRepeatedInt(8)
                              .build();


    assertEqualsForProto(1, testIntBoolean.getOptionalInt());
    assertEqualsForProto(2, testIntBoolean.getOptionalIntWithDefault());
    assertEqualsForProto([3, 4], testIntBoolean.getRepeatedIntList().toArray());

    assertEqualsForProto(5, testProtoInt2.getOptionalInt());
    assertEqualsForProto(6, testProtoInt2.getOptionalIntWithDefault());
    assertEqualsForProto(
        [3, 4, 7, 8], testProtoInt2.getRepeatedIntList().toArray());
  }

  testLong() {
    const testLongBoolean = TestProto.newBuilder()
                                .setOptionalLong(Long.fromInt(1))
                                .setOptionalLongWithDefault(Long.fromInt(2))
                                .addRepeatedLong(Long.fromInt(3))
                                .addRepeatedLong(Long.fromInt(4))
                                .build();

    const longBuilder = testLongBoolean.toBuilder();
    const testProtoLong2 = longBuilder.setOptionalLong(Long.fromInt(5))
                               .setOptionalLongWithDefault(Long.fromInt(6))
                               .addRepeatedLong(Long.fromInt(7))
                               .addRepeatedLong(Long.fromInt(8))
                               .build();


    assertEqualsForProto(Long.fromInt(1), testLongBoolean.getOptionalLong());
    assertEqualsForProto(
        Long.fromInt(2), testLongBoolean.getOptionalLongWithDefault());
    assertEqualsForProto(
        [Long.fromInt(3), Long.fromInt(4)],
        testLongBoolean.getRepeatedLongList().toArray());

    assertEqualsForProto(Long.fromInt(5), testProtoLong2.getOptionalLong());
    assertEqualsForProto(
        Long.fromInt(6), testProtoLong2.getOptionalLongWithDefault());
    assertEqualsForProto(
        [Long.fromInt(3), Long.fromInt(4), Long.fromInt(7), Long.fromInt(8)],
        testProtoLong2.getRepeatedLongList().toArray());
  }

  testFloat() {
    const testProtoFloat = TestProto.newBuilder()
                               .setOptionalFloat(1.1)
                               .setOptionalFloatWithDefault(2.2)
                               .addRepeatedFloat(3.3)
                               .addRepeatedFloat(4.4)
                               .build();

    const floatBuilder = testProtoFloat.toBuilder();
    const testProtoFloat2 = floatBuilder.setOptionalFloat(5.5)
                                .setOptionalFloatWithDefault(6.6)
                                .addRepeatedFloat(7.7)
                                .addRepeatedFloat(8.8)
                                .build();


    assertEqualsForProto(1.1, testProtoFloat.getOptionalFloat());
    assertEqualsForProto(2.2, testProtoFloat.getOptionalFloatWithDefault());
    assertEqualsForProto(
        [3.3, 4.4], testProtoFloat.getRepeatedFloatList().toArray());

    assertEqualsForProto(5.5, testProtoFloat2.getOptionalFloat());
    assertEqualsForProto(6.6, testProtoFloat2.getOptionalFloatWithDefault());
    assertEqualsForProto(
        [3.3, 4.4, 7.7, 8.8], testProtoFloat2.getRepeatedFloatList().toArray());
  }

  testDouble() {
    const testProtoDouble = TestProto.newBuilder()
                                .setOptionalDouble(1.1)
                                .setOptionalDoubleWithDefault(2.2)
                                .addRepeatedDouble(3.3)
                                .addRepeatedDouble(4.4)
                                .build();

    const doubleBuilder = testProtoDouble.toBuilder();
    const testProtoDouble2 = doubleBuilder.setOptionalDouble(5.5)
                                 .setOptionalDoubleWithDefault(6.6)
                                 .addRepeatedDouble(7.7)
                                 .addRepeatedDouble(8.8)
                                 .build();


    assertEqualsForProto(1.1, testProtoDouble.getOptionalDouble());
    assertEqualsForProto(2.2, testProtoDouble.getOptionalDoubleWithDefault());
    assertEqualsForProto(
        [3.3, 4.4], testProtoDouble.getRepeatedDoubleList().toArray());

    assertEqualsForProto(5.5, testProtoDouble2.getOptionalDouble());
    assertEqualsForProto(6.6, testProtoDouble2.getOptionalDoubleWithDefault());
    assertEqualsForProto(
        [3.3, 4.4, 7.7, 8.8],
        testProtoDouble2.getRepeatedDoubleList().toArray());
  }

  testEnum() {
    const testProtoEnum =
        TestProto.newBuilder()
            .setOptionalEnum(TestProto.TestEnum.ONE)
            .setOptionalEnumWithDefault(TestProto.TestEnum.TWO)
            .addRepeatedEnum(TestProto.TestEnum.THREE)
            .addRepeatedEnum(TestProto.TestEnum.FOUR)
            .build();

    const enumBuilder = testProtoEnum.toBuilder();
    const testProtoEnum2 =
        enumBuilder.setOptionalEnum(TestProto.TestEnum.FIVE)
            .setOptionalEnumWithDefault(TestProto.TestEnum.SIX)
            .addRepeatedEnum(TestProto.TestEnum.SEVEN)
            .addRepeatedEnum(TestProto.TestEnum.EIGHT)
            .build();


    assertEqualsForProto(
        TestProto.TestEnum.ONE, testProtoEnum.getOptionalEnum());
    assertEqualsForProto(
        TestProto.TestEnum.TWO, testProtoEnum.getOptionalEnumWithDefault());
    assertEqualsForProto(
        [TestProto.TestEnum.THREE, TestProto.TestEnum.FOUR],
        testProtoEnum.getRepeatedEnumList().toArray());

    assertEqualsForProto(
        TestProto.TestEnum.FIVE, testProtoEnum2.getOptionalEnum());
    assertEqualsForProto(
        TestProto.TestEnum.SIX, testProtoEnum2.getOptionalEnumWithDefault());
    assertEqualsForProto(
        [
          TestProto.TestEnum.THREE, TestProto.TestEnum.FOUR,
          TestProto.TestEnum.SEVEN, TestProto.TestEnum.EIGHT
        ],
        testProtoEnum2.getRepeatedEnumList().toArray());
  }


  testString() {
    const testProtoString = TestProto.newBuilder()
                                .setOptionalString('1')
                                .setOptionalStringWithDefault('2')
                                .addRepeatedString('3')
                                .addRepeatedString('4')
                                .build();

    const stringBuilder = testProtoString.toBuilder();
    const testProtoString2 = stringBuilder.setOptionalString('5')
                                 .setOptionalStringWithDefault('6')
                                 .addRepeatedString('7')
                                 .addRepeatedString('8')
                                 .build();


    assertEqualsForProto('1', testProtoString.getOptionalString());
    assertEqualsForProto('2', testProtoString.getOptionalStringWithDefault());
    assertEqualsForProto(
        ['3', '4'], testProtoString.getRepeatedStringList().toArray());

    assertEqualsForProto('5', testProtoString2.getOptionalString());
    assertEqualsForProto('6', testProtoString2.getOptionalStringWithDefault());
    assertEqualsForProto(
        ['3', '4', '7', '8'],
        testProtoString2.getRepeatedStringList().toArray());
  }

  testByteString() {
    const testProtoByteString =
        TestProto.newBuilder()
            .setOptionalBytes(ByteString.copyFrom([1]))
            .setOptionalBytesWithDefault(ByteString.copyFrom([2]))
            .addRepeatedBytes(ByteString.copyFrom([3]))
            .addRepeatedBytes(ByteString.copyFrom([4]))
            .build();

    const byteStringBuilder = testProtoByteString.toBuilder();
    const testProtoByteString2 =
        byteStringBuilder.setOptionalBytes(ByteString.copyFrom([5]))
            .setOptionalBytesWithDefault(ByteString.copyFrom([6]))
            .addRepeatedBytes(ByteString.copyFrom([7]))
            .addRepeatedBytes(ByteString.copyFrom([8]))
            .build();


    assertEqualsForProto(
        [1], testProtoByteString.getOptionalBytes().toByteArray());
    assertEqualsForProto(
        [2], testProtoByteString.getOptionalBytesWithDefault().toByteArray());
    assertEqualsForProto(
        [ByteString.copyFrom([3]), ByteString.copyFrom([4])],
        testProtoByteString.getRepeatedBytesList().toArray());

    assertEqualsForProto(
        [5], testProtoByteString2.getOptionalBytes().toByteArray());
    assertEqualsForProto(
        [6], testProtoByteString2.getOptionalBytesWithDefault().toByteArray());
    assertEqualsForProto(
        [
          ByteString.copyFrom([3]), ByteString.copyFrom([4]),
          ByteString.copyFrom([7]), ByteString.copyFrom([8])
        ],
        testProtoByteString2.getRepeatedBytesList().toArray());
  }

  testNestedMessage() {
    const testProtoNestedMessage =
        TestProto.newBuilder()
            .setOptionalMessage(
                TestProto.NestedMessage.newBuilder().setPayload('1').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('2').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('3').build())
            .build();

    const nesatedMessageBuilder = testProtoNestedMessage.toBuilder();
    const testProtoNestedMessage2 =
        nesatedMessageBuilder
            .setOptionalMessage(
                TestProto.NestedMessage.newBuilder().setPayload('4').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('5').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('6').build())
            .build();

    assertEqualsForProto(
        '1', testProtoNestedMessage.getOptionalMessage().getPayload());
    const nestedMessageArray =
        testProtoNestedMessage.getRepeatedMessageList().toArray();
    assertEqualsForProto(2, nestedMessageArray.length);
    assertEqualsForProto('2', nestedMessageArray[0].getPayload());
    assertEqualsForProto('3', nestedMessageArray[1].getPayload());

    assertEqualsForProto(
        '4', testProtoNestedMessage2.getOptionalMessage().getPayload());
    const nestedMessageArray2 =
        testProtoNestedMessage2.getRepeatedMessageList().toArray();
    assertEqualsForProto(4, nestedMessageArray2.length);
    assertEqualsForProto('2', nestedMessageArray2[0].getPayload());
    assertEqualsForProto('3', nestedMessageArray2[1].getPayload());
    assertEqualsForProto('5', nestedMessageArray2[2].getPayload());
    assertEqualsForProto('6', nestedMessageArray2[3].getPayload());
  }

  testRepeatedFieldInExtension() {
    const baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(
        Primitives.repeatedStringExtension, ListView.copyOf(['1', '2']));

    const proto = baseBuilder.build();

    assertEqualsForProto(
        ['1', '2'],
        baseBuilder.getExtension(Primitives.repeatedStringExtension).toArray());
    assertEqualsForProto(
        ['1', '2'],
        proto.getExtension(Primitives.repeatedStringExtension).toArray());

    const otherBuilder = proto.toBuilder();
    otherBuilder.setExtensionAtIndex(
        Primitives.repeatedStringExtension, 0, '3');
    otherBuilder.setExtensionAtIndex(
        Primitives.repeatedStringExtension, 1, '4');


    assertEqualsForProto(
        ['1', '2'],
        baseBuilder.getExtension(Primitives.repeatedStringExtension).toArray());
    assertEqualsForProto(
        ['1', '2'],
        proto.getExtension(Primitives.repeatedStringExtension).toArray());

    assertEqualsForProto(
        ['3', '4'],
        otherBuilder.getExtension(Primitives.repeatedStringExtension)
            .toArray());
  }
}

testSuite(new ToBuilderTest());
