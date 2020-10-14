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
 * @fileoverview Tests for FieldAccessor.
 */

goog.module('proto.im.internal.FieldAccessorTest');
goog.setTestOnly('proto.im.internal.FieldAccessorTest');

const ByteString = goog.require('proto.im.ByteString');
const FieldAccessor = goog.require('proto.im.internal.FieldAccessor');
const Long = goog.require('goog.math.Long');
const testSuite = goog.require('goog.testing.testSuite');
const {isCheckIndex, isCheckLongDataLoss, isCheckType} = goog.require('proto.im.internal.internalChecks');


class FieldAccessorTest {
  testSingleBoolean() {
    const fields = {};
    assertFalse(FieldAccessor.getBooleanWithDefault(fields, 3, false));
    assertFalse(FieldAccessor.getBoolean(fields, 3));
    fields[4] = 0;


    assertFalse(FieldAccessor.getBooleanWithDefault(fields, 3, false));
    assertFalse(FieldAccessor.getBoolean(fields, 3));
    assertFalse(FieldAccessor.getBooleanWithDefault(fields, 4, true));
    assertFalse(FieldAccessor.getBoolean(fields, 4));

    FieldAccessor.setBoolean(fields, 4, true);
    // booleans are represented as 0/1 instead of false/true in javascript.
    assertEquals(1, fields[4]);
    assertTrue(FieldAccessor.getBooleanWithDefault(fields, 4, false));
    assertTrue(FieldAccessor.getBoolean(fields, 4));

    FieldAccessor.setBoolean(fields, 1, true);
    assertEquals(1, fields[1]);

    FieldAccessor.setBoolean(fields, 2, false);
    assertEquals(0, fields[2]);
  }

  testSingleBooleanTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = ['not a boolean', {}, [], NaN, Infinity];

    assertThrows(() => FieldAccessor.getBoolean(fields, 0));
    assertThrows(() => FieldAccessor.getBoolean(fields, 1));
    assertThrows(() => FieldAccessor.getBoolean(fields, 2));
    assertThrows(() => FieldAccessor.getBoolean(fields, 3));
    assertThrows(() => FieldAccessor.getBoolean(fields, 4));
    assertThrows(
        () => FieldAccessor.setBoolean(fields, 1, /** @type {?} */ (1)));
    assertThrows(
        () => FieldAccessor.setBoolean(fields, 1, /** @type {?} */ (0)));
    assertThrows(
        () => FieldAccessor.setBoolean(fields, 1, /** @type {?} */ ({})));
    assertThrows(
        () => FieldAccessor.setBoolean(fields, 1, /** @type {?} */ ([])));
  }

  testSingleBooleanTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = ['not a boolean', {}, [], NaN, Infinity];

    assertTrue(FieldAccessor.getBoolean(fields, 0));
    assertTrue(FieldAccessor.getBoolean(fields, 1));
    assertTrue(FieldAccessor.getBoolean(fields, 2));
    assertFalse(FieldAccessor.getBoolean(fields, 3));
    assertTrue(FieldAccessor.getBoolean(fields, 4));


    FieldAccessor.setBoolean(fields, 5, /** @type {?} */ (1));
    assertEquals(1, fields[5]);

    FieldAccessor.setBoolean(fields, 6, /** @type {?} */ (0));
    assertEquals(0, fields[6]);

    FieldAccessor.setBoolean(fields, 7, /** @type {?} */ ({}));
    assertEquals(1, fields[7]);

    FieldAccessor.setBoolean(fields, 8, /** @type {?} */ ([]));
    assertEquals(1, fields[8]);
  }

  testSingleByteString() {
    const fields = {};
    assertTrue(ByteString.EMPTY.equals(FieldAccessor.getByteStringWithDefault(
        fields, 3, ByteString.copyFrom([]))));
    assertTrue(ByteString.EMPTY.equals(FieldAccessor.getByteString(fields, 3)));

    fields[4] = 'aGFsbG8=';                      // hallo in base64
    const byteArray = [104, 97, 108, 108, 111];  // hallo char codes

    assertArrayEquals(
        byteArray,
        FieldAccessor
            .getByteStringWithDefault(fields, 4, ByteString.copyFrom([1]))
            .toByteArray());
    assertArrayEquals(
        byteArray, FieldAccessor.getByteString(fields, 4).toByteArray());

    FieldAccessor.setByteString(fields, 1, ByteString.copyFrom(byteArray));
    assertEquals('aGFsbG8=', fields[1]);
  }

  testSingleByteStringTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = [{}, true, false, 1, NaN];

    assertThrows(() => FieldAccessor.getByteString(fields, 0));
    assertThrows(() => FieldAccessor.getByteString(fields, 1));
    assertThrows(() => FieldAccessor.getByteString(fields, 2));
    assertThrows(() => FieldAccessor.getByteString(fields, 3));
    assertThrows(() => FieldAccessor.getByteString(fields, 4));
    assertThrows(
        () => FieldAccessor.setByteString(
            fields, 1, /** @type{!ByteString} */ (/** @type{*} */ (null))));
  }

  testSingleByteStringTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [{}, true, false, 1, NaN];

    // base64 decoding will fail
    assertEquals(
        fields[0], FieldAccessor.getByteString(fields, 0).toBase64String());
    assertEquals(
        fields[1], FieldAccessor.getByteString(fields, 1).toBase64String());
    assertEquals(
        fields[2], FieldAccessor.getByteString(fields, 2).toBase64String());
    assertEquals(
        fields[3], FieldAccessor.getByteString(fields, 3).toBase64String());
    assertNaN(FieldAccessor.getByteString(fields, 4).toBase64String());
    assertThrows(
        'set null',
        () => FieldAccessor.setByteString(
            fields, 1, /** @type{!ByteString} */ (/** @type{*} */ (null))));
  }

  testSingleDouble() {
    const fields = {};
    assertEquals(3, FieldAccessor.getDoubleWithDefault(fields, 3, 3));
    assertEquals(0, FieldAccessor.getDouble(fields, 3));

    fields[4] = 2.2;
    assertEquals(2.2, FieldAccessor.getDoubleWithDefault(fields, 4, 0));
    assertEquals(2.2, FieldAccessor.getDouble(fields, 4));

    FieldAccessor.setDouble(fields, 0, 1.2);
    assertEquals(1.2, fields[0]);

    FieldAccessor.setDouble(fields, 1, 2.2);
    assertEquals(2.2, fields[1]);

    FieldAccessor.setDouble(fields, 2, Infinity);
    assertEquals('Infinity', fields[2]);

    FieldAccessor.setDouble(fields, 2, -Infinity);
    assertEquals('-Infinity', fields[2]);
  }

  testSingleDoubleTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = [{}, [], true, false];

    assertThrows(() => FieldAccessor.getDouble(fields, 0));
    assertThrows(() => FieldAccessor.getDouble(fields, 1));
    assertThrows(() => FieldAccessor.getDouble(fields, 2));
    assertThrows(() => FieldAccessor.getDouble(fields, 3));
    assertThrows(
        () => FieldAccessor.setDouble(
            fields, 2, /** @type{number} */ (/** @type{*} */ (''))));
  }

  testSingleDoubleTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [{}, [], true, false];
    assertNaN(FieldAccessor.getDouble(fields, 0));
    assertEquals(0, FieldAccessor.getDouble(fields, 1));
    assertEquals(1, FieldAccessor.getDouble(fields, 2));
    assertEquals(0, FieldAccessor.getDouble(fields, 3));

    FieldAccessor.setDouble(
        fields, 5, /** @type{number} */ (/** @type{*} */ ('')));
    assertEquals('NaN', fields[5]);
  }

  testInt() {
    const fields = {};
    assertEquals(3, FieldAccessor.getIntWithDefault(fields, 3, 3));
    assertEquals(0, FieldAccessor.getInt(fields, 3));

    fields[4] = 2;
    assertEquals(2, FieldAccessor.getIntWithDefault(fields, 4, 0));
    assertEquals(2, FieldAccessor.getInt(fields, 4));

    FieldAccessor.setInt(fields, 0, 1);
    assertEquals(1, fields[0]);
  }

  testIntTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = [NaN, Infinity, -Infinity, {}, [], true, false, 1.1];

    assertThrows(() => FieldAccessor.getInt(fields, 0));
    assertThrows(() => FieldAccessor.getInt(fields, 1));
    assertThrows(() => FieldAccessor.getInt(fields, 2));
    assertThrows(() => FieldAccessor.getInt(fields, 3));
    assertThrows(() => FieldAccessor.getInt(fields, 4));
    assertThrows(() => FieldAccessor.getInt(fields, 5));
    assertThrows(() => FieldAccessor.getInt(fields, 6));
    assertThrows(() => FieldAccessor.getInt(fields, 7));
    assertThrows(() => FieldAccessor.setInt(fields, 0, 1.1));
    assertThrows(
        () => FieldAccessor.setInt(
            fields, 0, /** @type{number} */ (/** @type {*} */ ({}))));
  }

  testIntTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [NaN, Infinity, -Infinity, {}, [], true, false, 1.1];
    assertEquals(0, FieldAccessor.getInt(fields, 0));
    assertEquals(0, FieldAccessor.getInt(fields, 1));
    assertEquals(0, FieldAccessor.getInt(fields, 2));
    assertEquals(0, FieldAccessor.getInt(fields, 3));
    assertEquals(0, FieldAccessor.getInt(fields, 4));
    assertEquals(1, FieldAccessor.getInt(fields, 5));
    assertEquals(0, FieldAccessor.getInt(fields, 6));
    assertEquals(1, FieldAccessor.getInt(fields, 7));

    FieldAccessor.setInt(fields, 0, 1.1);
    assertEquals(1, fields[0]);

    FieldAccessor.setInt(
        fields, 1, /** @type{number} */ (/** @type {*} */ ({})));
    assertEquals(0, fields[1]);
  }

  testUInt32() {
    const fields = {};
    assertEquals(3, FieldAccessor.getUIntWithDefault(fields, 3, 3));
    assertEquals(0, FieldAccessor.getUInt(fields, 3));

    fields[4] = 2;
    assertEquals(2, FieldAccessor.getUIntWithDefault(fields, 4, 0));
    assertEquals(2, FieldAccessor.getUInt(fields, 4));

    fields[3] = 4294967295;
    assertEquals(-1, FieldAccessor.getUIntWithDefault(fields, 3, 0));
    assertEquals(-1, FieldAccessor.getUInt(fields, 3));

    FieldAccessor.setUInt(fields, 0, 1);
    assertEquals(1, fields[0]);
  }

  testUIntTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = [NaN, Infinity, -Infinity, {}, [], true, false, 1.1];

    assertThrows(() => FieldAccessor.getUInt(fields, 0));
    assertThrows(() => FieldAccessor.getUInt(fields, 1));
    assertThrows(() => FieldAccessor.getUInt(fields, 2));
    assertThrows(() => FieldAccessor.getUInt(fields, 3));
    assertThrows(() => FieldAccessor.getUInt(fields, 4));
    assertThrows(() => FieldAccessor.getUInt(fields, 5));
    assertThrows(() => FieldAccessor.getUInt(fields, 6));
    assertThrows(() => FieldAccessor.getUInt(fields, 7));
    assertThrows(() => FieldAccessor.setUInt(fields, 0, 1.1));
    assertThrows(() => FieldAccessor.setUInt(fields, 0, 4294967295));
    assertThrows(
        () => FieldAccessor.setUInt(
            fields, 0, /** @type{number} */ (/** @type {*} */ ({}))));
  }

  testUIntTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [NaN, Infinity, -Infinity, {}, [], true, false, 1.1];
    assertEquals(0, FieldAccessor.getUInt(fields, 0));
    assertEquals(0, FieldAccessor.getUInt(fields, 1));
    assertEquals(0, FieldAccessor.getUInt(fields, 2));
    assertEquals(0, FieldAccessor.getUInt(fields, 3));
    assertEquals(0, FieldAccessor.getUInt(fields, 4));
    assertEquals(1, FieldAccessor.getUInt(fields, 5));
    assertEquals(0, FieldAccessor.getUInt(fields, 6));
    assertEquals(1, FieldAccessor.getUInt(fields, 7));

    FieldAccessor.setUInt(fields, 0, 1.1);
    assertEquals(1, fields[0]);

    FieldAccessor.setUInt(fields, 2, 4294967295);
    assertEquals(-1, fields[2]);

    FieldAccessor.setUInt(
        fields, 1, /** @type{number} */ (/** @type {*} */ ({})));
    assertEquals(0, fields[1]);
  }

  testLongTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = [{}, [], '', false, 1, NaN];

    assertThrows(() => FieldAccessor.getLong(fields, 0));
    assertThrows(() => FieldAccessor.getLong(fields, 1));
    assertThrows(() => FieldAccessor.getLong(fields, 2));
    assertThrows(() => FieldAccessor.getLong(fields, 3));


    assertTrue(Long.fromInt(1).equals(FieldAccessor.getLong(fields, 4)));

    assertThrows(() => FieldAccessor.getLong(fields, 5));


    assertThrows(
        () => FieldAccessor.setLong(fields, 5, /** @type{!Long} */ ({})));
    assertThrows(
        'Should fail with precision loss message => value too big',
        () => FieldAccessor.getLong([Math.pow(2, 53)], 0));

    assertTrue(Long.fromNumber(Math.pow(2, 53) - 1)
                   .equals(FieldAccessor.getLong([Math.pow(2, 53) - 1], 0)));

    assertThrows(
        'Should fail with precision loss message => value too small',
        () => FieldAccessor.getLong([-Math.pow(2, 53) - 10], 0));

    assertTrue(Long.fromNumber(-Math.pow(2, 53) + 1)
                   .equals(FieldAccessor.getLong([-Math.pow(2, 53) + 1], 0)));
  }

  testLongTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [{}, [], '', false, 1, NaN];

    assertThrows(() => FieldAccessor.getLong(fields, 0));
    assertThrows(() => FieldAccessor.getLong(fields, 1));
    assertThrows(() => FieldAccessor.getLong(fields, 2));
    assertThrows(() => FieldAccessor.getLong(fields, 3));

    assertTrue(Long.fromInt(1).equals(FieldAccessor.getLong(fields, 4)));

    assertTrue(Long.fromInt(0).equals(FieldAccessor.getLong(fields, 5)));

    FieldAccessor.setLong(fields, 6, /** @type{!Long} */ ({}));
    assertEquals('[object Object]', fields[6]);
  }

  testInt52LongTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = [{}, [], '', false, 1, NaN];

    assertThrows(() => FieldAccessor.getLong(fields, 0));
    assertThrows(() => FieldAccessor.getLong(fields, 1));
    assertThrows(() => FieldAccessor.getLong(fields, 2));
    assertThrows(() => FieldAccessor.getLong(fields, 3));
    assertTrue(Long.fromInt(1).equals(FieldAccessor.getLong(fields, 4)));
    assertThrows(() => FieldAccessor.getLong(fields, 5));
    assertThrows(
        () => FieldAccessor.setInt52Long(fields, 5, /** @type{!Long} */ ({})));
  }

  testInt52LongDataLossChecksEnabled() {
    if (!isCheckLongDataLoss()) {
      return;
    }
    const fields = [
      Math.pow(2, 53) - 1, -Math.pow(2, 53) + 1, Math.pow(2, 53),
      -Math.pow(2, 53)
    ];

    assertTrue(Long.fromNumber(Math.pow(2, 53) - 1)
                   .equals(FieldAccessor.getLong(fields, 0)));
    assertTrue(Long.fromNumber(-Math.pow(2, 53) + 1)
                   .equals(FieldAccessor.getLong(fields, 1)));
    assertThrows(
        'Should fail with precision loss message => value too big',
        () => FieldAccessor.getLong(fields, 2));
    assertThrows(
        'Should fail with precision loss message => value too small',
        () => FieldAccessor.getLong(fields, 3));

    var array = [];
    FieldAccessor.setInt52Long(array, 0, Long.fromNumber(Math.pow(2, 53) - 1));
    assertEquals(Math.pow(2, 53) - 1, array[0]);
    FieldAccessor.setInt52Long(array, 0, Long.fromNumber(-Math.pow(2, 53) + 1));
    assertEquals(-Math.pow(2, 53) + 1, array[0]);
    assertThrows(
        () => FieldAccessor.setInt52Long(
            array, 0, Long.fromNumber(Math.pow(2, 53))));
    assertThrows(
        () => FieldAccessor.setInt52Long(
            array, 0, Long.fromNumber(-Math.pow(2, 53))));
  }

  testInt52LongDataLossChecksDisabled() {
    if (isCheckLongDataLoss()) {
      return;
    }
    const fields = [
      Math.pow(2, 53) - 1, -Math.pow(2, 53) + 1, Math.pow(2, 53),
      -Math.pow(2, 53)
    ];

    assertTrue(Long.fromNumber(Math.pow(2, 53) - 1)
                   .equals(FieldAccessor.getLong(fields, 0)));
    assertTrue(Long.fromNumber(-Math.pow(2, 53) + 1)
                   .equals(FieldAccessor.getLong(fields, 1)));
    assertTrue(Long.fromNumber(Math.pow(2, 53))
                   .equals(FieldAccessor.getLong(fields, 2)));
    assertTrue(Long.fromNumber(-Math.pow(2, 53))
                   .equals(FieldAccessor.getLong(fields, 3)));

    var array = [];
    FieldAccessor.setInt52Long(array, 0, Long.fromNumber(Math.pow(2, 53) - 1));
    assertEquals(Math.pow(2, 53) - 1, array[0]);
    FieldAccessor.setInt52Long(array, 0, Long.fromNumber(-Math.pow(2, 53) + 1));
    assertEquals(-Math.pow(2, 53) + 1, array[0]);
    FieldAccessor.setInt52Long(array, 0, Long.fromNumber(Math.pow(2, 53)));
    assertEquals(Math.pow(2, 53), array[0]);
    FieldAccessor.setInt52Long(array, 0, Long.fromNumber(-Math.pow(2, 53)));
    assertEquals(-Math.pow(2, 53), array[0]);
  }

  testInt52LongTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [{}, [], '', false, 1, NaN];

    assertThrows(() => FieldAccessor.getLong(fields, 0));
    assertThrows(() => FieldAccessor.getLong(fields, 1));
    assertThrows(() => FieldAccessor.getLong(fields, 2));
    assertThrows(() => FieldAccessor.getLong(fields, 3));

    assertTrue(Long.fromInt(1).equals(FieldAccessor.getLong(fields, 4)));

    assertTrue(Long.fromInt(0).equals(FieldAccessor.getLong(fields, 5)));

    FieldAccessor.setInt52Long(fields, 6, /** @type{!Long} */ ({}));
    assertNaN(fields[6]);
  }

  testSingleString() {
    const fields = {};
    assertEquals(
        'default', FieldAccessor.getStringWithDefault(fields, 3, 'default'));
    assertEquals('', FieldAccessor.getString(fields, 3));

    fields[4] = 'my string';
    assertEquals(
        'my string', FieldAccessor.getStringWithDefault(fields, 4, 'default'));
    assertEquals('my string', FieldAccessor.getString(fields, 4));

    FieldAccessor.setString(fields, 0, 'a');
    assertEquals('a', fields[0]);

    FieldAccessor.setString(fields, 1, 'b');
    assertEquals('b', fields[1]);
  }

  testSingleStringTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = [{}, [], true, false, 1, NaN];

    assertThrows(() => FieldAccessor.getString(fields, 0));
    assertThrows(() => FieldAccessor.getString(fields, 1));
    assertThrows(() => FieldAccessor.getString(fields, 2));
    assertThrows(() => FieldAccessor.getString(fields, 3));
    assertThrows(() => FieldAccessor.getString(fields, 4));
    assertThrows(() => FieldAccessor.getString(fields, 5));
    assertThrows(
        () => FieldAccessor.setString(
            fields, 6, /** @type{string} */ (/** @type {*} */ (true))));
  }

  testSingleStringTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [{}, [], true, false, 1, NaN];
    assertEquals('[object Object]', FieldAccessor.getString(fields, 0));
    assertEquals('', FieldAccessor.getString(fields, 1));
    assertEquals('true', FieldAccessor.getString(fields, 2));
    assertEquals('false', FieldAccessor.getString(fields, 3));
    assertEquals('1', FieldAccessor.getString(fields, 4));
    assertEquals('NaN', FieldAccessor.getString(fields, 5));

    FieldAccessor.setString(
        fields, 6, /** @type{string} */ (/** @type {*} */ (true)));
    assertEquals('true', fields[6]);
  }

  testValidityCheck() {
    if (!COMPILED) {
      assertTrue(isCheckType());
      assertTrue(isCheckIndex());
    }
  }
}

testSuite(new FieldAccessorTest());
