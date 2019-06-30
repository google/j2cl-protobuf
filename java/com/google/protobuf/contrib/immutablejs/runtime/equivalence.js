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

    if (typeof firstValue == 'object' || typeof secondValue == 'object') {
      return false;
    }

    if (firstValue !== secondValue) {
      return false;
    }
    return true;
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
