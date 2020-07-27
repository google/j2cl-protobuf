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

goog.module('proto.im.testdata.AccessorTest');
goog.setTestOnly('proto.im.testdata.AccessorTest');

const JSPB_DATA1 = goog.require('testdata.Accessor1');
const Long = goog.require('goog.math.Long');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');

class AccessorTest {
  test() {
    const jspbDataAsString = JSON.stringify(JSPB_DATA1);

    const testProto = TestProto.parse(jspbDataAsString);
    assertEqualsForProto(true, testProto.getOptionalBool());
    assertEqualsForProto(false, testProto.getOptionalBoolWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedBoolCount());
    assertEqualsForProto(
        [true, false, true], testProto.getRepeatedBoolList().toArray());

    assertEqualsForProto(23, testProto.getOptionalInt());
    assertEqualsForProto(1, testProto.getOptionalIntWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedIntCount());
    assertEqualsForProto([1, 2, 4], testProto.getRepeatedIntList().toArray());

    assertEqualsForProto(Long.fromInt(9), testProto.getOptionalLong());
    assertEqualsForProto(
        Long.fromInt(12), testProto.getOptionalLongWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedLongCount());
    const longListView = testProto.getRepeatedLongList();
    assertEqualsForProto(Long.fromInt(4), longListView.get(0));
    assertEqualsForProto(Long.fromInt(5), longListView.get(1));
    assertEqualsForProto(Long.fromInt(6), longListView.get(2));

    assertEqualsForProto(Long.fromInt(90), testProto.getOptionalInt52Long());
    assertEqualsForProto(
        Long.fromInt(120), testProto.getOptionalInt52LongWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedInt52LongCount());
    const int52longListView = testProto.getRepeatedInt52LongList();
    assertEqualsForProto(Long.fromInt(40), int52longListView.get(0));
    assertEqualsForProto(Long.fromInt(50), int52longListView.get(1));
    assertEqualsForProto(Long.fromInt(60), int52longListView.get(2));

    assertEqualsForProto(10, testProto.getOptionalFloat());
    assertEqualsForProto(11, testProto.getOptionalFloatWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedFloatCount());
    assertEqualsForProto(
        [13, 14, 15], testProto.getRepeatedFloatList().toArray());

    assertEqualsForProto(20, testProto.getOptionalDouble());
    assertEqualsForProto(21, testProto.getOptionalDoubleWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedDoubleCount());
    assertEqualsForProto(
        [22, 23, 24], testProto.getRepeatedDoubleList().toArray());

    assertEqualsForProto(TestProto.TestEnum.TWO, testProto.getOptionalEnum());
    assertEqualsForProto(
        TestProto.TestEnum.THREE, testProto.getOptionalEnumWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedEnumCount());
    assertEqualsForProto(
        [
          TestProto.TestEnum.ONE, TestProto.TestEnum.TWO,
          TestProto.TestEnum.THREE
        ],
        testProto.getRepeatedEnumList().toArray());

    assertEqualsForProto('foo', testProto.getOptionalString());
    assertEqualsForProto('bar', testProto.getOptionalStringWithDefault());
    assertEqualsForProto(3, testProto.getRepeatedStringCount());
    assertEqualsForProto(
        ['baz1', 'baz2', 'baz3'], testProto.getRepeatedStringList().toArray());

    assertEqualsForProto([0, 1], testProto.getOptionalBytes().toByteArray());
    assertEqualsForProto(
        [2, 3], testProto.getOptionalBytesWithDefault().toByteArray());
    assertEqualsForProto(3, testProto.getRepeatedBytesCount());
    const repeatedByteStringListView = testProto.getRepeatedBytesList();
    assertEqualsForProto([4], repeatedByteStringListView.get(0).toByteArray());
    assertEqualsForProto([5], repeatedByteStringListView.get(1).toByteArray());
    assertEqualsForProto(
        [6, 7], repeatedByteStringListView.get(2).toByteArray());

    // Repro for b/160739199. Uncomment after fixed.
    // assertEqualsForProto(2147483653, testProto.getOptionalUint32());
    // assertEqualsForProto(Long.fromString("9223372036854775809"),
    // testProto.getOptionalUint64());

    assertEqualsForProto('p1', testProto.getOptionalMessage().getPayload());
    assertEqualsForProto(3, testProto.getRepeatedMessageCount());
    const repeatedMessageListView = testProto.getRepeatedMessageList();
    assertEqualsForProto('p2', repeatedMessageListView.get(0).getPayload());
    assertEqualsForProto('p3', repeatedMessageListView.get(1).getPayload());
    assertEqualsForProto('p4', repeatedMessageListView.get(2).getPayload());
  }

  testDefaults() {
    const testProto = TestProto.newBuilder().build();
    assertEqualsForProto(false, testProto.getOptionalBool());
    assertEqualsForProto(true, testProto.getOptionalBoolWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedBoolCount());

    assertEqualsForProto(0, testProto.getOptionalInt());
    assertEqualsForProto(135, testProto.getOptionalIntWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedIntCount());

    assertEqualsForProto(Long.getZero(), testProto.getOptionalLong());
    assertEqualsForProto(
        Long.fromString('3000000000'), testProto.getOptionalLongWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedLongCount());

    assertEqualsForProto(Long.getZero(), testProto.getOptionalInt52Long());
    assertEqualsForProto(
        Long.fromString('30000'), testProto.getOptionalInt52LongWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedInt52LongCount());

    assertEqualsForProto(0, testProto.getOptionalFloat());
    assertEqualsForProto(1.35, testProto.getOptionalFloatWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedFloatCount());

    assertEqualsForProto(0, testProto.getOptionalDouble());
    assertEqualsForProto(2.46, testProto.getOptionalDoubleWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedDoubleCount());

    assertEqualsForProto(
        TestProto.TestEnum.UNKNOWN, testProto.getOptionalEnum());
    assertEqualsForProto(
        TestProto.TestEnum.THREE, testProto.getOptionalEnumWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedEnumCount());

    assertEqualsForProto('', testProto.getOptionalString());
    assertEqualsForProto(
        'non-trivial default', testProto.getOptionalStringWithDefault());
    assertEqualsForProto(0, testProto.getRepeatedStringCount());

    assertEqualsForProto([], testProto.getOptionalBytes().toByteArray());
    assertEqualsForProto(
        [97, 32, 98, 121, 116, 101, 121, 32, 100, 101, 102, 97, 117, 108, 116],
        testProto.getOptionalBytesWithDefault().toByteArray());
    assertEqualsForProto(0, testProto.getRepeatedBytesCount());

    assertEqualsForProto('', testProto.getOptionalMessage().getPayload());
    assertEqualsForProto(0, testProto.getRepeatedMessageCount());
  }

  testParser() {
    const jspbDataAsString = JSON.stringify(JSPB_DATA1);
    const testProto = TestProto.parse(jspbDataAsString);
    const parseFunction = testProto.getParserForType();
    const testProto1 = parseFunction(jspbDataAsString);
    assertEqualsForProto(testProto, testProto1);
  }

  testFieldNumbers() {
    assertEquals(6, TestProto.REPEATED_INT_FIELD_NUMBER);
    assertEquals(16, TestProto.OPTIONAL_ENUM_FIELD_NUMBER);
    assertEquals(2, TestProto.NestedMessage.ERRATA_FIELD_NUMBER);
    assertEquals(
        22, TestProto.NestedMessage.DoublyNestedMessage.FOO_FIELD_NUMBER);
  }
}

testSuite(new AccessorTest());
