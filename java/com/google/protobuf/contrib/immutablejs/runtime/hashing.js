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
 * @fileoverview Calculates hashcodes for protocol buffer data.
 *
 * User code should never call any of the methods in this class, this should
 * only be called from generated proto code.
 */
goog.module('proto.im.internal.Hashing');

const {checkType} = goog.require('proto.im.internal.internalChecks');

/**
 * Provides hashing for proto data objects.
 */
class Hashing {

  /**
   * Returns a 32 bit number for the corresponding proto.
   * The hashing has to be inline with the equivalence implementation and has to
   * produce the same hash for message with different pivot. For that reason the
   * algorithm should result in the same hashcode even the fields are defined
   * in the array or spread into an extension object.
   *
   * @param {*} value
   * @return {number}
   */
  static hash(value) {
    return Hashing.addHashTo_(value, 0);
  }

  /**
   * @param {*} value
   * @param {number} currentHash
   * @return {number}
   * @private
   */
  static addHashTo_(value, currentHash) {
    if (value == null) {
      return currentHash;
    }

    switch (typeof value) {
      case 'object':
        if (Array.isArray(value)) {
          return Hashing.addArrayHashTo_(
              /** @type {!Array<number>} */ (value), currentHash);
        } else {
          return Hashing.addObjectHashTo_(
              /** @type {!Object<string, *>} */ (value), currentHash);
        }
      case 'boolean':
        return Hashing.addNumberHashTo_(value ? 1 : 3, currentHash);
      case 'number':
        return Hashing.addNumberHashTo_(
            /** @type {number} */ (value), currentHash);
      case 'string':
        return Hashing.addNumberHashTo_(
            Hashing.hashString(/** @type {string} */ (value)), currentHash);
      default:
        // all other possible values here (function, etc.) should never
        // occur in a proto array, so we just ignore them.
        checkType(false, 'Unexpected type: ' + typeof value);
        return currentHash;
    }
  }

  /**
   * @param {number} value
   * @param {number} currentHash
   * @return {number}
   * @private
   */
  static addNumberHashTo_(value, currentHash) {
    return (17 * currentHash + value) | 0;
  }

  /**
   * @param {!Array<?>} value
   * @param {number} currentHash
   * @return {number}
   * @private
   */
  static addArrayHashTo_(value, currentHash) {
    for (let i = 0; i < value.length; i++) {
      currentHash = Hashing.addHashTo_(value[i], currentHash);
    }
    return currentHash;
  }

  /**
   * @param {!Object<string, *>} value
   * @param {number} currentHash
   * @return {number}
   * @private
   */
  static addObjectHashTo_(value, currentHash) {
    for (const key in value) {
      if (!isNaN(key)) {
        currentHash = Hashing.addHashTo_(value[key], currentHash);
      }
    }
    return currentHash;
  }

  /**
   * @param {string} value
   * @return {number}
   */
  static hashString(value) {
    let hashValue = 1;
    const stringLength = value.length;
    const stringBatchLength = stringLength - 4;
    let i = 0;
    // Process batches of 4 characters at a time and add them to the hash
    // coercing to 32 bits
    while (i < stringBatchLength) {
      hashValue = (value.charCodeAt(i) + 31 * hashValue) | 0;
      hashValue = (value.charCodeAt(i + 1) + 31 * hashValue) | 0;
      hashValue = (value.charCodeAt(i + 2) + 31 * hashValue) | 0;
      hashValue = (value.charCodeAt(i + 3) + 31 * hashValue) | 0;
      i += 4;
    }

    // Now process the leftovers
    while (i < stringLength) {
      hashValue = (value.charCodeAt(i++) + 31 * hashValue) | 0;
    }
    return hashValue;
  }
}

exports = Hashing;
