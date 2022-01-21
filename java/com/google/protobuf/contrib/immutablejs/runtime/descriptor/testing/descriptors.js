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

goog.module('proto.im.descriptor.testing.descriptors');

const {Descriptor, Field, FieldType} = goog.require('proto.im.descriptor');
const {DescriptorImpl, ExtensionRegistry, Modifier, createExtension} = goog.require('proto.im.descriptor.internal_descriptor');
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

function /** string */ encodeField(/** !Field */ field) {
  let modifiers = 0;
  if (field.unpacked) {
    modifiers |= Modifier.UNPACKED;
  }
  if (field.jspbInt64String) {
    modifiers |= Modifier.JSPB_STRING;
  }

  const encodedValues =
      [field.repeated ? repeatedTypeValue(field.fieldType) :
                        typeValue(field.fieldType)];
  if (modifiers > 0) {
    encodedValues.push(...modifierValues(modifiers));
  }

  return encodeValues(...encodedValues);
}

/** @record */
class FieldOptions {
  constructor() {
    /** @const {(function():!Descriptor)|undefined} */
    this.submessageDescriptorProvider;

    /** @const {boolean|undefined} */
    this.unpacked;

    /** @const {boolean|undefined} */
    this.jspbInt64String;
  }
}

function /** !Field */ createField(
    /** number */ fieldNumber, /** !FieldType */ fieldType,
    /** boolean */ repeated, /** !FieldOptions */ fieldOptions) {
  return {
    fieldNumber,
    fieldType,
    repeated,
    extension: false,  // Doesn't matter in this context
    submessageDescriptorProvider: fieldOptions.submessageDescriptorProvider,
    unpacked: fieldOptions.unpacked || false,
    jspbInt64String: fieldOptions.jspbInt64String || false,
  };
}

class DescriptorBuilder {
  constructor() {
    /** @private @const {!Map<number, !Field>} */
    this.fields_ = new Map();

    /** @private {string|undefined} */
    this.messageId_ = undefined;

    /** @private {!ExtensionRegistry|undefined} */
    this.extensionRegistry_ = undefined;
  }

  /** @return {!DescriptorBuilder} */
  withExtensionRegistry(
      /** !ExtensionRegistry */ extensionRegistry) {
    if (this.extensionRegistry_) {
      throw new Error(
          'Attempted to set extension registry on a descriptor builder with ' +
          ' a registry already present.');
    }
    this.extensionRegistry_ = extensionRegistry;
    return this;
  }

  /** @return {!DescriptorBuilder} */
  withMessageId(/** string */ messageId) {
    this.messageId_ = messageId;
    return this;
  }

  /** @return {!DescriptorBuilder} */
  addField(
      /** number */ fieldNumber, /** !FieldType */ fieldType,
      /** !FieldOptions= */ fieldOptions = {}) {
    this.fields_.set(
        fieldNumber,
        createField(
            fieldNumber, fieldType, /* repeated= */ false, fieldOptions));
    return this;
  }

  /** @return {!DescriptorBuilder} */
  addRepeatedField(
      /** number */ fieldNumber, /** !FieldType */ fieldType,
      /** !FieldOptions= */ fieldOptions = {}) {
    this.fields_.set(
        fieldNumber,
        createField(
            fieldNumber, fieldType, /* repeated= */ true, fieldOptions));
    return this;
  }

  /** @return {!DescriptorBuilder} */
  addExtension(
      /** number */ fieldNumber, /** !FieldType */ fieldType,
      /** !FieldOptions= */ fieldOptions = {}) {
    registerExtension(
        this.extensionRegistry_, fieldNumber, fieldType, /* repeated= */ false,
        fieldOptions);
    return this;
  }

  /** @return {!DescriptorBuilder} */
  addRepeatedExtension(
      /** number */ fieldNumber, /** !FieldType */ fieldType,
      /** !FieldOptions= */ fieldOptions = {}) {
    registerExtension(
        this.extensionRegistry_, fieldNumber, fieldType, /* repeated= */ true,
        fieldOptions);
    return this;
  }

  /** @return {!Descriptor} */
  build() {
    const fieldNumbers = Array.from(this.fields_.keys()).sort();
    const encodedDescriptorValues = [];
    const submessageDescriptorProviders = [];
    let prevFieldNumber = 0;
    for (const fieldNumber of fieldNumbers) {
      const field = this.fields_.get(fieldNumber);
      if (fieldNumber - prevFieldNumber > 1) {
        encodedDescriptorValues.push(
            encodeValues(...skipValues(fieldNumber - prevFieldNumber)));
      }
      encodedDescriptorValues.push(encodeField(field));
      if (field.submessageDescriptorProvider) {
        submessageDescriptorProviders.push(field.submessageDescriptorProvider);
      }
      prevFieldNumber = fieldNumber;
    }

    return DescriptorImpl.fromArgs({
      encodedDescriptor: encodedDescriptorValues.join(''),
      submessageDescriptorProviders,
      extensionRegistry: this.extensionRegistry_,
      messageId: this.messageId_,
    });
  }
}

function /** !DescriptorBuilder */ descriptorBuilder() {
  return new DescriptorBuilder();
}

class MessageSetBuilder {
  constructor() {
    /** @private @const {!ExtensionRegistry} */
    this.extensionRegistry_ = {};

    /** @private {string|undefined} */
    this.messageId_ = undefined;
  }

  /** @return {!MessageSetBuilder} */
  addExtension(
      /** number */ fieldNumber,
      /** function():!Descriptor */ submessageDescriptorProvider) {
    registerExtension(
        this.extensionRegistry_, fieldNumber, FieldType.MESSAGE,
        /* repeated= */ false, {submessageDescriptorProvider});
    return this;
  }

  /** @return {!MessageSetBuilder} */
  addRepeatedExtension(
      /** number */ fieldNumber,
      /** function():!Descriptor */ submessageDescriptorProvider) {
    registerExtension(
        this.extensionRegistry_, fieldNumber, FieldType.MESSAGE,
        /* repeated= */ true, {submessageDescriptorProvider});
    return this;
  }

  /** @return {!Descriptor} */
  build() {
    return DescriptorImpl.fromArgs({
      encodedDescriptor: '',
      isMessageSet: true,
      extensionRegistry: this.extensionRegistry_,
      messageId: this.messageId_,
    });
  }
}

function /** !MessageSetBuilder */ messageSetBuilder() {
  return new MessageSetBuilder();
}

function registerExtension(
    /** !ExtensionRegistry|undefined */ extensionRegistry,
    /** number */ fieldNumber,
    /** !FieldType */ fieldType,
    /** boolean */ repeated,
    /** !FieldOptions= */ fieldOptions = {},
) {
  if (!extensionRegistry) {
    throw new Error(
        'Attempted to register extension on a non-extendable descriptor');
  }
  if (extensionRegistry[fieldNumber] != null) {
    throw new Error(`Extension field ${fieldNumber} is already registered.`);
  }
  const field = createField(fieldNumber, fieldType, repeated, fieldOptions);
  extensionRegistry[fieldNumber] = createExtension(
      field.fieldNumber, encodeField(field),
      field.submessageDescriptorProvider);
}

exports = {
  descriptorBuilder,
  typeValue,
  repeatedTypeValue,
  messageSetBuilder,
  modifierValues,
  skipValues,
  encodeValues,
};
