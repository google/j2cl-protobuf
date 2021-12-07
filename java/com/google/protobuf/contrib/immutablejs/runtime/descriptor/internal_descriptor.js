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
const {MAX_FIELD_NUMBER, fieldSkipConstants, fieldTypeConstants} = goog.require('proto.im.internal.constants');
const {cacheReturnValue} = goog.require('goog.functions');
const {fieldTypeConstants: encodedFieldTypeConstants} = goog.require('proto.im.internal.encodedConstants');

/** @implements {Descriptor} */
class DescriptorImpl {
  /**
   * @param {string} fullEncodedDescriptor
   * @param {!Array<function():!Descriptor>=} submessageDescriptorProviders
   * @param {function():!Array<!ExtensionFieldInfo>=} extensionsProvider
   * @param {string=} messageId
   * @param {boolean=} isMessageSet
   * @private
   */
  constructor(
      fullEncodedDescriptor, submessageDescriptorProviders = undefined,
      extensionsProvider = undefined, messageId = undefined,
      isMessageSet = false) {
    /** @private @const {string} */
    this.fullEncodedDescriptor_ = fullEncodedDescriptor;

    /** @private @const {number} */
    this.fieldDescriptorEnd_ = this.fullEncodedDescriptor_.indexOf(
        encodedFieldTypeConstants.END_OF_FIELD_DESCRIPTOR);

    /** @private @const {!Array<function():!Descriptor>|undefined} */
    this.submessageDescriptorProviders_ = submessageDescriptorProviders;

    /** @private @const {function():!Array<!ExtensionFieldInfo>|undefined} */
    this.extensionsProvider_ = extensionsProvider;

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
    checkState(
        args.extensionRegistry == null || args.extensionsProvider == null,
        'Descriptor cannot be constructed with both an extensionRegistry and ' +
            'extensionsProvider');
    if (args.extensionRegistry) {
      const extensionRegistry = args.extensionRegistry;
      args.extensionsProvider = () => Object.values(extensionRegistry);
    }
    return new DescriptorImpl(
        args.encodedDescriptor, args.submessageDescriptorProviders,
        args.extensionsProvider, args.messageId, args.isMessageSet);
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

    if (!this.extensionsProvider_) {
      return;
    }

    const extensions = this.extensionsProvider_();
    for (let i = 0; i < extensions.length; i++) {
      const extension = extensions[i];
      const hasSubmessage = extension.submessageDescriptorProvider != null;
      const field = parseField(
          Base92Reader.readEntireString(extension.encodedDescriptor),
          extension.fieldNumber, /* extension= */ true,
          hasSubmessage ? () => extension.submessageDescriptorProvider :
                          undefined);
      callback(field);
    }
  }

  /**
   * @return {boolean}
   * @override
   */
  isExtendable() {
    return this.extensionsProvider_ != null;
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

    /** @type {function():!Array<!ExtensionFieldInfo>|undefined} */
    this.extensionsProvider;

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
  return cacheReturnValue(() => DescriptorImpl.fromArgs(argsSupplier()));
}

/**
 * @param {string} encodedDescriptor
 * @return {function():!Descriptor}
 */
function createGetDescriptorFn(encodedDescriptor) {
  return cacheReturnValue(
      () => DescriptorImpl.fromEncodedString(encodedDescriptor));
}

/**
 * Descriptor information for an extension field.
 * @record
 */
class ExtensionFieldInfo {
  constructor() {
    /** @const {number} */
    this.fieldNumber;

    /** @const {string} */
    this.encodedDescriptor;

    /** @const {(function():!Descriptor)|undefined} */
    this.submessageDescriptorProvider;
  }
}

/**
 * A registry of `ExtensionFieldInfo` keyed on the field number.
 *
 * @typedef {!Object<number, !ExtensionFieldInfo>}
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
  extensionRegistry[fieldNumber] = {
    fieldNumber,
    encodedDescriptor,
    submessageDescriptorProvider,
  };
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

  let submessageDescriptorProvider = undefined;
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
    submessageDescriptorProvider,
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
  ExtensionFieldInfo,
  Modifier,
  createGetDescriptorFn,
  createGetDescriptorFnFromArgs,
  registerExtension,
};
