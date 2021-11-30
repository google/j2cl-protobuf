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
 * @fileoverview Provides ByteString as a basic data type for protos.
 */
goog.module('proto.im.ByteString');

const Hashing = goog.require('proto.im.internal.Hashing');
const base64 = goog.require('goog.crypt.base64');
const {checkType, freezeObject} = goog.require('proto.im.internal.internalChecks');



/**
 * Immutable sequence of bytes.
 *
 * Bytes can be obtained as an Array of numbers or a base64 encoded string.
 * @final
 */
class ByteString {
  /**
   * @param {?Array<number>} bytes
   * @param {?string} base64
   * @private
   */
  constructor(bytes, base64) {
    /** @private */
    this.bytes_ = bytes;
    /** @private */
    this.base64_ = base64;
    /** @private */
    this.hashCode_ = 0;
  }

  /**
   * Constructs a ByteString instance from a base64 string.
   * @param {string} value
   * @returns {!ByteString}
   */
  static fromBase64String(value) {
    checkType(value != null);
    return new ByteString(/* bytes */ null, value);
  }

  /**
   * Constructs a ByteString from an array of numbers.
   * @param {!Array<number>} bytes
   * @returns {!ByteString}
   */
  static copyFrom(bytes) {
    return new ByteString(bytes.slice(), /* base 64 */ null);
  }

  /**
   * Returns this ByteString as a byte array. Note that the array is frozen.
   *
   * TODO(b/160621969): Remove toByteArray in favor to toInt8Array after
   * cleaning the clientside code.
   *
   * @return {!Array<number>}
   */
  toByteArray() {
    return this.ensureBytes_();
  }

  /**
   * Returns this ByteString as a Int8 byte array.
   * @return {!Int8Array}
   */
  toInt8Array() {
    return new Int8Array(this.ensureBytes_());
  }

  /**
   * Returns this ByteString as a Uint8 Byte array.
   * @return {!Uint8Array}
   */
  toUint8Array() {
    return new Uint8Array(this.ensureBytes_());
  }


  /**
   * Returns the number of bytes in the string.
   * @return {number}
   */
  size() {
    return this.ensureBytes_().length;
  }

  /**
   * Returns the byte value at position `index`
   * @param {number} index
   * @return {number}
   */
  byteAt(index) {
    return this.ensureBytes_()[index];
  }

  /**
   * Returns this ByteString as a base64 encoded string.
   * @return {string}
   */
  toBase64String() {
    return this.ensureBase64String_();
  }

  /**
   * Returns true for Bytestrings that contain identical values.
   * @param {*} other
   * @return {boolean}
   */
  equals(other) {
    if (this === other) {
      return true;
    }

    if (!(other instanceof ByteString)) {
      return false;
    }

    const otherByteString = /** @type{!ByteString} */ (other);
    return this.toBase64String() === otherByteString.toBase64String();
  }

  /**
   * Returns a number (int32) that is suitable for using in hashed structures.
   * @return {number}
   */
  hashCode() {
    if (this.hashCode_ == 0) {
      this.hashCode_ = Hashing.hashString(this.toBase64String());
    }
    return this.hashCode_;
  }

  /**
   * Returns true if the bytestring is empty.
   * @return {boolean}
   */
  isEmpty() {
    if (this.bytes_ != null && this.bytes_.length == 0) {
      return true;
    }
    if (this.base64_ != null && this.base64_.length == 0) {
      return true;
    }
    return false;
  }

  /**
   * @return {!Array<number>}
   * @private
   */
  ensureBytes_() {
    if (this.bytes_ == null) {
      this.bytes_ = freezeObject(
          base64.decodeStringToByteArray(/** @type {string} */ (this.base64_)));
    }

    return /** @type {!Array<number>} */ (this.bytes_);
  }

  /**
   * @return {string}
   * @private
   */
  ensureBase64String_() {
    if (this.base64_ == null) {
      this.base64_ = base64.encodeByteArray(this.toUint8Array());
    }

    return /** @type {string} */ (this.base64_);
  }
}

/** @const {!ByteString} */
ByteString.EMPTY = new ByteString([], null);

exports = ByteString;
