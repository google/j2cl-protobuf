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

goog.module('proto.im.internal.descriptor');

const {Descriptor, Field, FieldType} = goog.require('proto.im.descriptor');
const {MAX_FIELD_NUMBER, fieldSkipConstants, fieldTypeConstants, oneofConstants, oneofFieldNumberConstants} = goog.require('proto.im.internal.constants');
const {fieldTypeConstants: encodedFieldTypeConstants} = goog.require('proto.im.internal.encodedConstants');

/** @implements {Descriptor} */
class DescriptorImpl {
  /**
   * @param {string} fullEncodedDescriptor
   * @param {!Array<function():!Descriptor>=} submessageDescriptorProviders
   * @param {!ExtensionRegistry=} extensionRegistry
   * @param {string=} messageId
   * @param {boolean=} isMessageSet
   * @private
   */
  constructor(
      fullEncodedDescriptor, submessageDescriptorProviders = undefined,
      extensionRegistry = undefined, messageId = undefined,
      isMessageSet = false) {
    /** @private @const {string} */
    this.fullEncodedDescriptor_ = fullEncodedDescriptor;

    /** @private @const {number} */
    this.fieldDescriptorEnd_ = this.fullEncodedDescriptor_.indexOf(
        encodedFieldTypeConstants.END_OF_FIELD_DESCRIPTOR);

    /** @private @const {!Array<function():!Descriptor>|undefined} */
    this.submessageDescriptorProviders_ = submessageDescriptorProviders;

    /** @private @const {!ExtensionRegistry|undefined} */
    this.extensionRegistry_ = extensionRegistry;

    /** @private @const {?string} */
    this.messageId_ = messageId != null ? messageId : null;

    /** @private @const {boolean} */
    this.isMessageSet_ = isMessageSet;
  }

  /**
   * @param {!Args} args
   * @return {!DescriptorImpl}
   */
  static fromArgs(args) {
    return new DescriptorImpl(
        args.encodedDescriptor, args.submessageDescriptorProviders,
        args.extensionRegistry, args.messageId, args.isMessageSet);
  }

  /**
   * @param {string} encodedDescriptor
   * @return {!DescriptorImpl}
   */
  static fromEncodedString(encodedDescriptor) {
    return new DescriptorImpl(encodedDescriptor);
  }

  /**
   * @return {!Object<number, !Field>}
   * @override
   */
  fields() {
    const fields = Object.create(null);
    this.forEachField((field) => {
      fields[field.fieldNumber] = field;
    });
    return fields;
  }

  /**
   * @param {function(!Field):void} callback
   * @override
   */
  forEachField(callback) {
    const fieldDescriptorReader = new Base92Reader(
        this.fullEncodedDescriptor_, /* offset= */ 0,
        /* limit= */ this.fieldDescriptorEnd_);
    let lastFieldNumber = 0;
    let submessageDescriptorIndex = 0;
    const submessageDescriptorSupplier = () =>
        this.submessageDescriptorProviders_?.[submessageDescriptorIndex++];
    while (!isNaN(fieldDescriptorReader.peekValue())) {
      lastFieldNumber =
          getNextFieldNumber(fieldDescriptorReader, lastFieldNumber);
      callback(parseField(
          fieldDescriptorReader, lastFieldNumber, /* extension= */ false,
          submessageDescriptorSupplier));
    }

    if (!this.extensionRegistry_) {
      return;
    }

    for (const key in this.extensionRegistry_) {
      const fieldNumber = parseInt(key, 10);
      const extension = this.extensionRegistry_[fieldNumber];
      let field;
      if (extension == null) {
        continue;
      } else if (typeof extension === 'string') {
        field = parseField(
            Base92Reader.readEntireString(extension), fieldNumber,
            /* extension= */ true);
      } else {
        const extensionObj = /** @type {!Extension} */ (extension);
        field = parseField(
            Base92Reader.readEntireString(extensionObj.encodedDescriptor),
            fieldNumber, /* extension= */ true,
            () => extensionObj.submessageDescriptorProvider);
      }
      callback(field);
    }
  }

  /**
   * @return {boolean}
   * @override
   */
  hasOneofs() {
    // The oneofs begin after the field descriptor end marker. If the marker is
    // not present then there are no oneofs.
    return this.fieldDescriptorEnd_ >= 0;
  }

  /**
   * @return {!Array<!Array<number>>}
   * @override
   */
  oneofs() {
    const groups = [];
    this.forEachOneof((oneofGroup) => void groups.push(oneofGroup));
    return groups;
  }

  /**
   * @param {function(!Array<number>):void} callback
   * @override
   */
  forEachOneof(callback) {
    if (!this.hasOneofs()) {
      return;
    }
    // Checking hasOneofs() above ensures that the offset is non-negative.
    const oneofReader = new Base92Reader(
        this.fullEncodedDescriptor_, /* offset= */ this.fieldDescriptorEnd_ + 1,
        /* limit= */ -1);

    let group = [];
    while (!isNaN(oneofReader.peekValue())) {
      if (isOneofSeperator(oneofReader.peekValue())) {
        const value = oneofReader.consumeValue();
        // At the end of the group invoke the callback with the current group
        // and prepare for the next group.
        if (value === oneofConstants.ONEOF_GROUP_SEPARATOR) {
          callback(group);
          group = [];
        }
        continue;
      }

      const fieldNumber = parseOneofFieldNumber(oneofReader);
      checkState(
          fieldNumber > 0,
          `expected oneof field number but got ${oneofReader.peekValue()}`);
      group.push(fieldNumber);
    }

    // Invoke the callback one last time if there was a trailing group.
    if (group.length > 0) {
      callback(group);
    }
  }

  /**
   * @return {boolean}
   * @override
   */
  isExtendable() {
    return this.extensionRegistry_ != null;
  }

  /**
   * @return {?string}
   * @override
   */
  messageId() {
    return this.messageId_;
  }

  /**
   * @return {boolean}
   * @override
   */
  isMessageSet() {
    return this.isMessageSet_;
  }
}

/** @record */
class Args {
  constructor() {
    /** @const {string} */
    this.encodedDescriptor;

    /**
     * An array of functions that provide `Descriptor`s for message/group
     * fields. The array should be in field number ascending order with no
     * holes. They will be consumed in the same order that the relevant field
     * types are parsed.
     *
     * Can be undefined if the message has no message/group fields.
     * @type {!Array<function():!Descriptor>|undefined}
     */
    this.submessageDescriptorProviders;

    /** @type {!ExtensionRegistry|undefined} */
    this.extensionRegistry;

    /**
     * The value of` option (jspb.message_id)`, or undefined if not set.
     * @type {string|undefined}
     */
    this.messageId;

    /**
     * The value of the message option `message_set_wire_format` or false if not
     * set.
     * @type {boolean|undefined}
     */
    this.isMessageSet;
  }
}

/**
 * @param {function():!Args} argsSupplier
 * @return {function():!Descriptor}
 */
function createGetDescriptorFnFromArgs(argsSupplier) {
  let Descriptor;
  return () => Descriptor ||
      (Descriptor = DescriptorImpl.fromArgs(argsSupplier()));
}

/**
 * @param {string} encodedDescriptor
 * @return {function():!Descriptor}
 */
function createGetDescriptorFn(encodedDescriptor) {
  let Descriptor;
  return () => Descriptor ||
      (Descriptor = DescriptorImpl.fromEncodedString(encodedDescriptor));
}

/** @record */
class Extension {
  constructor() {
    /** @const {string} */
    this.encodedDescriptor;

    /** @const {function():!Descriptor} */
    this.submessageDescriptorProvider;
  }
}

/**
 * A registry of field number keys to string encoded descriptors, or `Extension`
 * objects.
 *
 * Passing the encoded string descriptor should be preferred to reduce generated
 * code size costs unless additional metadata about the extension field is
 * required (ex. a submessage descriptor).
 *
 * @typedef {!Object<number, string|!Extension>}
 */
let ExtensionRegistry;

/**
 * @param {!ExtensionRegistry} extensionRegistry The extension registry for the
 *     message that we want to register the field with.
 * @param {number} fieldNumber
 * @param {string} encodedDescriptor The encoded descriptor for the extension
 *     field. The descriptor should _only_ contain the `FieldType` and any
 *     `Modifier`s, if applicable.
 * @param {(function():!Descriptor)=} submessageDescriptorProvider A provider
 *     for the submessage descriptor, if applicable for the extension field
 *     type.
 */
function registerExtension(
    extensionRegistry, fieldNumber, encodedDescriptor,
    submessageDescriptorProvider = undefined) {
  checkState(
      fieldNumber >= 1 && fieldNumber <= MAX_FIELD_NUMBER,
      `Field numbers should be <= ${MAX_FIELD_NUMBER} and >= 1, but was ${
          fieldNumber}`);
  if (submessageDescriptorProvider) {
    extensionRegistry[fieldNumber] = {
      encodedDescriptor,
      submessageDescriptorProvider,
    };
  } else {
    extensionRegistry[fieldNumber] = encodedDescriptor;
  }
}

function /** number */ decodeBase92FromCharCode(/** number */ charCode) {
  // Base92 starts at charCode 32. We skip charCodes 34 ("), 39 ('), and
  // 92 (\) as they require escaping. When decoding we need to properly
  // shift down by 32 and by how many values we've skipped.
  if (isNaN(charCode)) {
    return NaN;
  } else if (charCode > 92) {
    return charCode - 35;
  } else if (charCode > 39) {
    return charCode - 34;
  } else if (charCode > 34) {
    return charCode - 33;
  } else {
    return charCode - 32;
  }
}

class Base92Reader {
  /**
   * @param {string} str A base92 encoded string.
   * @param {number} offset The index into the backing str that the reader
   *     should start reading from.
   * @param {number} limit The number of characters in the backing str that the
   *     reader can read up to. If negative then `str.length - offset` will be
   *     used.
   * @private
   */
  constructor(str, offset, limit) {
    /** @private @const {string} */
    this.str_ = str;

    /** @private @const {number} */
    this.offset_ = offset;

    /** @private @const {number} */
    this.limit_ = limit >= 0 ? limit : this.str_.length - this.offset_;

    /** @private {number} */
    this.cursor_ = this.offset_;

    /** @private {number} */
    this.peekedValue_ = NaN;

    this.populatePeekValue_();
  }

  /**
   * @param {string} str The Base92 encoded string
   * @return {!Base92Reader}
   */
  static readEntireString(str) {
    return new Base92Reader(str, /* offset= */ 0, /* limit= */ str.length);
  }

  /**
   * Gets the Base92 at the current location and advances the position.
   * @return {number} The Base92 value at the current position, or NaN if out of
   *     range.
   */
  consumeValue() {
    const value = this.peekedValue_;
    // Only advance if we're not the end.
    if (!isNaN(value)) {
      this.cursor_++;
      this.populatePeekValue_();
    }
    return value;
  }

  /**
   * @return {number} The Base92 value at the current position, or NaN if out of
   *     range.
   */
  peekValue() {
    return this.peekedValue_;
  }

  /**
   * Pre-populates the peeked value before explicitly being requested.
   * @private
   */
  populatePeekValue_() {
    this.peekedValue_ = this.cursor_ < (this.offset_ + this.limit_) ?
        decodeBase92FromCharCode(this.str_.charCodeAt(this.cursor_)) :
        NaN;
  }
}

function /** number */ getNextFieldNumber(
    /** !Base92Reader */ reader, /** number */ lastFieldNumber) {
  let skipAmount = 0;
  let shift = 0;
  while (isFieldSkip(reader.peekValue())) {
    skipAmount |=
        ((reader.consumeValue() - fieldTypeConstants.FIELD_SKIPS_START) &
         fieldSkipConstants.BITMASK)
        << shift;
    shift += fieldSkipConstants.SHIFT_AMOUNT;
  }
  checkState(
      skipAmount >= 0, `Field skips should be >= 0 but was ${skipAmount}`);
  const nextFieldNumber = lastFieldNumber + (skipAmount || 1);
  checkState(
      nextFieldNumber <= MAX_FIELD_NUMBER,
      `Field numbers should be <= ${MAX_FIELD_NUMBER} and >= 1, but was ${
          nextFieldNumber}`);
  return nextFieldNumber;
}

function /** boolean */ isFieldSkip(/** number */ base92Value) {
  return base92Value >= fieldTypeConstants.FIELD_SKIPS_START &&
      base92Value <= fieldTypeConstants.FIELD_SKIPS_END;
}

/**
 * @param {!Base92Reader} reader
 * @param {number} fieldNumber The field number of the field being read.
 * @param {boolean} extension Whether the field is an extension.
 * @param {(function():(function():!Descriptor))=} submessageDescriptorSupplier
 *     A supplier of the next `getSubmessageDescriptor` function. The supplier
 *     will be invoked in field number ascending order but only for group and
 *     message field types. If omitted then the caller is responsible for
 *     ensuring that the field type will not be a message/group.
 * @return {!Field}
 */
function parseField(
    reader, fieldNumber, extension, submessageDescriptorSupplier = undefined) {
  const fieldTypeValue = reader.consumeValue();
  checkState(
      isFieldType(fieldTypeValue),
      `expected field type but got value: ${fieldTypeValue}`);
  const repeated = isRepeatedFieldType(fieldTypeValue);
  const fieldType = /** @type {!FieldType} */ (
      fieldTypeValue % fieldTypeConstants.REPEATED_FIELDS_START);

  const modifiers = isModifier(reader.peekValue()) ? parseModifiers(reader) : 0;

  let submessageDescriptorProvider = null;
  if (fieldType === FieldType.MESSAGE || fieldType === FieldType.GROUP) {
    submessageDescriptorProvider = submessageDescriptorSupplier?.();
    checkState(
        submessageDescriptorProvider != null,
        `missing submessage descriptor for field ${fieldNumber}`);
  }
  return {
    fieldNumber,
    fieldType,
    repeated,
    extension,
    submessageDescriptor:
        submessageDescriptorProvider ? submessageDescriptorProvider() : null,
    unpacked: hasModifier(modifiers, Modifier.UNPACKED),
    jspbInt64String: hasModifier(modifiers, Modifier.JSPB_STRING),
  };
}

function /** boolean */ isFieldType(/** number */ base92Value) {
  return (base92Value >= fieldTypeConstants.SINGULAR_FIELDS_START &&
          base92Value <= fieldTypeConstants.REPEATED_FIELDS_END) ||
      base92Value === fieldTypeConstants.MAP_FIELD;
}

function /** boolean */ isRepeatedFieldType(/** number */ base92Value) {
  return (base92Value >= fieldTypeConstants.REPEATED_FIELDS_START &&
          base92Value <= fieldTypeConstants.REPEATED_FIELDS_END) ||
      base92Value === fieldTypeConstants.MAP_FIELD;
}

function /** number */ parseModifiers(/** !Base92Reader */ reader) {
  const value = reader.consumeValue();
  checkState(isModifier(value), `expected modifier but got ${value}`);

  // Currently only two bits are allocated for modifiers, so all values should
  // be <= 3. Ensure that the next value is not also a modifier.
  // TODO(kevinoconnor): Maybe remove this check? Or make it debug-only.
  if (value <= fieldTypeConstants.MODIFIERS_START + 3 &&
      !isModifier(reader.peekValue())) {
    return value - fieldTypeConstants.MODIFIERS_START;
  }

  throw new Error(`Malformed descriptor; modifiers value out of known range.`);
}

function /** boolean */ isModifier(/** number */ base92Value) {
  return base92Value >= fieldTypeConstants.MODIFIERS_START &&
      base92Value <= fieldTypeConstants.MODIFIERS_END;
}

function /** boolean */ isOneofSeperator(/** number */ value) {
  return value === oneofConstants.ONEOF_FIELD_SEPARATOR ||
      value === oneofConstants.ONEOF_GROUP_SEPARATOR;
}

function /** boolean */ isOneofFieldNumber(/** number */ value) {
  return value >= oneofConstants.ONEOF_FIELD_NUMBER_START &&
      value <= oneofConstants.ONEOF_FIELD_NUMBER_END;
}

function /** number */ parseOneofFieldNumber(/** !Base92Reader */ reader) {
  let fieldNumber = 0;
  let shift = 0;
  while (isOneofFieldNumber(reader.peekValue())) {
    fieldNumber |= (reader.consumeValue() & oneofFieldNumberConstants.BITMASK)
        << shift;
    shift += oneofFieldNumberConstants.SHIFT_AMOUNT;
  }
  checkState(
      fieldNumber <= MAX_FIELD_NUMBER && fieldNumber >= 0,
      `Field numbers should be <= ${MAX_FIELD_NUMBER} and >= 1, but was ${
          fieldNumber}`);
  return fieldNumber;
}

function checkState(/** boolean */ condition, /** string */ message) {
  if (goog.DEBUG && !condition) {
    throw new Error(`Malformed descriptor; ${message}`);
  }
}

/**
 * A bit-mask of extra options attributed to a `Field`.
 * @enum {number}
 */
const Modifier = {
  UNPACKED: 1 << 0,
  JSPB_STRING: 1 << 1,
};

function /** boolean */ hasModifier(
    /** number */ modifiers, /** !Modifier */ modifier) {
  return !!(modifiers & modifier);
}

exports = {
  DescriptorImpl,
  ExtensionRegistry,
  Modifier,
  createGetDescriptorFn,
  createGetDescriptorFnFromArgs,
  registerExtension,
};
