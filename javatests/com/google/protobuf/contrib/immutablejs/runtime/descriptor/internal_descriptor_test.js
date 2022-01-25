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

goog.module('proto.im.descriptor.internal_descriptorTest');

const testSuite = goog.require('goog.testing.testSuite');
const {Descriptor, Field, FieldType, } = goog.require('proto.im.descriptor');
const {DescriptorImpl, Modifier, createGetDescriptorFn} = goog.require('proto.im.descriptor.internal_descriptor');
const {MAX_FIELD_NUMBER} = goog.require('proto.im.descriptor.internal_constants');
const {descriptorBuilder, encodeValues, messageSetBuilder, modifierValues, skipValues, typeValue} = goog.require('proto.im.descriptor.testing.descriptors');

function /** !Field */ getOnlyField(
    /** !Descriptor */ descriptor,
    /** number= */ expectedFieldNumber = 1) {
  const fields = [];
  descriptor.forEachField((field) => void fields.push(field));
  assertEquals(
      'There should only be a single field in the descriptor', 1,
      fields.length);

  const field = fields[0];
  assertNotNull('The only field should be defined', field);
  assertEquals(
      `Only field in descriptor should have the field number ${
          expectedFieldNumber}`,
      expectedFieldNumber, field.fieldNumber);
  return field;
}

function singularTypeTestCase(/** !FieldType */ type) {
  const submessageDescriptorProvider =
      type === FieldType.MESSAGE || type === FieldType.GROUP ?
      createGetDescriptorFn('') :
      undefined;
  const descriptor = descriptorBuilder()
                         .addField(1, type, {submessageDescriptorProvider})
                         .build();

  const {fieldType, repeated} = getOnlyField(descriptor);

  assertEquals(type, fieldType);
  assertFalse(repeated);
}

function repeatedTypeTestCase(/** !FieldType */ type) {
  const submessageDescriptorProvider =
      type === FieldType.MESSAGE || type === FieldType.GROUP ?
      createGetDescriptorFn('') :
      undefined;
  const descriptor =
      descriptorBuilder()
          .addRepeatedField(1, type, {submessageDescriptorProvider})
          .build();

  const {fieldType, repeated} = getOnlyField(descriptor);

  assertEquals(type, fieldType);
  assertTrue(repeated);
}

function skipFieldsTestCase(/** number */ skipAmount) {
  const descriptor = DescriptorImpl.fromEncodedString(
      encodeValues(skipValues(skipAmount), typeValue(FieldType.INT32)));

  // Zero is a bit special as it still consumes space in the encoding. Therefore
  // it's actually treated as a skip of one.
  const actualFieldNumber = skipAmount || 1;
  const field = getOnlyField(descriptor, actualFieldNumber);
  assertEquals(actualFieldNumber, field.fieldNumber);
  assertEquals(FieldType.INT32, field.fieldType);
}

/**
 * @return {!Descriptor} A unique descriptor instance with no fields.
 */
function emptyDescriptor() {
  return descriptorBuilder().build();
}

testSuite({
  testFieldTypes: {
    get testSingular() {
      return Object.fromEntries(
          Object
              .entries(FieldType)
              // Skip the unknown type as it's not a real value.
              .filter(([typeName, type]) => type != -1)
              .map(
                  ([
                    typeName, type
                  ]) => [`test${typeName}`, () => singularTypeTestCase(type)]));
    },

    get testRepeated() {
      return Object.fromEntries(
          Object
              .entries(FieldType)
              // Skip the unknown type as it's not a real value.
              .filter(([typeName, type]) => type != -1)
              .map(
                  ([
                    typeName, type
                  ]) => [`test${typeName}`, () => repeatedTypeTestCase(type)]));
    },
  },

  testNestedMessages: {
    testMissingSubmessageDescriptor_shouldThrow() {
      const descriptor =
          descriptorBuilder().addField(1, FieldType.MESSAGE).build();
      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; missing submessage descriptor for field 1',
          error.message);
    },

    testWithSubmessageDescriptor_shouldAssociateItWithField() {
      const submessageDescriptor = emptyDescriptor();
      const descriptor =
          descriptorBuilder()
              .addField(
                  1, FieldType.MESSAGE,
                  {submessageDescriptorProvider: () => submessageDescriptor})
              .build();

      const field = getOnlyField(descriptor);
      assertEquals(submessageDescriptor, field.submessageDescriptorProvider());
    },

    testWithMultipleSubmessageDescriptors_shouldAssociateThemWithTheirFields() {
      const submessageDescriptor1 = emptyDescriptor();
      const submessageDescriptor2 = emptyDescriptor();
      const descriptor =
          descriptorBuilder()
              .addField(1, FieldType.STRING)
              .addField(2, FieldType.INT32)
              .addField(
                  3, FieldType.MESSAGE,
                  {submessageDescriptorProvider: () => submessageDescriptor1})
              .addField(4, FieldType.DOUBLE)
              .addField(
                  5, FieldType.GROUP,
                  {submessageDescriptorProvider: () => submessageDescriptor2})
              .addField(6, FieldType.FIXED32)
              .build();

      const fields = descriptor.fields();
      assertUndefined(
          'Field 1 should not have a submessage descriptor',
          fields[1].submessageDescriptorProvider);
      assertUndefined(
          'Field 2 should not have a submessage descriptor',
          fields[2].submessageDescriptorProvider);
      assertEquals(
          'Field 3 should have the first submessage descriptor',
          submessageDescriptor1, fields[3].submessageDescriptorProvider());
      assertUndefined(
          'Field 4 should not have a submessage descriptor',
          fields[4].submessageDescriptorProvider);
      assertEquals(
          'Field 5 should have the second submessage descriptor',
          submessageDescriptor2, fields[5].submessageDescriptorProvider());
      assertUndefined(
          'Field 6 should not have a submessage descriptor',
          fields[6].submessageDescriptorProvider);
    },
  },

  testGroups: {
    testMissingSubmessageDescriptor_shouldThrow() {
      const descriptor =
          descriptorBuilder().addField(1, FieldType.GROUP).build();

      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; missing submessage descriptor for field 1',
          error.message);
    },

    testWithSubmessageDescriptor_shouldAssociateItWithField() {
      const submessageDescriptor = emptyDescriptor();
      const descriptor =
          descriptorBuilder()
              .addField(
                  1, FieldType.GROUP,
                  {submessageDescriptorProvider: () => submessageDescriptor})
              .build();

      const field = getOnlyField(descriptor);
      assertEquals(submessageDescriptor, field.submessageDescriptorProvider());
    },
  },

  testModifiers: {
    testShouldAssociateWithPreceedingField() {
      const descriptor =
          descriptorBuilder()
              .addField(1, FieldType.INT32, {jspbInt64String: true})
              .addRepeatedField(2, FieldType.INT32, {unpacked: true})
              .addField(3, FieldType.INT32)
              .build();

      const fields = descriptor.fields();

      assertEquals('Should have 3 fields', 3, Object.entries(fields).length);

      assertTrue(
          'Field 1 should have JSPB_STRING modifier',
          fields[1].jspbInt64String);
      assertFalse(
          'Field 1 should NOT have UNPACKED modifier', fields[1].unpacked);

      assertFalse(
          'Field 2 should NOT have JSPB_STRING modifier',
          fields[2].jspbInt64String);
      assertTrue('Field 2 should have UNPACKED modifier', fields[2].unpacked);

      assertFalse(
          'Field 3 should NOT have JSPB_STRING modifier',
          fields[3].jspbInt64String);
      assertFalse(
          'Field 3 should NOT have UNPACKED modifier', fields[3].unpacked);
    },

    testNoPrevMarker_shouldThrow() {
      const descriptor = DescriptorImpl.fromEncodedString(
          encodeValues(modifierValues(Modifier.UNPACKED)));
      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; expected field type but got value: 43',
          error.message);
    },

    testPrecededByFieldSkip_shouldThrow() {
      const descriptor = DescriptorImpl.fromEncodedString(
          encodeValues(skipValues(2), modifierValues(Modifier.UNPACKED)));
      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; expected field type but got value: 43',
          error.message);
    },

    testInvalidModifier_shouldThrow() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32), modifierValues(1 << 16),
          typeValue(FieldType.STRING)));

      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; modifiers value out of known range.',
          error.message);
    },
  },

  testFieldSkips: {
    testMaxFieldNumber() {
      const descriptor = descriptorBuilder()
                             .addField(MAX_FIELD_NUMBER, FieldType.INT32)
                             .build();

      const field = getOnlyField(descriptor, MAX_FIELD_NUMBER);
      assertEquals(MAX_FIELD_NUMBER, field.fieldNumber);
    },

    testBeyondMaxFieldNumber_shouldThrow() {
      const descriptor = descriptorBuilder()
                             .addField(MAX_FIELD_NUMBER + 1, FieldType.STRING)
                             .build();

      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was 536870912',
          error.message);
    },

    testSingleSkip() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),   // 1
          skipValues(1),                // Wasteful, but valid.
          typeValue(FieldType.STRING),  // 2
          ));

      const fields = descriptor.fields();
      assertEquals(FieldType.INT32, fields[1].fieldType);
      assertEquals(FieldType.STRING, fields[2].fieldType);
    },

    testZeroSkip_shouldBeTreatedAsSingleSkip() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),   // 1
          skipValues(0),                // Treated just like a skip of 1 is.
          typeValue(FieldType.STRING),  // 2
          ));

      const fields = descriptor.fields();
      assertEquals(FieldType.INT32, fields[1].fieldType);
      assertEquals(FieldType.STRING, fields[2].fieldType);
    },

    testNegativeSkip_shouldThrow() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),   // 1
          skipValues(-1),               // Treated just like a skip of 1 is.
          typeValue(FieldType.STRING),  // ??? not valid!
          ));

      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; Field skips should be >= 0 but was -1',
          error.message);
    },

    testMaxInt32_shouldThrow() {
      const descriptor = descriptorBuilder()
                             .addField(2147483647, FieldType.STRING)  // 2^31-1
                             .build();

      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was 2147483647',
          error.message);
    },

    get testAllSingleByteFieldSkips() {
      // Field skips are 5 bits, we can exercise all valid values by testing
      // from 0-31.
      const allValues = Array.from(Array(32).keys());
      return Object.fromEntries(allValues.map((i) => {
        return [`testSkip${i}Fields`, () => skipFieldsTestCase(i)];
      }));
    }
  },

  testMessageId: {
    testWhenMissing_ShouldReturnNull() {
      const descriptor = descriptorBuilder().build();

      assertNull('messageId should be null', descriptor.messageId());
    },

    testWhenPresent_ShouldReturnMessageId() {
      const descriptor = descriptorBuilder().withMessageId('foo').build();

      assertEquals('foo', descriptor.messageId());
    },
  },

  testIsMessageSet: {
    testWhenNotSet_ShouldReturnFalse() {
      const descriptor = descriptorBuilder().build();

      assertFalse('isMessageSet should be false', descriptor.isMessageSet());
    },

    testWhenSet_ShouldReturnTrue() {
      const descriptor = messageSetBuilder().build();

      assertTrue('isMessageSet should be true', descriptor.isMessageSet());
    },
  },

  testIsExtendable: {
    testWhenNotExtendable_ReturnsFalse() {
      const descriptor = descriptorBuilder().build();

      assertFalse('IsExtendable should be false', descriptor.isExtendable());
    },

    testWhenExtendable_ReturnsTrue() {
      const descriptor = descriptorBuilder().withExtensionRegistry({}).build();

      assertTrue('IsExtendable should be true', descriptor.isExtendable());
    },
  },

  testExtensions: {
    testShouldRegisterProvidedField() {
      const descriptor = descriptorBuilder()
                             .withExtensionRegistry({})
                             .addExtension(1, FieldType.STRING)
                             .build();

      const field = getOnlyField(descriptor);
      assertTrue('Field 1 should be denoted as an extension', field.extension);
      assertEquals(
          'Extension field 1 should be of type string', FieldType.STRING,
          field.fieldType);
    },

    testWithSubmessageDescriptor_ShouldRegisterFieldWithSubmessageDescriptor() {
      const extensionRegistry = {};
      const submessageDescriptor = emptyDescriptor();
      const descriptor =
          descriptorBuilder()
              .withExtensionRegistry(extensionRegistry)
              .addExtension(1, FieldType.MESSAGE, {
                submessageDescriptorProvider: () => submessageDescriptor,
              })
              .build();

      const field = getOnlyField(descriptor);
      assertEquals(
          'Extension field 1 should be of type message', FieldType.MESSAGE,
          field.fieldType);
      assertEquals(
          'Extension field 1 should have the submessage descriptor we provided',
          submessageDescriptor, field.submessageDescriptorProvider());
    },

    testRegisterMultipleFields() {
      const descriptor = descriptorBuilder()
                             .withExtensionRegistry({})
                             .addExtension(1, FieldType.STRING)
                             .addExtension(100, FieldType.INT32)
                             .addExtension(50, FieldType.DOUBLE)
                             .build();

      const fields = descriptor.fields();
      assertEquals(
          'Extension field 1 should be of type string', FieldType.STRING,
          fields[1].fieldType);
      assertEquals(
          'Extension field 50 should be of type double', FieldType.DOUBLE,
          fields[50].fieldType);
      assertEquals(
          'Extension field 100 should be of type int32', FieldType.INT32,
          fields[100].fieldType);
    },

    testRegisterMaxFieldNumber() {
      const extensionRegistry = {};
      const descriptor = descriptorBuilder()
                             .withExtensionRegistry(extensionRegistry)
                             .addExtension(MAX_FIELD_NUMBER, FieldType.STRING)
                             .build();

      const field = getOnlyField(descriptor, MAX_FIELD_NUMBER);
      assertTrue(
          `Field ${MAX_FIELD_NUMBER} should be an extension`, field.extension);
    },

    testRegisterBeyondMaxFieldNumber_shouldThrow() {
      const descriptor = descriptorBuilder()
                             .withExtensionRegistry({})
                             // 2^29
                             .addExtension(536870912, FieldType.STRING)
                             .build();

      const error = assertThrows(() => void descriptor.fields());
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was 536870912',
          error.message);
    },

    testRegisterFieldNumberZero_shouldThrow() {
      const descriptor = descriptorBuilder()
                             .withExtensionRegistry({})
                             .addExtension(0, FieldType.STRING)
                             .build();

      const error = assertThrows(() => void descriptor.fields());
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was 0',
          error.message);
    },

    testRegisterNegativeFieldNumber_shouldThrow() {
      const descriptor = descriptorBuilder()
                             .withExtensionRegistry({})
                             .addExtension(-1, FieldType.STRING)
                             .build();

      const error = assertThrows(() => void descriptor.fields());
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was -1',
          error.message);
    },
  },
});
