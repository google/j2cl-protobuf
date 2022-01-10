// Copyright 2021 Google LLC
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

goog.module('proto.im.descriptor.internal_testUtils');

const {FieldType} = goog.requireType('proto.im.descriptor');
const {fieldSkipConstants, fieldTypeConstants} = goog.require('proto.im.descriptor.internal_constants');

function /** number */ intToBase92(/** number */ value) {
  if (value < 0 || value > 91) {
    throw new Error(`Value ${value} is out of range for base92.`);
  }
  if (value >= 58) {
    return value + 35;
  } else if (value >= 6) {
    return value + 34;
  } else if (value >= 2) {
    return value + 33;
  } else {
    return value + 32;
  }
}

function /** number */ typeValue(/** !FieldType */ fieldType) {
  return fieldType + fieldTypeConstants.SINGULAR_FIELDS_START;
}

function /** number */ repeatedTypeValue(/** !FieldType */ fieldType) {
  return fieldType + fieldTypeConstants.REPEATED_FIELDS_START;
}

function /** !Array<number> */ modifierValues(/** number */ modifier) {
  if (modifier < 1) {
    throw new Error(`Invalid modifier value: ${modifier}`);
  }
  const result = [];
  do {
    result.push((modifier & 0x0F) + fieldTypeConstants.MODIFIERS_START);
    modifier >>>= 4;
  } while (modifier > 0);
  return result;
}

function /** !Array<number> */ skipValues(/** number */ skipAmount) {
  // skipAmount should always be >= 2, but we that's not enforced here so that
  // we can encode malformed data to ensure they're caught on decode.
  const result = [];
  do {
    result.push(
        (skipAmount & fieldSkipConstants.BITMASK) +
        fieldTypeConstants.FIELD_SKIPS_START);
    skipAmount >>>= fieldSkipConstants.SHIFT_AMOUNT;
  } while (skipAmount > 0);
  return result;
}

/**
 * @param {...(number|!Array<number>)} values
 * @return {string}
 */
function encodeValues(...values) {
  return String.fromCharCode(...values.flat().map(intToBase92));
}

exports = {
  typeValue,
  repeatedTypeValue,
  modifierValues,
  skipValues,
  encodeValues,
};
