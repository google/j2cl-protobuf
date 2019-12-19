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
 * @fileoverview A collection of internal methods to manipulate protos
 * internal data structure.
 *
 * User code should never call any of the methods in this class, this should
 * only be called from generated proto code.
 *
 * Field accessors perform extra checks at runtime enforcing types.
 * These can be turned on/off using the
 * We do these runtime checks so that developers can find quirks in their protos
 * earlier. Think of a proto on the server having weird incompatible values vs.
 * the client side throwing an exception.
 */
goog.module('proto.im.internal.FieldAccessor');

const ByteString = goog.require('proto.im.ByteString');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const internalChecks = goog.require('proto.im.internal.internalChecks');

/**
 * FieldAccessor encodes information on how to access different
 * field types. It handles conversion between wire format and in memory format.
 * @const
 */
class FieldAccessor {
  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!Array<*>}
   * @private
   */
  static ensureRepeatedFieldPresent_(rawJson, fieldNumber) {
    rawJson[fieldNumber] = rawJson[fieldNumber] || [];
    return /** @type {!Array<*>} */ (rawJson[fieldNumber]);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {boolean}
   */
  static hasField(rawJson, fieldNumber) {
    return rawJson[fieldNumber] != null;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {*}
   * @private
   */
  static getElement_(rawJson, fieldNumber, elementIndex) {
    const maybeArray = rawJson[fieldNumber];
    const array = internalChecks.checkTypeArray(maybeArray);
    internalChecks.checkIndex(elementIndex, array.length);
    return array[elementIndex];
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<T>} values
   * @param {function(!Object<number, *>, number, T)} addFn
   * @template T
   * @private
   */
  static addAllElements_(rawJson, fieldNumber, values, addFn) {
    for (const value of values) {
      addFn(rawJson, fieldNumber, value);
    }
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {?} value
   * @private
   */
  static setElement_(rawJson, fieldNumber, elementIndex, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkIndex(elementIndex, array.length);
    array[elementIndex] = value;
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {function(!Object<number, *>, number): T} accessorFn
   * @return {!ListView<T>}
   * @private
   * @template T
   */
  static createListView_(rawJson, fieldNumber, accessorFn) {
    const maybeArray = rawJson[fieldNumber];
    if (maybeArray == null) {
      return BaseListView_.EMPTY;
    }
    const array = internalChecks.checkTypeArray(maybeArray);
    if (array.length === 0) {
      return BaseListView_.EMPTY;
    }
    return new BaseListView_(array, accessorFn);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {number}
   */
  static getRepeatedFieldCount(rawJson, fieldNumber) {
    const maybeArray = rawJson[fieldNumber];
    if (maybeArray == null) {
      return 0;
    }
    const array = internalChecks.checkTypeArray(maybeArray);
    return array.length;
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {boolean} defaultValue
   * @return {boolean}
   */
  static getBooleanWithDefault(rawJson, fieldNumber, defaultValue) {
    const value = rawJson[fieldNumber];
    if (value != null) {
      internalChecks.checkBooleanRepresentation(value);
      return !!value;
    }
    return defaultValue;
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {boolean}
   */
  static getBoolean(rawJson, fieldNumber) {
    return FieldAccessor.getBooleanWithDefault(rawJson, fieldNumber, false);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {boolean | number} value
   */
  static setBoolean(rawJson, fieldNumber, value) {
    internalChecks.checkTypeBoolean(value);
    rawJson[fieldNumber] = value ? 1 : 0;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} value
   */
  static setBooleanIterable(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = [];
    FieldAccessor.addAllBooleanElements(rawJson, fieldNumber, value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {boolean}
   */
  static getBooleanElement(rawJson, fieldNumber, elementIndex) {
    const value = FieldAccessor.getElement_(rawJson, fieldNumber, elementIndex);
    internalChecks.checkBooleanRepresentation(value);
    return !!value;
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} values
   */
  static addAllBooleanElements(rawJson, fieldNumber, values) {
    FieldAccessor.addAllElements_(
        rawJson, fieldNumber, values, FieldAccessor.addBooleanElement);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {boolean} value
   */
  static addBooleanElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkTypeBoolean(value);
    array.push(value ? 1 : 0);
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {boolean} value
   */
  static setBooleanElement(rawJson, fieldNumber, elementIndex, value) {
    internalChecks.checkTypeBoolean(value);
    FieldAccessor.setElement_(
        rawJson, fieldNumber, elementIndex, value ? 1 : 0);
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!ListView<boolean>}
   */
  static getBooleanListView(rawJson, fieldNumber) {
    return FieldAccessor.createListView_(
        rawJson, fieldNumber, FieldAccessor.getBoolean);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!ByteString} defaultValue
   * @return {!ByteString}
   */
  static getByteStringWithDefault(rawJson, fieldNumber, defaultValue) {
    const maybeString = rawJson[fieldNumber];
    if (maybeString != null) {
      return ByteString.fromBase64String(
          internalChecks.checkTypeString(maybeString));
    }
    return defaultValue;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!ByteString}
   */
  static getByteString(rawJson, fieldNumber) {
    return FieldAccessor.getByteStringWithDefault(
        rawJson, fieldNumber, ByteString.EMPTY);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!ByteString} value
   */
  static setByteString(rawJson, fieldNumber, value) {
    internalChecks.checkType(value instanceof ByteString);
    rawJson[fieldNumber] = value.toBase64String();
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {!ByteString}
   */
  static getByteStringElement(rawJson, fieldNumber, elementIndex) {
    const value = FieldAccessor.getElement_(rawJson, fieldNumber, elementIndex);
    return ByteString.fromBase64String(internalChecks.checkTypeString(value));
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} values
   */
  static addAllByteStringElements(rawJson, fieldNumber, values) {
    FieldAccessor.addAllElements_(
        rawJson, fieldNumber, values, FieldAccessor.addByteStringElement);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!ByteString} value
   */
  static addByteStringElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkType(value instanceof ByteString);
    array.push(value.toBase64String());
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!ByteString} value
   */
  static setByteStringElement(rawJson, fieldNumber, elementIndex, value) {
    internalChecks.checkType(value instanceof ByteString);
    FieldAccessor.setElement_(
        rawJson, fieldNumber, elementIndex, value.toBase64String());
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!ListView<!ByteString>}
   */
  static getByteStringListView(rawJson, fieldNumber) {
    return FieldAccessor.createListView_(
        rawJson, fieldNumber, FieldAccessor.getByteString);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} value
   */
  static setByteStringIterable(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = [];
    FieldAccessor.addAllByteStringElements(rawJson, fieldNumber, value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @return {number}
   */
  static getDoubleWithDefault(rawJson, fieldNumber, defaultValue) {
    const value = rawJson[fieldNumber];
    if (value != null) {
      internalChecks.checkDoubleRepresentation(value);
      // Doubles can arrive as strings (NaN, Infinity, -Infinity) or actual
      // JavaScript numbers, this ensures we coerce to a number here.
      return +value;
    }
    return defaultValue;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {number}
   */
  static getDouble(rawJson, fieldNumber) {
    return FieldAccessor.getDoubleWithDefault(rawJson, fieldNumber, 0);
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} value
   * @return {void}
   */
  static setDouble(rawJson, fieldNumber, value) {
    internalChecks.checkTypeNumber(value);
    rawJson[fieldNumber] = FieldAccessor.serializeDouble_(value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {number}
   */
  static getDoubleElement(rawJson, fieldNumber, elementIndex) {
    const value = FieldAccessor.getElement_(rawJson, fieldNumber, elementIndex);
    internalChecks.checkDoubleRepresentation(value);
    // Doubles can arrive as strings (NaN, Infinity, -Infinity) or actual
    // JavaScript numbers, this ensures we coerce to a number here.
    return +value;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<number>} values
   */
  static addAllDoubleElements(rawJson, fieldNumber, values) {
    FieldAccessor.addAllElements_(
        rawJson, fieldNumber, values, FieldAccessor.addDoubleElement);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} value
   */
  static addDoubleElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkTypeNumber(value);
    array.push(FieldAccessor.serializeDouble_(value));
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   */
  static setDoubleElement(rawJson, fieldNumber, elementIndex, value) {
    internalChecks.checkTypeNumber(value);
    FieldAccessor.setElement_(
        rawJson, fieldNumber, elementIndex,
        FieldAccessor.serializeDouble_(value));
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!ListView<number>}
   */
  static getDoubleListView(rawJson, fieldNumber) {
    return FieldAccessor.createListView_(
        rawJson, fieldNumber, FieldAccessor.getDouble);
  }


  /**
   * @param {number} value
   * @returns {number|string}
   * @private
   */
  static serializeDouble_(value) {
    if (typeof value !== 'number') {
      return 'NaN';
    }
    if (isFinite(value)) {
      return value;
    } else if (value > 0) {
      return 'Infinity';
    } else if (value < 0) {
      return '-Infinity';
    }
    return 'NaN';
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   */
  static setDoubleIterable(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = [];
    FieldAccessor.addAllDoubleElements(rawJson, fieldNumber, value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @return {number}
   */
  static getIntWithDefault(rawJson, fieldNumber, defaultValue) {
    const value = rawJson[fieldNumber];
    if (value != null) {
      return internalChecks.checkTypeInt(value);
    }
    return defaultValue;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {number}
   */
  static getInt(rawJson, fieldNumber) {
    return FieldAccessor.getIntWithDefault(rawJson, fieldNumber, 0);
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} value
   * @return {void}
   */
  static setInt(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = internalChecks.checkTypeInt(value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {number}
   */
  static getIntElement(rawJson, fieldNumber, elementIndex) {
    const value = FieldAccessor.getElement_(rawJson, fieldNumber, elementIndex);
    return internalChecks.checkTypeInt(value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<number>} values
   */
  static addAllIntElements(rawJson, fieldNumber, values) {
    FieldAccessor.addAllElements_(
        rawJson, fieldNumber, values, FieldAccessor.addIntElement);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} value
   */
  static addIntElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    array.push(internalChecks.checkTypeInt(value));
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   */
  static setIntElement(rawJson, fieldNumber, elementIndex, value) {
    FieldAccessor.setElement_(
        rawJson, fieldNumber, elementIndex, internalChecks.checkTypeInt(value));
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!ListView<number>}
   */
  static getIntListView(rawJson, fieldNumber) {
    return FieldAccessor.createListView_(
        rawJson, fieldNumber, FieldAccessor.getInt);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   */
  static setIntIterable(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = [];
    FieldAccessor.addAllIntElements(rawJson, fieldNumber, value);
  }

  /**
   *
   * @param {*} value
   * @return {!Long}
   * @private
   */
  static convertToLong_(value) {
    internalChecks.checkLongRepresentation(value);
    if (typeof value === 'number') {
      const valueNumber = /** @type {number} */ (value);
      internalChecks.checkNumberInLongSafeRange(valueNumber);
      return Long.fromNumber(valueNumber);
    } else {
      return Long.fromString(/** @type {string} */ (value));
    }
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @return {!Long}
   */
  static getLongWithDefault(rawJson, fieldNumber, defaultValue) {
    const value = rawJson[fieldNumber];
    if (value != null) {
      return FieldAccessor.convertToLong_(value);
    }
    return defaultValue;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!Long}
   */
  static getLong(rawJson, fieldNumber) {
    return FieldAccessor.getLongWithDefault(
        rawJson, fieldNumber, Long.getZero());
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  static setLong(rawJson, fieldNumber, value) {
    internalChecks.checkType(value instanceof Long);
    rawJson[fieldNumber] = value.toString();
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  static setInt52Long(rawJson, fieldNumber, value) {
    internalChecks.checkType(value instanceof Long);
    internalChecks.checkLongSafeRange(value);
    rawJson[fieldNumber] = value.toNumber();
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {!Long}
   */
  static getLongElement(rawJson, fieldNumber, elementIndex) {
    const value = FieldAccessor.getElement_(rawJson, fieldNumber, elementIndex);
    return FieldAccessor.convertToLong_(value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} values
   */
  static addAllLongElements(rawJson, fieldNumber, values) {
    FieldAccessor.addAllElements_(
        rawJson, fieldNumber, values, FieldAccessor.addLongElement);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} values
   */
  static addAllInt52LongElements(rawJson, fieldNumber, values) {
    FieldAccessor.addAllElements_(
        rawJson, fieldNumber, values, FieldAccessor.addInt52LongElement);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  static addLongElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkType(value instanceof Long);
    array.push(value.toString());
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  static addInt52LongElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkType(value instanceof Long);
    internalChecks.checkLongSafeRange(value);
    array.push(value.toNumber());
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   */
  static setLongElement(rawJson, fieldNumber, elementIndex, value) {
    internalChecks.checkType(value instanceof Long);
    FieldAccessor.setElement_(
        rawJson, fieldNumber, elementIndex, value.toString());
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   */
  static setInt52LongElement(rawJson, fieldNumber, elementIndex, value) {
    internalChecks.checkType(value instanceof Long);
    internalChecks.checkLongSafeRange(value);
    FieldAccessor.setElement_(
        rawJson, fieldNumber, elementIndex, value.toNumber());
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!ListView<!Long>}
   */
  static getLongListView(rawJson, fieldNumber) {
    return FieldAccessor.createListView_(
        rawJson, fieldNumber, FieldAccessor.getLong);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   */
  static setLongIterable(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = [];
    FieldAccessor.addAllLongElements(rawJson, fieldNumber, value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   */
  static setInt52LongIterable(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = [];
    FieldAccessor.addAllInt52LongElements(rawJson, fieldNumber, value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {function(!Object<number, *>): !MESSAGE} instanceCreator
   * @return {!MESSAGE}
   * @template MESSAGE
   */
  static getMessage(rawJson, fieldNumber, instanceCreator) {
    const value = rawJson[fieldNumber] || [];
    return instanceCreator(internalChecks.checkTypeArray(value));
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Object<number, *>} value
   */
  static setMessage(rawJson, fieldNumber, value) {
    internalChecks.checkTypeArray(value);
    rawJson[fieldNumber] = value;
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {function(!Object<number, *>): !MESSAGE} instanceCreator
   * @return {!MESSAGE}
   * @template MESSAGE
   */
  static getMessageElement(
      rawJson, fieldNumber, elementIndex, instanceCreator) {
    const value = FieldAccessor.getElement_(rawJson, fieldNumber, elementIndex);
    return instanceCreator(internalChecks.checkTypeArray(value));
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {function(!Object<number, *>): !MESSAGE} instanceCreator
   * @return {!ListView<!MESSAGE>}
   * @template MESSAGE
   */
  static getMessageListView(rawJson, fieldNumber, instanceCreator) {
    return FieldAccessor.createListView_(
        rawJson, fieldNumber, (data, index) => {
          let maybeArray = data[index];
          if (maybeArray == null) {
            maybeArray = [];
          }
          const array = internalChecks.checkTypeArray(maybeArray);
          return instanceCreator(array);
        });
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Object<number, *>} value
   */
  static setMessageElement(rawJson, fieldNumber, elementIndex, value) {
    internalChecks.checkTypeArray(value);
    FieldAccessor.setElement_(rawJson, fieldNumber, elementIndex, value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Object<number, *>} value
   */
  static addMessageElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkTypeArray(value);
    array.push(value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {string} defaultValue
   * @return {string}
   */
  static getStringWithDefault(rawJson, fieldNumber, defaultValue) {
    const value = rawJson[fieldNumber];
    if (value != null) {
      internalChecks.checkTypeString(value);
      return String(value);
    }
    return defaultValue;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {string}
   */
  static getString(rawJson, fieldNumber) {
    return FieldAccessor.getStringWithDefault(rawJson, fieldNumber, '');
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {string} value
   */
  static setString(rawJson, fieldNumber, value) {
    internalChecks.checkTypeString(value);
    rawJson[fieldNumber] = String(value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {string}
   */
  static getStringElement(rawJson, fieldNumber, elementIndex) {
    const value = FieldAccessor.getElement_(rawJson, fieldNumber, elementIndex);
    return internalChecks.checkTypeString(value);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<string>} values
   */
  static addAllStringElements(rawJson, fieldNumber, values) {
    FieldAccessor.addAllElements_(
        rawJson, fieldNumber, values, FieldAccessor.addStringElement);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {string} value
   */
  static addStringElement(rawJson, fieldNumber, value) {
    const array =
        FieldAccessor.ensureRepeatedFieldPresent_(rawJson, fieldNumber);
    internalChecks.checkTypeString(value);
    array.push(String(value));
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {string} value
   */
  static setStringElement(rawJson, fieldNumber, elementIndex, value) {
    internalChecks.checkTypeString(value);
    FieldAccessor.setElement_(
        rawJson, fieldNumber, elementIndex, String(value));
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!ListView<string>}
   */
  static getStringListView(rawJson, fieldNumber) {
    return FieldAccessor.createListView_(
        rawJson, fieldNumber, FieldAccessor.getString);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Iterable<string>} value
   */
  static setStringIterable(rawJson, fieldNumber, value) {
    rawJson[fieldNumber] = [];
    FieldAccessor.addAllStringElements(rawJson, fieldNumber, value);
  }
}



/**
 * @template T
 * @implements {ListView<T>}
 * @private
 */
class BaseListView_ {
  /**
   * @param {!Array<?>} array
   * @param {function(!Object<number, *>, number):T} accessorFn
   */
  constructor(array, accessorFn) {
    /** @private {!Array<?>} */
    this.array_ = array;
    /** @private {function(!Object<number, *>, number):T} */
    this.accessorFn_ = accessorFn;
  }

  /**
   * @override
   * @param {number} index
   * @return {T}
   */
  get(index) {
    internalChecks.checkIndex(index, this.size());
    return this.accessorFn_(this.array_, index);
  }

  /**
   * @override
   * @return {number}
   */
  size() {
    return this.array_.length;
  }


  /**
   * @override
   * @return {!Array<T>}
   */
  toArray() {
    if (Array.from) {
      return Array.from(
          this.array_, (v, i) => this.accessorFn_(this.array_, i));
    }

    let newArray = new Array(this.size());
    for (let i = 0; i < newArray.length; i++) {
      newArray[i] = this.get(i);
    }
    return newArray;
  }

  /**
   * @return {!Iterator<T>}
   */
  [Symbol.iterator]() {
    return ListView.toIterator(this);
  }
}

/**
 * @type {!ListView<?>}
 * @const
 */
BaseListView_.EMPTY = new BaseListView_([], function(array, index) {
  throw new Error('Index out of bounds');
});

exports = FieldAccessor;
