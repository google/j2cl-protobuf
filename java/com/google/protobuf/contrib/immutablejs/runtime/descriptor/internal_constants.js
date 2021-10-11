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

goog.module('proto.im.internal.constants');

/** @const {number} */
exports.MAX_FIELD_NUMBER = (1 << 29) - 1;  // 2^29 - 1

/**
 * Constants that mark special values or ranges of values for the field type
 * portion of the encoded descriptor.
 *
 * All values should be within Base-92 range (i.e. [0, 92) ). There should be
 * no repetition/overlap of values.
 */
exports.fieldTypeConstants = {
  /** @const {number} */
  SINGULAR_FIELDS_START: 0,
  /** @const {number} */
  SINGULAR_FIELDS_END: 20,  // inclusive
  /** @const {number} */
  REPEATED_FIELDS_START: 21,
  /** @const {number} */
  REPEATED_FIELDS_END: 41,  // inclusive
  /** @const {number} */
  MODIFIERS_START: 42,
  /** @const {number} */
  MODIFIERS_END: 57,  // inclusive
  /** @const {number} */
  MAP_FIELD: 58,  // TODO(kevinoconnor): Decide what to do with this.
  /** @const {number} */
  END_OF_FIELD_DESCRIPTOR: 59,
  /** @const {number} */
  FIELD_SKIPS_START: 60,
  /** @const {number} */
  FIELD_SKIPS_END: 91,
};

exports.fieldSkipConstants = {
  /** @const {number} */
  SHIFT_AMOUNT: 5,
  /** @const {number} */
  BITMASK: 0x1F,
};

/**
 * Constants that mark special values or ranges of values for the oneof groups
 * portion of the encoded descriptor.
 *
 * All values should be within Base-92 range (i.e. [0, 92) ). There should be
 * no repetition/overlap of values.
 */
exports.oneofConstants = {
  /** @const {number} */
  ONEOF_FIELD_NUMBER_START: 0,
  /** @const {number} */
  ONEOF_FIELD_NUMBER_END: 63,  // inclusive
  /** @const {number} */
  ONEOF_FIELD_SEPARATOR: 89,
  /** @const {number} */
  ONEOF_GROUP_SEPARATOR: 91,
};

exports.oneofFieldNumberConstants = {
  /** @const {number} */
  SHIFT_AMOUNT: 6,
  /** @const {number} */
  BITMASK: 0x3F,
};