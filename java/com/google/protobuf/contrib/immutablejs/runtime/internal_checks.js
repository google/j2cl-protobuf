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
 * @fileoverview Proto internal runtime checks.
 * @suppress {lateProvide}
 */
goog.module('proto.im.internal.internalChecks');

const Long = goog.require('goog.math.Long');

const defines = goog.require('proto.im.defines');

/** @type {boolean} */
const CHECK_TYPE =
    defines.CHECK_TYPE || defines.CHECKED_MODE__DO_NOT_USE_INTERNAL;
/** @type {boolean} */
const CHECK_INDEX =
    defines.CHECK_INDEX || defines.CHECKED_MODE__DO_NOT_USE_INTERNAL;
/** @type {boolean} */
const CHECK_LONG_DATA_LOSS =
    defines.CHECK_LONG_DATA_LOSS || defines.CHECKED_MODE__DO_NOT_USE_INTERNAL;

/**
 * @param {*} value
 */
function checkBooleanRepresentation(value) {
  if (!CHECK_TYPE) {
    return;
  }
  const type = typeof value;

  if (type === 'number') {
    if (value === 1 || value === 0) {
      return;
    }
  } else if (type === 'boolean') {
    return;
  }

  throw new Error('Not a boolean, 0 or 1: ' + value);
}


/**
 * @param {*} value
 */
function checkDoubleRepresentation(value) {
  if (!CHECK_TYPE) {
    return;
  }

  const type = typeof value;

  if (type === 'number') {
    return;
  }

  if (type === 'string') {
    if (value === 'NaN' || value === 'Infinity' || value === '-Infinity') {
      return;
    }
  }

  throw new Error('Not a number, "NaN", "Infinity" or "-Infinity": ' + value);
}


/**
 * @param {*} value
 */
function checkLongRepresentation(value) {
  if (!CHECK_TYPE) {
    return;
  }

  const type = typeof value;

  if (type === 'number' && !isNaN(value)) {
    return;
  }

  if (type === 'string') {
    return;
  }

  throw new Error('Not a number nor a string: ' + value);
}


/**
 * @param {!Long} value
 */
function checkLongSafeRange(value) {
  if (!CHECK_LONG_DATA_LOSS) {
    return;
  }

  if (!value.isSafeInteger()) {
    throw new Error('Int64 exceeds number range: ' + value);
  }
}


/**
 * @param {number} value
 */
function checkNumberInLongSafeRange(value) {
  if (!CHECK_LONG_DATA_LOSS) {
    return;
  }

  if (!Number.isSafeInteger(value)) {
    throw new Error('Not in safe long range: ' + value);
  }
}


/**
 * @param {number} index
 * @param {number} max
 */
function checkIndex(index, max) {
  if (!CHECK_INDEX) {
    return;
  }
  if (index >= 0 && index < max) {
    return;
  }

  throw new Error('Not in bound: ' + index + ' max: ' + max);
}


/**
 * @param {boolean} value
 * @param {string=} message
 */
function checkType(value, message = '') {
  if (!CHECK_TYPE) {
    return;
  }

  if (!value) {
    throw new Error(message);
  }
}


/**
 * @param {*} value
 * @return {!Array<*>}
 */
function checkTypeArray(value) {
  if (CHECK_TYPE && !Array.isArray(value)) {
    throw new Error('Not an array: ' + value);
  }
  return /** @type {!Array<*>} */ (value);
}


/**
 * @param {*} value
 */
function checkTypeBoolean(value) {
  if (!CHECK_TYPE) {
    return;
  }

  const type = typeof value;

  if (type === 'boolean') {
    return;
  }
  throw new Error('Not a boolean: ' + value);
}

/**
 * @param {*} value
 * @return {!Array<*>}
 */
function checkTypeMapEntry(value) {
  if (CHECK_TYPE && checkTypeArray(value).length != 2) {
    throw new Error('Not a map entry: ' + value);
  }
  return /** @type {!Array<*>} */ (value);
}

/**
 * @param {*} value
 * @return {string|number|boolean}
 */
function checkTypeMapKey(value) {
  if (CHECK_TYPE) {
    switch (typeof value) {
      case 'number':
      case 'string':
      case 'boolean':
        break;
      default:
        throw new Error('Not a valid map key type: ' + value);
    }
  }
  return /** @type {string|number|boolean} */ (value);
}


// About coersion for integers:
// On the wire Uint32 fields are represented as unsigned 32-bit integers, thus
// are the scale of the value rather than the bit representation. For
// compatability negative values for unsigned 32-bit fields can be read from the
// wire was well.
// At the public API level Int32/Uint32 fields are represented as truncated
// 32-bit signed integers. This is a deliberate choice, since this repsentation
// allows using bitwise operations and also consistent with Java protos.

/**
 * @param {*} value
 * @return {number}
 */
function checkTypeInt(value) {
  if (!CHECK_TYPE) {
    return (/** @type {number} */ (value)) | 0;
  }

  const valueAsNumber = checkTypeNumber(value);

  if ((valueAsNumber | 0) === value) {
    return /** @type {number} */ (value);
  }
  throw new Error('Not a 32 bit integer: ' + value);
}

/**
 * @param {*} value
 * @return {number}
 */
function checkTypeSintOrUint(value) {
  if (!CHECK_TYPE) {
    return (/** @type {number} */ (value)) | 0;
  }

  const valueAsNumber = checkTypeNumber(value);
  if ((valueAsNumber | 0) === value || (valueAsNumber >>> 0) === value) {
    return (/** @type {number} */ (value));
  }

  throw new Error('Not a signed/unsigned 32 bit integer: ' + value);
}



/**
 * @param {*} value
 * @return {number}
 */
function checkTypeNumber(value) {
  if (CHECK_TYPE && typeof value !== 'number') {
    throw new Error('Not a number: ' + value);
  }
  return /** @type {number} */ (value);
}


/**
 * @param {*} value
 * @return {string}
 */
function checkTypeString(value) {
  if (CHECK_TYPE && typeof value !== 'string') {
    throw new Error('Not a string: ' + value);
  }
  return /** @type {string} */ (value);
}

/**
 * @return {boolean}
 */
function isCheckType() {
  return CHECK_TYPE;
}

/**
 * @return {boolean}
 */
function isCheckIndex() {
  return CHECK_INDEX;
}

/**
 * @return {boolean}
 */
function isCheckLongDataLoss() {
  return CHECK_LONG_DATA_LOSS;
}


exports = {
  checkBooleanRepresentation,
  checkDoubleRepresentation,
  checkLongRepresentation,
  checkLongSafeRange,
  checkNumberInLongSafeRange,
  checkIndex,
  checkType,
  checkTypeArray,
  checkTypeBoolean,
  checkTypeInt,
  checkTypeMapEntry,
  checkTypeMapKey,
  checkTypeNumber,
  checkTypeSintOrUint,
  checkTypeString,
  isCheckType,
  isCheckIndex,
  isCheckLongDataLoss,
};
