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

goog.module('proto.im.integration.ByteStringFieldsTest');
goog.setTestOnly();

const ByteString = goog.require('proto.im.ByteString');
const base64 = goog.require('goog.crypt.base64');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckType} = goog.require('proto.im.internal.internalChecks');


const TEST_BYTES = [1, 2, 3, 4];
const TEST_STRING = ByteString.copyFrom(TEST_BYTES);

class ByteStringTest {
  testEquality() {
    assertTrue(ByteString.EMPTY.equals(ByteString.copyFrom([])));
    assertTrue(TEST_STRING.equals(ByteString.copyFrom(TEST_BYTES.slice())));
    assertFalse(TEST_STRING.equals(ByteString.copyFrom([1, 2, 3, 5])));
  }

  testHashCode() {
    assertEquals(
        ByteString.EMPTY.hashCode(), ByteString.copyFrom([]).hashCode());
    assertEquals(
        TEST_STRING.hashCode(),
        ByteString.copyFrom(TEST_BYTES.slice()).hashCode());
  }

  testFromBase64_null() {
    if (isCheckType()) {
      assertThrows(
          () => ByteString.fromBase64String(
              /** @type {string} */ (/** @type {*} */ (null))));
    }
  }

  testFromBase64_regularValue() {
    const halloInBase64 = 'aGFsbG8=';  // hallo in base64
    const halloByteString = ByteString.fromBase64String(halloInBase64);
    const halloByteStringSecondInstance =
        ByteString.fromBase64String(halloInBase64);

    assertTrue(halloByteString.equals(halloByteStringSecondInstance));
    assertEquals(
        halloByteString.hashCode(), halloByteStringSecondInstance.hashCode());

    const newByteArray = halloByteString.toByteArray().slice();
    // change one byte in the array
    newByteArray[0] += 1;
    const differentByteString = ByteString.copyFrom(newByteArray);
    assertTrue(halloByteString.hashCode() != differentByteString.hashCode());
    assertFalse(halloByteString.equals(differentByteString));
  }

  testToBase64() {
    const halloInBase64 = 'aGFsbG8=';  // hallo in base64
    const halloByteString = ByteString.fromBase64String(halloInBase64);
    assertEquals(halloInBase64, halloByteString.toBase64String());
  }

  testToInt8Array_inRangeBytes() {
    const byteString = ByteString.copyFrom([-128, -64, 0, 64, 127]);
    assertEqualsForProto(
        [-128, -64, 0, 64, 127], Array.from(byteString.toInt8Array()));
  }

  testToInt8Array_outOfRangeBytes() {
    const byteString = ByteString.copyFrom([-200, -129, 128, 200]);
    assertEqualsForProto(
        [56, 127, -128, -56], Array.from(byteString.toInt8Array()));
  }

  testToInt8Array_ByteStringImmutability() {
    const byteString = ByteString.copyFrom([0, 1, 2]);
    byteString.toInt8Array()[0] += 1;
    assertEqualsForProto([0, 1, 2], Array.from(byteString.toInt8Array()));
  }

  testToUint8Array_inRangeBytes() {
    const byteString = ByteString.copyFrom([0, 64, 128, 200, 255]);
    assertEqualsForProto(
        [0, 64, 128, 200, 255], Array.from(byteString.toUint8Array()));
  }

  testToUInt8Array_outOfRangeBytes() {
    const byteString = ByteString.copyFrom([-127, -1, 256, 300]);
    assertEqualsForProto(
        [129, 255, 0, 44], Array.from(byteString.toUint8Array()));
  }

  testToUint8Array_ByteStringImmutability() {
    const byteString = ByteString.copyFrom([0, 1, 2]);
    byteString.toUint8Array()[0] += 1;
    assertEqualsForProto([0, 1, 2], Array.from(byteString.toUint8Array()));
  }

  testIsEmpty() {
    assertTrue(ByteString.EMPTY.isEmpty());
    assertTrue(
        ByteString.fromBase64String(base64.encodeByteArray([])).isEmpty());
    assertTrue(ByteString.copyFrom([]).isEmpty());

    assertFalse(
        ByteString.fromBase64String(base64.encodeByteArray([1])).isEmpty());
    assertFalse(ByteString.copyFrom([1]).isEmpty());
  }
}

testSuite(new ByteStringTest());
