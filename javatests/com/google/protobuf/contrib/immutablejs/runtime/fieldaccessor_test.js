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
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const testSuite = goog.require('goog.testing.testSuite');
const {isCheckType, isCheckIndex, isCheckLongDataLoss} = goog.require('proto.im.internal.internalChecks');


class FieldAccessorTest {
  // Compiler realizes out of bounds array accesss here, suppress it...
  /** @suppress {transitionalSuspiciousCodeWarnings} */
  testRepeatedFieldCount() {
    assertEquals(0, FieldAccessor.getRepeatedFieldCount([], 2));
    assertEquals(0, FieldAccessor.getRepeatedFieldCount([1, 2, []], 2));
    assertEquals(3, FieldAccessor.getRepeatedFieldCount([1, 2, [1, 2, 3]], 2));
  }


  testRepeatedFieldCountChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    assertThrows(
        'Not an array',
        () => FieldAccessor.getRepeatedFieldCount([1, 2, 3], 2));
  }


  testRepeatedFieldCountChecksDisabled() {
    if (isCheckType()) {
      return;
    }
    // Not hiding reading a non repeated field as a repeated field will
    // return not a number here with checks turned off.
    // This decision is done deliberatly since something else is wrong with
    // the application to get into this state at all.
    assertUndefined(FieldAccessor.getRepeatedFieldCount([1, 2, 3], 2));
  }

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
    assertThrows(() => FieldAccessor.setBoolean(fields, 1, 1));
    assertThrows(() => FieldAccessor.setBoolean(fields, 1, 0));
    assertThrows(
        () => FieldAccessor.setBoolean(fields, 1, /** @type {boolean} */ ({})));
    assertThrows(
        () => FieldAccessor.setBoolean(
            fields, 1, /** @type {boolean} */ (/** @type {*} */ ([]))));
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


    FieldAccessor.setBoolean(fields, 5, 1);
    assertEquals(1, fields[5]);

    FieldAccessor.setBoolean(fields, 6, 0);
    assertEquals(0, fields[6]);

    FieldAccessor.setBoolean(fields, 7, /** @type {boolean} */ ({}));
    assertEquals(1, fields[7]);

    FieldAccessor.setBoolean(
        fields, 8, /** @type {boolean} */ (/** @type {*} */ ([])));
    assertEquals(1, fields[8]);
  }

  testRepeatedBoolean() {
    const fields = [[1, 0, true, false], []];
    const listView = FieldAccessor.getBooleanListView(fields, 0);
    assertEquals(4, listView.size());
    assertTrue(listView.get(0));
    assertFalse(listView.get(1));
    assertTrue(listView.get(2));
    assertFalse(listView.get(3));

    assertArrayEquals([true, false, true, false], listView.toArray());


    const secondListView = FieldAccessor.getBooleanListView(fields, 1);
    assertEquals(0, secondListView.size());

    const thirdListView = FieldAccessor.getBooleanListView(fields, 2);
    assertEquals(0, thirdListView.size());
    assertUndefined(fields[2]);


    assertTrue(FieldAccessor.getBooleanElement(fields, 0, 0));
    assertFalse(FieldAccessor.getBooleanElement(fields, 0, 1));
    assertTrue(FieldAccessor.getBooleanElement(fields, 0, 2));
    assertFalse(FieldAccessor.getBooleanElement(fields, 0, 3));

    FieldAccessor.addBooleanElement(fields, 0, true);
    assertEquals(1, fields[0][4]);

    FieldAccessor.addBooleanElement(fields, 0, false);
    assertEquals(0, fields[0][5]);

    FieldAccessor.addAllBooleanElements(
        fields, 2, ListView.copyOf([false, true, true]));
    assertEquals(0, fields[2][0]);
    assertEquals(1, fields[2][1]);
    assertEquals(1, fields[2][2]);

    const newListView = FieldAccessor.getBooleanListView(fields, 2);
    FieldAccessor.addAllBooleanElements(fields, 3, newListView);
    assertEquals(0, fields[3][0]);
    assertEquals(1, fields[3][1]);
    assertEquals(1, fields[3][2]);


    FieldAccessor.setBooleanElement(fields, 3, 0, true);
    FieldAccessor.setBooleanElement(fields, 3, 1, false);
    FieldAccessor.setBooleanElement(fields, 3, 2, false);
    assertEquals(1, fields[3][0]);
    assertEquals(0, fields[3][1]);
    assertEquals(0, fields[3][2]);
  }

  testRepeatedBooleanTypeChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    assertThrows(
        'setBooleanElement out of index',
        () => FieldAccessor.setBooleanElement([], 0, 0, true));
    assertThrows(
        'getBooleanElement out of index',
        () => FieldAccessor.getBooleanElement([], 0, 0));
  }

  testRepeatedBooleanTypeChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = [];
    FieldAccessor.setBooleanElement(fields, 0, 0, true);
    assertEquals(1, fields[0][0]);
    assertFalse(FieldAccessor.getBooleanElement(fields, 0, 1));
  }

  testRepeatedBooleanIterator() {
    const array = [true, false, true, false];
    const listView = FieldAccessor.getBooleanListView([array], 0);
    assertIterator(array, listView);
  }

  testRepeatedBooleanIteratorForLoop() {
    const array = [true, false, true, false];
    const listView = FieldAccessor.getBooleanListView([array], 0);
    assertIteratorForLoop(array, listView);
  }

  testRepeatedBooleanIteratorChangingField_length() {
    const array = [true];
    const listView = FieldAccessor.getBooleanListView([array], 0);
    assertIteratorLengthModification(array, listView, false);
  }

  testRepeatedBooleanIteratorChangingField_value() {
    const array = [true, false];
    const listView = FieldAccessor.getBooleanListView([array], 0);
    assertIteratorValueModification(array, listView, true);
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

  testRepeatedByteString() {
    const fields = {};
    assertTrue(ByteString.EMPTY.equals(FieldAccessor.getByteStringWithDefault(
        fields, 3, ByteString.copyFrom([]))));
    assertTrue(ByteString.EMPTY.equals(FieldAccessor.getByteString(fields, 3)));

    fields[4] = [
      'aGFsbG8=',  // hallo in base64
      'cHJvdG8='   // proto in base64
    ];
    const halloCharCodes = [104, 97, 108, 108, 111];   // hallo char codes
    const protoCharCodes = [112, 114, 111, 116, 111];  // proto char codes

    assertArrayEquals(
        halloCharCodes,
        FieldAccessor.getByteStringListView(fields, 4).get(0).toByteArray());
    assertArrayEquals(
        protoCharCodes,
        FieldAccessor.getByteStringListView(fields, 4).get(1).toByteArray());

    assertArrayEquals(
        halloCharCodes,
        FieldAccessor.getByteStringElement(fields, 4, 0).toByteArray());
    assertArrayEquals(
        protoCharCodes,
        FieldAccessor.getByteStringElement(fields, 4, 1).toByteArray());


    FieldAccessor.addByteStringElement(
        fields, 3, ByteString.copyFrom(halloCharCodes));
    assertArrayEquals(
        halloCharCodes,
        FieldAccessor.getByteStringElement(fields, 3, 0).toByteArray());

    FieldAccessor.addAllByteStringElements(
        fields, 2, FieldAccessor.getByteStringListView(fields, 4));

    assertArrayEquals(
        halloCharCodes,
        FieldAccessor.getByteStringListView(fields, 2).get(0).toByteArray());
    assertArrayEquals(
        protoCharCodes,
        FieldAccessor.getByteStringListView(fields, 2).get(1).toByteArray());

    FieldAccessor.setByteStringElement(
        fields, 2, 0, ByteString.copyFrom(halloCharCodes));
    assertArrayEquals(
        halloCharCodes,
        FieldAccessor.getByteStringElement(fields, 2, 0).toByteArray());
  }

  testRepeatedByteStringIterator() {
    const array = [
      ByteString.copyFrom([1]).toBase64String(),
      ByteString.copyFrom([2]).toBase64String(),
      ByteString.copyFrom([3]).toBase64String(),
      ByteString.copyFrom([4]).toBase64String(),
    ];
    const listView = FieldAccessor.getByteStringListView([array], 0);
    assertIterator(array, listView, (val) => val.toBase64String());
  }

  testRepeatedByteStringIteratorForLoop() {
    const array = [
      ByteString.copyFrom([1]).toBase64String(),
      ByteString.copyFrom([2]).toBase64String(),
      ByteString.copyFrom([3]).toBase64String(),
      ByteString.copyFrom([4]).toBase64String(),
    ];
    const listView = FieldAccessor.getByteStringListView([array], 0);
    assertIteratorForLoop(array, listView, (val) => val.toBase64String());
  }

  testRepeatedByteStringIteratorChangingField_length() {
    const array = [ByteString.copyFrom([1]).toBase64String()];
    const listView = FieldAccessor.getByteStringListView([array], 0);
    assertIteratorLengthModification(
        array, listView, ByteString.copyFrom([2]).toBase64String(),
        val => val.toBase64String());
  }

  testRepeatedByteStringIteratorChangingField_value() {
    const array = [
      ByteString.copyFrom([1]).toBase64String(),
      ByteString.copyFrom([2]).toBase64String(),
    ];
    const listView = FieldAccessor.getByteStringListView([array], 0);
    assertIteratorValueModification(
        array, listView, ByteString.copyFrom([3]).toBase64String(),
        val => val.toBase64String());
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

  testRepeatedDouble() {
    const fields = [[0, 1, 'NaN', 'Infinity', '-Infinity']];

    const listView = FieldAccessor.getDoubleListView(fields, 0);

    assertEquals(0, listView.get(0));
    assertEquals(1, listView.get(1));
    assertNaN(listView.get(2));
    assertEquals(Infinity, listView.get(3));
    assertEquals(-Infinity, listView.get(4));

    const emptyListView = FieldAccessor.getDoubleListView(fields, 2);
    assertEquals(0, emptyListView.size());



    FieldAccessor.addAllDoubleElements(fields, 1, listView);
    assertEquals(0, FieldAccessor.getDoubleElement(fields, 1, 0));
    assertEquals(1, FieldAccessor.getDoubleElement(fields, 1, 1));
    assertNaN(FieldAccessor.getDoubleElement(fields, 1, 2));
    assertEquals(Infinity, FieldAccessor.getDoubleElement(fields, 1, 3));
    assertEquals(-Infinity, FieldAccessor.getDoubleElement(fields, 1, 4));

    FieldAccessor.setDoubleElement(fields, 0, 0, 3);
    assertEquals(3, fields[0][0]);
  }

  testRepeatedDoubleChecksEnabled() {
    if (!isCheckType()) {
      return;
    }

    const fields = {1: [0, 1, 'NaN', 'Infinity', '-Infinity', 'foo'], 3: ''};
    const listView = FieldAccessor.getDoubleListView(fields, 1);



    assertEquals(0, listView.get(0));
    assertEquals(1, listView.get(1));
    assertNaN(listView.get(2));
    assertEquals(Infinity, listView.get(3));
    assertEquals(-Infinity, listView.get(4));

    assertThrows(() => listView.get(5));
    assertThrows(() => listView.get(-1));
    assertThrows(() => listView.get(6));
    assertThrows(() => FieldAccessor.getDoubleListView(fields, 3));
  }

  testRepeatedDoubleChecksDisabled() {
    if (isCheckType()) {
      return;
    }

    const fields = {1: [0, 1, 'NaN', 'Infinity', '-Infinity', 'foo']};
    const listView = FieldAccessor.getDoubleListView(fields, 1);

    assertEquals(0, listView.get(0));
    assertEquals(1, listView.get(1));
    assertNaN(listView.get(2));
    assertEquals(Infinity, listView.get(3));
    assertEquals(-Infinity, listView.get(4));
    assertNaN(listView.get(5));


    assertEquals(0, listView.get(-1));
    assertEquals(0, listView.get(6));
  }

  testRepeatedDoubleIterator() {
    const array = [1, 2, 3, 4];
    const listView = FieldAccessor.getDoubleListView([array], 0);
    assertIterator(array, listView);
  }

  testRepeatedDoubleIteratorForLoop() {
    const array = [1, 2, 3, 4];
    const listView = FieldAccessor.getDoubleListView([array], 0);
    assertIteratorForLoop(array, listView);
  }

  testRepeatedDoubleIteratorChangingField_length() {
    const array = [1];
    const listView = FieldAccessor.getDoubleListView([array], 0);
    assertIteratorLengthModification(array, listView, 2);
  }

  testRepeatedDoubleIteratorChangingField_value() {
    const array = [1, 2];
    const listView = FieldAccessor.getDoubleListView([array], 0);
    assertIteratorValueModification(array, listView, 3);
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

  testRepeatedInt() {
    const fields = [[0, 1, 2]];

    const listView = FieldAccessor.getIntListView(fields, 0);

    assertEquals(0, listView.get(0));
    assertEquals(1, listView.get(1));
    assertEquals(2, listView.get(2));

    const emptyListView = FieldAccessor.getIntListView(fields, 2);
    assertEquals(0, emptyListView.size());

    FieldAccessor.addAllIntElements(fields, 1, listView);
    assertEquals(0, FieldAccessor.getIntElement(fields, 1, 0));
    assertEquals(1, FieldAccessor.getIntElement(fields, 1, 1));
    assertEquals(2, FieldAccessor.getIntElement(fields, 1, 2));

    FieldAccessor.setIntElement(fields, 0, 0, 3);
    assertEquals(3, fields[0][0]);
  }

  testRepeatedIntIterator() {
    const array = [1, 2, 3, 4];
    const listView = FieldAccessor.getIntListView([array], 0);
    assertIterator(array, listView);
  }

  testRepeatedIntIteratorForLoop() {
    const array = [1, 2, 3, 4];
    const listView = FieldAccessor.getIntListView([array], 0);
    assertIteratorForLoop(array, listView);
  }

  testRepeatedIntIteratorChangingField_length() {
    const array = [1];
    const listView = FieldAccessor.getIntListView([array], 0);
    assertIteratorLengthModification(array, listView, 2);
  }

  testRepeatedIntIteratorChangingField_value() {
    const array = [1, 2];
    const listView = FieldAccessor.getIntListView([array], 0);
    assertIteratorValueModification(array, listView, 3);
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

  testRepeatedLong() {
    const fields = [['0', '1', '2']];

    const listView = FieldAccessor.getLongListView(fields, 0);

    assertTrue(Long.fromInt(0).equals(listView.get(0)));
    assertTrue(Long.fromInt(1).equals(listView.get(1)));
    assertTrue(Long.fromInt(2).equals(listView.get(2)));

    const emptyListView = FieldAccessor.getLongListView(fields, 2);
    assertEquals(0, emptyListView.size());

    FieldAccessor.addAllLongElements(fields, 1, listView);
    assertTrue(
        Long.fromInt(0).equals(FieldAccessor.getLongElement(fields, 1, 0)));
    assertTrue(
        Long.fromInt(1).equals(FieldAccessor.getLongElement(fields, 1, 1)));
    assertTrue(
        Long.fromInt(2).equals(FieldAccessor.getLongElement(fields, 1, 2)));

    FieldAccessor.setLongElement(fields, 0, 0, Long.fromInt(3));
    assertEquals('3', fields[0][0]);
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

  testRepeatedInt52Long() {
    const fields = [['0', '1', '2']];

    const listView = FieldAccessor.getLongListView(fields, 0);

    assertTrue(Long.fromInt(0).equals(listView.get(0)));
    assertTrue(Long.fromInt(1).equals(listView.get(1)));
    assertTrue(Long.fromInt(2).equals(listView.get(2)));

    const emptyListView = FieldAccessor.getLongListView(fields, 2);
    assertEquals(0, emptyListView.size());

    FieldAccessor.addAllInt52LongElements(fields, 1, listView);
    assertTrue(
        Long.fromInt(0).equals(FieldAccessor.getLongElement(fields, 1, 0)));
    assertTrue(
        Long.fromInt(1).equals(FieldAccessor.getLongElement(fields, 1, 1)));
    assertTrue(
        Long.fromInt(2).equals(FieldAccessor.getLongElement(fields, 1, 2)));

    FieldAccessor.setInt52LongElement(fields, 0, 0, Long.fromInt(3));
    assertEquals(3, fields[0][0]);
  }

  testRepeatedLongIterator() {
    const array = ['1', '2', '3', '4'];
    const listView = FieldAccessor.getLongListView([array], 0);
    assertIterator(array, listView, (val) => val.toString());
  }

  testRepeatedLongIteratorForLoop() {
    const array = ['1', '2', '3', '4'];
    const listView = FieldAccessor.getLongListView([array], 0);
    assertIteratorForLoop(array, listView, (val) => val.toString());
  }

  testRepeatedLongIteratorChangingField_length() {
    const array = ['1'];
    const listView = FieldAccessor.getLongListView([array], 0);
    assertIteratorLengthModification(
        array, listView, '2', val => val.toString());
  }

  testRepeatedLongIteratorChangingField_value() {
    const array = ['1', '2'];
    const listView = FieldAccessor.getLongListView([array], 0);
    assertIteratorValueModification(
        array, listView, '3', val => val.toString());
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

  testRepeatedString() {
    const fields = [['0', '1', '2']];

    const listView = FieldAccessor.getStringListView(fields, 0);

    assertEquals('0', listView.get(0));
    assertEquals('1', listView.get(1));
    assertEquals('2', listView.get(2));

    const emptyListView = FieldAccessor.getStringListView(fields, 2);
    assertEquals(0, emptyListView.size());

    FieldAccessor.addAllStringElements(fields, 1, listView);
    assertEquals('0', FieldAccessor.getStringElement(fields, 1, 0));
    assertEquals('1', FieldAccessor.getStringElement(fields, 1, 1));
    assertEquals('2', FieldAccessor.getStringElement(fields, 1, 2));

    FieldAccessor.setStringElement(fields, 0, 0, '3');
    assertEquals('3', fields[0][0]);
  }

  testRepeatedStringIterator() {
    const array = ['1', '2', '3', '4'];
    const listView = FieldAccessor.getStringListView([array], 0);
    assertIterator(array, listView);
  }

  testRepeatedStringIteratorForLoop() {
    const array = ['1', '2', '3', '4'];
    const listView = FieldAccessor.getStringListView([array], 0);
    assertIteratorForLoop(array, listView);
  }

  testRepeatedStringIteratorChangingField_length() {
    const array = ['1'];
    const listView = FieldAccessor.getStringListView([array], 0);
    assertIteratorLengthModification(array, listView, '2');
  }

  testRepeatedStringIteratorChangingField_value() {
    const array = ['1', '2'];
    const listView = FieldAccessor.getStringListView([array], 0);
    assertIteratorValueModification(array, listView, '3');
  }

  testValidityCheck() {
    if (!COMPILED) {
      assertTrue(isCheckType());
      assertTrue(isCheckIndex());
    }
  }
}

/**
 * @param {!Array<?>} array
 * @param {!ListView<?>} listView
 * @param {(function(?):?)=} converter
 */
function assertIterator(array, listView, converter) {
  const converterFunction = val => converter ? converter(val) : val;
  const iterator = listView[Symbol.iterator]();

  for (const value of array) {
    const entry = iterator.next();
    assertFalse(entry.done);
    assertEquals(value, converterFunction(entry.value));
  }
  assertTrue(iterator.next().done);
}

/**
 * @param {!Array<?>} array
 * @param {!ListView<?>} listView
 * @param {(function(?):?)=} converter
 */
function assertIteratorForLoop(array, listView, converter) {
  const converterFunction = val => converter ? converter(val) : val;
  const otherArray = [];
  for (const value of listView) {
    otherArray.push(converterFunction(value));
  }
  assertArrayEquals(array, otherArray);
}

/**
 * @param {!Array<?>} array
 * @param {!ListView<?>} listView
 * @param {?} modifierValue
 * @param {(function(?):?)=} converter
 */
function assertIteratorLengthModification(
    array, listView, modifierValue, converter) {
  const converterFunction = val => converter ? converter(val) : val;
  const iterator = listView[Symbol.iterator]();

  let entry = iterator.next();
  assertFalse(entry.done);
  assertEquals(array[0], converterFunction(entry.value));

  // modify the underlying array
  array.push(modifierValue);

  if (isCheckIndex()) {
    assertThrows(() => iterator.next());
  } else {
    assertTrue(iterator.next().done);
  }
}

/**
 * @param {!Array<?>} array
 * @param {!ListView<?>} listView
 * @param {?} modifierValue
 * @param {(function(?):?)=} converter
 */
function assertIteratorValueModification(
    array, listView, modifierValue, converter) {
  const converterFunction = val => converter ? converter(val) : val;
  const iterator = listView[Symbol.iterator]();

  let entry = iterator.next();
  assertFalse(entry.done);
  assertEquals(array[0], converterFunction(entry.value));

  // modify underlying array
  array[1] = modifierValue;

  entry = iterator.next();
  assertFalse(entry.done);
  assertEquals(modifierValue, converterFunction(entry.value));

  assertTrue(iterator.next().done);
}

testSuite(new FieldAccessorTest());
