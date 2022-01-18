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

/**
 * @fileoverview Description of this file.
 */
goog.module('proto.im.proto_asserts_test');
goog.setTestOnly();

const ByteString = goog.require('proto.im.ByteString');
const Long = goog.require('goog.math.Long');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto, assertValueIsCleared, assertValueIsSet} = goog.require('proto.im.proto_asserts');

class ProtoAssertsTest {
  testBoolean() {
    assertEqualsForProto(true, true);
    assertEqualsForProto(false, false);
    assertThrowsJsUnitException(() => assertEqualsForProto(true, false));
    assertThrowsJsUnitException(() => assertEqualsForProto(false, true));
    assertThrowsJsUnitException(() => assertEqualsForProto(false, 0));
    assertThrowsJsUnitException(() => assertEqualsForProto(true, 1));
  }

  testNumbers() {
    assertEqualsForProto(1, 1);
    assertEqualsForProto(NaN, NaN);
    assertThrowsJsUnitException(() => assertEqualsForProto(1, 0));
    assertThrowsJsUnitException(() => assertEqualsForProto(NaN, 0));
  }

  testStrings() {
    assertEqualsForProto('1', '1');
    assertThrowsJsUnitException(() => assertEqualsForProto('1', '0'));
  }

  testLong() {
    assertEqualsForProto(Long.fromInt(1), Long.fromInt(1));
    assertEqualsForProto(
        Long.fromNumber(3000000000), Long.fromNumber(3000000000));
    assertThrowsJsUnitException(
        () => assertEqualsForProto(Long.fromInt(1), Long.fromInt(2)));
  }

  testByteString() {
    assertEqualsForProto(ByteString.copyFrom([1]), ByteString.copyFrom([1]));
    assertEqualsForProto(ByteString.copyFrom([10]), ByteString.copyFrom([10]));
    assertThrowsJsUnitException(
        () => assertEqualsForProto(
            ByteString.copyFrom([0]), ByteString.copyFrom([10])));
  }

  testArrays() {
    assertEqualsForProto(['1'], ['1']);
    assertEqualsForProto(Long.fromInt(1), Long.fromInt(1));
    assertThrowsJsUnitException(() => assertEqualsForProto(['1'], ['0']));
    assertThrowsJsUnitException(
        () => assertEqualsForProto(Long.fromInt(1), Long.fromInt(2)));
  }

  testMessageValueIsCleared() {
    assertValueIsCleared(TestProto.newBuilder().build());
    assertThrowsJsUnitException(
        () => assertValueIsCleared(
            TestProto.newBuilder().setOptionalBool(false).build()));
  }

  testMessageValueIsSet() {
    assertValueIsSet(TestProto.newBuilder().setOptionalBool(false).build());
    assertThrowsJsUnitException(
        () => assertValueIsSet(TestProto.newBuilder().build()));
  }
}

testSuite(new ProtoAssertsTest());
