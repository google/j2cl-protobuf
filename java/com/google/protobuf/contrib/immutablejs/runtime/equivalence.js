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
 * @fileoverview An equivalence implementation for immutable protos.
 */
goog.module('proto.im.internal.Equivalence');

class Equivalence {
  /**
   * @param {!Object<number, *>} firstMessageData
   * @param {!Object<number, *>} secondMessageData
   * @return {boolean}
   */
  static equivalence(firstMessageData, secondMessageData) {
    if (!Equivalence.doEquivalence_(firstMessageData, secondMessageData)) {
      return false;
    }
    return Equivalence.doEquivalence_(secondMessageData, firstMessageData);
  }

  /**
   * @param {!Object<number, *>} firstMessageData
   * @param {!Object<number, *>} secondMessageData
   * @return {boolean}
   * @private
   */
  static doEquivalence_(firstMessageData, secondMessageData) {
    if (!Array.isArray(firstMessageData) || !Array.isArray(secondMessageData)) {
      return false;
    }

    // If the array is is the same instance no need to perform a full
    // comparison
    if (firstMessageData === secondMessageData) {
      return true;
    }

    const hasExtensionFirst = Equivalence.hasExtension_(firstMessageData);
    const hasExtensionSecond = Equivalence.hasExtension_(secondMessageData);
    const limitFirst = hasExtensionFirst ? firstMessageData.length - 1 :
                                           firstMessageData.length;
    const limitSecond = hasExtensionSecond ? secondMessageData.length - 1 :
                                             secondMessageData.length;

    for (let fieldNumber = 0; fieldNumber < limitFirst; fieldNumber++) {
      const firstValue = firstMessageData[fieldNumber];
      if (!Equivalence.valueLookup_(
              firstValue, fieldNumber, secondMessageData, hasExtensionSecond,
              limitSecond)) {
        return false;
      }
    }

    if (hasExtensionFirst) {
      const extension = firstMessageData[firstMessageData.length - 1];
      const keys = Object.keys(extension);

      for (let i = 0; i < keys.length; i++) {
        const fieldNumber = +keys[i];
        const firstValue = extension[fieldNumber];

        if (!Equivalence.valueLookup_(
                firstValue, fieldNumber, secondMessageData, hasExtensionSecond,
                limitSecond)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * @param {*} firstValue
   * @param {number} fieldNumber
   * @param {!Object<number, *>} secondMessageData
   * @param {boolean} hasExtensionSecond
   * @param {number} limitSecond
   * @return {boolean}
   * @private
   */
  static valueLookup_(
      firstValue, fieldNumber, secondMessageData, hasExtensionSecond,
      limitSecond) {
    if (fieldNumber < limitSecond) {
      const secondValue = secondMessageData[fieldNumber];
      if (!Equivalence.valueCompare_(firstValue, secondValue)) {
        return false;
      }
    } else {
      if (!hasExtensionSecond) {
        return Equivalence.valueCompare_(firstValue, null);
      }

      const secondExtension =
          secondMessageData[/** @type {!Array} */ (secondMessageData).length - 1];
      const secondValue = secondExtension[fieldNumber];
      if (!Equivalence.valueCompare_(firstValue, secondValue)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {*} firstValue
   * @param {*} secondValue
   * @return {boolean}
   * @private
   */
  static valueCompare_(firstValue, secondValue) {
    if (firstValue == null && secondValue == null) {
      return true;
    }

    if (Array.isArray(firstValue)) {
      // submessage or repeated field
      if (!Equivalence.doEquivalence_(
              /** @type {!Object<number, *>} */ (firstValue),
              /** @type {!Object<number, *>} */ (secondValue))) {
        return false;
      }
      return true;
    }

    const typeofFirst = typeof firstValue;
    const typeofSecond = typeof secondValue;

    if (typeofFirst == 'object' || typeofSecond == 'object') {
      return false;
    }

    if (firstValue == secondValue) {
      return true;
    }

    // Numbers can be encoded as strings. While the coerced check above should
    // have handled the majority of cases, NaN is an edge case as it can coerce,
    // but NaN != NaN, and thus NaN != 'NaN'.
    if (Number.isNaN(/** @type {number} */ (firstValue)) ||
        Number.isNaN(/** @type {number} */ (secondValue))) {
      return String(firstValue) === String(secondValue);
    }

    // bool fields can be encoded as numbers, in which case only zero is
    // considered as false. Any other number is considered to be true.
    if (typeofFirst === 'boolean' || typeofSecond === 'boolean') {
      return !!firstValue === !!secondValue;
    }

    return false;
  }

  /**
   * @param {!Array<*>} array
   * @return {boolean}
   * @private
   */
  static hasExtension_(array) {
    if (array.length == 0) {
      return false;
    }

    const lastEntry = array[array.length - 1];

    const typeofEntry = typeof lastEntry;
    if (!lastEntry || typeofEntry !== 'object') {
      return false;
    }
    return !Array.isArray(lastEntry);
  }
}

exports = Equivalence;
