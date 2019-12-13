/**
 * @fileoverview Configuration file for proto settings.
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
