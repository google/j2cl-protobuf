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
 * @fileoverview Configuration file for proto settings.
 * @suppress {lintChecks}
 */
goog.provide('proto.im.defines');

// DO NOT USE OR I WILL BREAK YOU ON PURPOSE
// This is only here so that we can force checks off for proto internal
// tests. No one should ever turn any of these checks of in their tests.
/** @define{boolean} */
proto.im.defines.CHECKED_MODE__DO_NOT_USE_INTERNAL = goog.define(
    'proto.im.defines.CHECKED_MODE__DO_NOT_USE_INTERNAL', goog.DEBUG);

// Defines in here control various preconditions in immutable proto.
// Preconditions are always turned on in testing (goog.DEBUG) and are turned
// off for production by default (code size & performance).

/**
 * Controls type checks for fields within immutable proto.
 * @define{boolean}
 * */
proto.im.defines.CHECK_TYPE = goog.define('proto.im.defines.CHECK_TYPE', false);

/**
 * Controls index checks within immutable proto.
 * @define{boolean}
 */
proto.im.defines.CHECK_INDEX =
    goog.define('proto.im.defines.CHECK_INDEX', false);

/**
 * Controls whether immutable proto freezes underlying data stuctures.
 * @define{boolean}
 */
proto.im.defines.FREEZE_DATASTRUCTURES =
    goog.define('proto.im.defines.FREEZE_DATASTRUCTURES', false);

/**
 * Controls data loss checks for int64 fields.
 * Int64 fields can be represented as strings or number on the wire. Since
 * JavaScript numbers can only fit 52 bits immutable proto checks for data loss
 * on int64 fields that are used as with JavaScript numbers and throws
 * exceptions if they exceed the safe range.
 * @define{boolean}
 */
proto.im.defines.CHECK_LONG_DATA_LOSS =
    goog.define('proto.im.defines.CHECK_LONG_DATA_LOSS', false);

/**
 * Marker indicating a group has fixed b/171736612.
 * @const {string}
 */
proto.im.defines.FIXED_GROUP_FLAG = 'g';

/** @private {boolean} */
proto.im.defines.fixGroupsB171736612 = true;

/**
 * Enable a fix for handling group fields where the field number is <= the
 * group's number.
 *
 * @param {boolean} value
 */
proto.im.defines.enableFixGroupsB171736612 = function(value) {
  proto.im.defines.fixGroupsB171736612 = value;
};

/**
 * Returns true if a fix for handling group fields where the field number is <=
 * the group's number is enabled.
 *
 * @return {boolean} Returns whether or not the fix is enabled.
 */
proto.im.defines.isFixGroupsB171736612Enabled = function() {
  return proto.im.defines.fixGroupsB171736612;
};
