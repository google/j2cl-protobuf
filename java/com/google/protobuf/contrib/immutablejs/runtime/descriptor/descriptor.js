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

goog.module('proto.im.descriptor');

/** @interface */
class Descriptor {
  /**
   * @return {!Object<number, !Field>} An object of all Fields keyed on the
   *     field number. This will include all known extension fields as well.
   */
  fields() {}

  /**
   * @param {function(!Field):void} callback A callback that will execute for
   *     each parsed field. This will include all known extension fields as
   *     well. The order in which the callback is called on fields is not
   *     guaranteed.
   */
  forEachField(callback) {}

  /** @return {boolean} Whether the message has a defined extensions range. */
  isExtendable() {}

  /**
   * @return {boolean} The value of the message option `message_set_wire_format`
   *     or false if not set.
   */
  isMessageSet() {}

  /**
   * @return {?string} The value of `option (jspb.message_id)`, or null if not
   *     set.
   */
  messageId() {}
}

/** @record */
class Field {
  constructor() {
    /** @const {number} */
    this.fieldNumber;

    /** @const {!FieldType} */
    this.fieldType;

    /** @const {boolean} */
    this.repeated;

    /**
     * Whether field is from an extension.
     * @const {boolean}
     */
    this.extension;

    /**
     * A provider for the submessage descriptor. The provider will be undefined
     * if the field type is not a message or group.
     *
     * @const {(function():!Descriptor)|undefined}
     */
    this.submessageDescriptorProvider;

    /**
     * Whether the field is unpacked. This should only be considered for
     * repeated fields that are packable.
     *
     * @const {boolean}
     */
    this.unpacked;

    /**
     * Whether the field uses string encoding for 64-bit integer field in the
     * Apps JSPB wire format.
     *
     * @const {boolean}
     */
    this.jspbInt64String;
  }
}

/** @enum {number} */
const FieldType = {
  DOUBLE: 0,
  FLOAT: 1,
  FIXED32: 2,
  FIXED64: 3,
  SFIXED32: 4,
  SFIXED64: 5,
  INT32: 6,
  UINT32: 7,
  SINT32: 8,
  INT64: 9,
  UINT64: 10,
  SINT64: 11,
  ENUM: 12,
  BOOL: 13,
  BYTES: 14,
  STRING: 15,
  GROUP: 16,
  MESSAGE: 17,
};

exports = {
  Descriptor,
  Field,
  FieldType,
};