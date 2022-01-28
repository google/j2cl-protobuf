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
const Long = goog.require('goog.math.Long');
const base64 = goog.require('goog.crypt.base64');
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
   */
  static ensureRepeatedFieldPresent(rawJson, fieldNumber) {
    if (!rawJson[fieldNumber]) {
      rawJson[fieldNumber] = [];
    }
    return internalChecks.checkTypeArray(rawJson[fieldNumber]);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!Array<*>}
   */
  static ensureMapFieldPresent(rawJson, fieldNumber) {
    const value = rawJson[fieldNumber];
    if (!value) {
      return rawJson[fieldNumber] = [];
    }
    return internalChecks.checkTypeArray(value);
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
   * @param {boolean} value
   */
  static setBoolean(rawJson, fieldNumber, value) {
    internalChecks.checkTypeBoolean(value);
    rawJson[fieldNumber] = value ? 1 : 0;
  }

  /**
   * @param {boolean} value
   * @return {boolean}
   */
  static isBooleanProto3Default(value) {
    return value === false;
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
   * @param {!ByteString} value
   * @return {boolean}
   */
  static isByteStringProto3Default(value) {
    return value.equals(ByteString.EMPTY);
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
   * @param {number} value
   * @return {boolean}
   */
  static isDoubleProto3Default(value) {
    return value === 0;
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
    return isFinite(value) ? value : String(value);
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
   * @param {number} value
   * @return {boolean}
   */
  static isIntProto3Default(value) {
    return value === 0;
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @return {number}
   */
  static getUIntWithDefault(rawJson, fieldNumber, defaultValue) {
    const value = rawJson[fieldNumber];
    if (value != null) {
      // We coerce unsigned integer to 32 bit signed integers since that is how
      // immutable js proto exposes Uint32.
      return internalChecks.checkTypeSintOrUint(value) << 0;
    }
    return defaultValue;
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {number}
   */
  static getUInt(rawJson, fieldNumber) {
    return FieldAccessor.getUIntWithDefault(rawJson, fieldNumber, 0);
  }


  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {number} value
   * @return {void}
   */
  static setUInt(rawJson, fieldNumber, value) {
    // Coerce to unsigned on the wire.
    rawJson[fieldNumber] = internalChecks.checkTypeSintOrUint(value) >>> 0;
  }

  /**
   * @param {number} value
   * @return {boolean}
   */
  static isUIntProto3Default(value) {
    return value === 0;
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
   * @param {!Long} value
   * @return {boolean}
   */
  static isLongProto3Default(value) {
    return value.equals(Long.getZero());
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @return {!Long}
   */
  static getInt52LongWithDefault(rawJson, fieldNumber, defaultValue) {
    return FieldAccessor.getLongWithDefault(rawJson, fieldNumber, defaultValue);
  }

  /**
   * @param {!Object<number, *>} rawJson
   * @param {number} fieldNumber
   * @return {!Long}
   */
  static getInt52Long(rawJson, fieldNumber) {
    return FieldAccessor.getLong(rawJson, fieldNumber);
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
   * @param {!Long} value
   * @return {boolean}
   */
  static isInt52LongProto3Default(value) {
    return value.equals(Long.getZero());
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
   * @param {string} value
   * @return {boolean}
   */
  static isStringProto3Default(value) {
    return value === '';
  }

  /**
   * Serializes special values that may appear in arrays that originated from
   * App JSPB.
   *
   * @param {string} key
   * @param {*} value
   * @return {*}
   */
  static serializeSpecialValues(key, value) {
    switch (typeof value) {
      case 'number':
        return isFinite(value) ? value : String(value);
      case 'object':
        if (!value || Array.isArray(value)) {
          // These are all common cases, so handle them first.
          return value;
        }
        if (value instanceof Uint8Array) {
          return base64.encodeByteArray(value);
        }
        break;
    }
    return value;
  }
}

exports = FieldAccessor;
