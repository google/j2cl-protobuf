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

goog.module('proto.im.internal.descriptorTest');

const testSuite = goog.require('goog.testing.testSuite');
const {Descriptor, Field, FieldType, } = goog.require('proto.im.descriptor');
const {DescriptorImpl, Modifier, createGetDescriptorFn, registerExtension} = goog.require('proto.im.internal.descriptor');
const {MAX_FIELD_NUMBER, fieldTypeConstants} = goog.require('proto.im.internal.constants');
const {encodeValues, modifierValues, oneofValues, repeatedTypeValue, skipValues, typeValue} = goog.require('proto.im.internal.testUtils');

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
  const encodedDescriptor = encodeValues(typeValue(type));

  let descriptor;
  if (type === FieldType.MESSAGE || type === FieldType.GROUP) {
    descriptor = DescriptorImpl.fromArgs({
      encodedDescriptor,
      submessageDescriptorProviders: [createGetDescriptorFn('')],
    });
  } else {
    descriptor = DescriptorImpl.fromEncodedString(encodedDescriptor);
  }

  const {fieldType, repeated} = getOnlyField(descriptor);
  assertEquals(type, fieldType);
  assertFalse(repeated);
}

function repeatedTypeTestCase(/** !FieldType */ type) {
  const encodedDescriptor = encodeValues(repeatedTypeValue(type));

  let descriptor;
  if (type === FieldType.MESSAGE || type === FieldType.GROUP) {
    descriptor = DescriptorImpl.fromArgs({
      encodedDescriptor,
      submessageDescriptorProviders: [createGetDescriptorFn('')],
    });
  } else {
    descriptor = DescriptorImpl.fromEncodedString(encodedDescriptor);
  }

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
  return DescriptorImpl.fromEncodedString('');
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
      const descriptor = DescriptorImpl.fromEncodedString(
          encodeValues(typeValue(FieldType.MESSAGE)));
      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; missing submessage descriptor for field 1',
          error.message);
    },

    testWithSubmessageDescriptor_shouldAssociateItWithField() {
      const encodedDescriptor = encodeValues(typeValue(FieldType.MESSAGE));
      const submessageDescriptor = emptyDescriptor();

      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor,
        submessageDescriptorProviders: [() => submessageDescriptor],
      });

      const field = getOnlyField(descriptor);
      assertEquals(submessageDescriptor, field.submessageDescriptorProvider());
    },

    testWithMultipleSubmessageDescriptors_shouldAssociateThemWithTheirFields() {
      const encodedDescriptor = encodeValues(
          typeValue(FieldType.STRING),   // 1
          typeValue(FieldType.INT32),    // 2
          typeValue(FieldType.MESSAGE),  // 3
          typeValue(FieldType.DOUBLE),   // 4
          typeValue(FieldType.GROUP),    // 5
          typeValue(FieldType.FIXED32),  // 6
      );
      const submessageDescriptor1 = emptyDescriptor();
      const submessageDescriptor2 = emptyDescriptor();

      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor,
        submessageDescriptorProviders:
            [() => submessageDescriptor1, () => submessageDescriptor2],
      });

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
      const descriptor = DescriptorImpl.fromEncodedString(
          encodeValues(typeValue(FieldType.GROUP)));

      const error = assertThrows(() => descriptor.fields());
      assertEquals(
          'Malformed descriptor; missing submessage descriptor for field 1',
          error.message);
    },

    testWithSubmessageDescriptor_shouldAssociateItWithField() {
      const encodedDescriptor = encodeValues(typeValue(FieldType.GROUP));
      const submessageDescriptor = emptyDescriptor();

      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor,
        submessageDescriptorProviders: [() => submessageDescriptor],
      });

      const field = getOnlyField(descriptor);
      assertEquals(submessageDescriptor, field.submessageDescriptorProvider());
    },
  },

  testModifiers: {
    testShouldAssociateWithPreceedingField() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),  // 1
          modifierValues(Modifier.JSPB_STRING),
          repeatedTypeValue(FieldType.INT32),  // 2
          modifierValues(Modifier.UNPACKED),
          typeValue(FieldType.INT32),  // 3
          ));

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
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          skipValues(MAX_FIELD_NUMBER),
          typeValue(FieldType.INT32),
          ));

      const field = getOnlyField(descriptor, MAX_FIELD_NUMBER);
      assertEquals(MAX_FIELD_NUMBER, field.fieldNumber);
    },

    testBeyondMaxFieldNumber_shouldThrow() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),  // 1
          skipValues(
              MAX_FIELD_NUMBER),  // Skipping by MAX means next is MAX + 1.
          typeValue(FieldType.STRING),  // 536870912
          ));

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
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          skipValues(2147483647),       // 2^31-1
          typeValue(FieldType.STRING),  // ??? not valid!
          ));

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

  testOneofs: {
    testShouldAssociateAllFieldsInGroup() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),  // 1
          typeValue(FieldType.INT32),  // 2
          typeValue(FieldType.INT32),  // 3
          fieldTypeConstants.END_OF_FIELD_DESCRIPTOR,
          oneofValues([1, 3]),
          ));

      assertTrue('The descriptor should have oneofs', descriptor.hasOneofs());
      const oneofGroups = descriptor.oneofs();
      assertObjectEquals([[1, 3]], oneofGroups);
    },

    testMultipleOneofGroups() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),  // 1
          typeValue(FieldType.INT32),  // 2
          typeValue(FieldType.INT32),  // 3
          typeValue(FieldType.INT32),  // 4
          fieldTypeConstants.END_OF_FIELD_DESCRIPTOR,
          oneofValues([1, 3], [2, 4]),
          ));

      assertTrue('The descriptor should have oneofs', descriptor.hasOneofs());
      const oneofGroups = descriptor.oneofs();
      assertObjectEquals([[1, 3], [2, 4]], oneofGroups);
    },

    testLargeFieldNumbers() {
      // Arbitrarily large field numbers that take more than 6 bytes to encode.
      const firstFieldNumber = 131072;   // 1<<17
      const secondFieldNumber = 262144;  // 1<<18
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          skipValues(firstFieldNumber),
          typeValue(FieldType.INT32),  // 131072
          skipValues(secondFieldNumber - firstFieldNumber),
          typeValue(FieldType.INT32),  // 262144
          fieldTypeConstants.END_OF_FIELD_DESCRIPTOR,
          oneofValues([firstFieldNumber, secondFieldNumber])));

      assertTrue('The descriptor should have oneofs', descriptor.hasOneofs());
      const oneofGroups = descriptor.oneofs();
      assertObjectEquals([[firstFieldNumber, secondFieldNumber]], oneofGroups);
    },

    testMaxFieldNumber() {
      const firstFieldNumber = 1;                  // 1
      const secondFieldNumber = MAX_FIELD_NUMBER;  // 2^29-1
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),  // 1
          skipValues(secondFieldNumber - firstFieldNumber),
          typeValue(FieldType.INT32),  // 2^29-1
          fieldTypeConstants.END_OF_FIELD_DESCRIPTOR,
          oneofValues([firstFieldNumber, secondFieldNumber])));

      assertTrue('The descriptor should have oneofs', descriptor.hasOneofs());
      const oneofGroups = descriptor.oneofs();
      assertObjectEquals([[firstFieldNumber, secondFieldNumber]], oneofGroups);
    },

    testBeyondMaxFieldNumber_shouldThrow() {
      const firstFieldNumber = 1;                      // 1
      const secondFieldNumber = MAX_FIELD_NUMBER + 1;  // 2^29
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),  // 1
          skipValues(secondFieldNumber - firstFieldNumber),
          typeValue(FieldType.INT32),  // 2^29
          fieldTypeConstants.END_OF_FIELD_DESCRIPTOR,
          oneofValues([firstFieldNumber, secondFieldNumber])));

      const error = assertThrows(() => descriptor.oneofs());
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was 536870912',
          error.message);
    },

    testNegativeFieldNumber_shouldThrow() {
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          typeValue(FieldType.INT32),  // 1
          fieldTypeConstants.END_OF_FIELD_DESCRIPTOR, oneofValues([1, -1])));

      const error = assertThrows(() => descriptor.oneofs());
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was -1',
          error.message);
    },

    testoneofFirst63Fields() {
      // We test 63 fields to exhaust all possible base92 values that can
      // represent a field number (6 bits). We skip zero since that's not a
      // valid field number.
      const fieldNumbers = Array.from(Array(63).keys()).map(i => i + 1);
      const descriptor = DescriptorImpl.fromEncodedString(encodeValues(
          ...fieldNumbers.map(() => typeValue(FieldType.INT32)),
          fieldTypeConstants.END_OF_FIELD_DESCRIPTOR,
          oneofValues(fieldNumbers)));

      assertObjectEquals(
          'There should be a single oneof group with field 1-63',
          [fieldNumbers], descriptor.oneofs());
    },
  },

  testMessageId: {
    testWhenMissing_ShouldReturnNull() {
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
      });

      assertNull('messageId should be null', descriptor.messageId());
    },

    testWhenPresent_ShouldReturnMessageId() {
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
        messageId: 'foo',
      });

      assertEquals('foo', descriptor.messageId());
    },
  },

  testIsMessageSet: {
    testWhenNotSet_ShouldReturnFalse() {
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
      });

      assertFalse('isMessageSet should be false', descriptor.isMessageSet());
    },

    testWhenSet_ShouldReturnTrue() {
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
        isMessageSet: true,
      });

      assertTrue('isMessageSet should be true', descriptor.isMessageSet());
    },
  },

  testIsExtendable: {
    testWhenNotExtendable_ReturnsFalse() {
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
      });

      assertFalse('IsExtendable should be false', descriptor.isExtendable());
    },

    testWhenExtendable_ReturnsTrue() {
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
        extensionRegistry: {},
      });

      assertTrue('IsExtendable should be true', descriptor.isExtendable());
    },
  },

  testRegisterExtension: {
    testShouldRegisterProvidedField() {
      const extensionRegistry = {};
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
        extensionRegistry,
      });

      registerExtension(
          extensionRegistry, 1, encodeValues(typeValue(FieldType.STRING)));

      const field = getOnlyField(descriptor);
      assertTrue('Field 1 should be denoted as an extension', field.extension);
      assertEquals(
          'Extension field 1 should be of type string', FieldType.STRING,
          field.fieldType);
    },

    testWithSubmessageDescriptor_ShouldRegisterFieldWithSubmessageDescriptor() {
      const extensionRegistry = {};
      const submessageDescriptor = emptyDescriptor();
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
        extensionRegistry,
      });

      registerExtension(
          extensionRegistry, 1, encodeValues(typeValue(FieldType.MESSAGE)),
          () => submessageDescriptor);

      const field = getOnlyField(descriptor);
      assertEquals(
          'Extension field 1 should be of type message', FieldType.MESSAGE,
          field.fieldType);
      assertEquals(
          'Extension field 1 should have the submessage descriptor we provided',
          submessageDescriptor, field.submessageDescriptorProvider());
    },

    testRegisterMultipleFields() {
      const extensionRegistry = {};
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
        extensionRegistry,
      });

      registerExtension(
          extensionRegistry, 1, encodeValues(typeValue(FieldType.STRING)));
      registerExtension(
          extensionRegistry, 100, encodeValues(typeValue(FieldType.INT32)));
      registerExtension(
          extensionRegistry, 50, encodeValues(typeValue(FieldType.DOUBLE)));

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
      const descriptor = DescriptorImpl.fromArgs({
        encodedDescriptor: '',
        extensionRegistry,
      });

      registerExtension(
          extensionRegistry, MAX_FIELD_NUMBER,
          encodeValues(typeValue(FieldType.STRING)));

      const field = getOnlyField(descriptor, MAX_FIELD_NUMBER);
      assertTrue(
          `Field ${MAX_FIELD_NUMBER} should be an extension`, field.extension);
    },

    testRegisterBeyondMaxFieldNumber_shouldThrow() {
      const extensionRegistry = {};
      const fieldNumber = 536870912;  // 2^29

      const error = assertThrows(() => {
        registerExtension(
            extensionRegistry, fieldNumber,
            encodeValues(typeValue(FieldType.STRING)));
      });
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was 536870912',
          error.message);
    },

    testRegisterFieldNumberZero_shouldThrow() {
      const extensionRegistry = {};

      const error = assertThrows(() => {
        registerExtension(
            extensionRegistry, 0, encodeValues(typeValue(FieldType.STRING)));
      });
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was 0',
          error.message);
    },

    testRegisterNegativeFieldNumber_shouldThrow() {
      const extensionRegistry = {};

      const error = assertThrows(() => {
        registerExtension(
            extensionRegistry, -1, encodeValues(typeValue(FieldType.STRING)));
      });
      assertEquals(
          'Malformed descriptor; Field numbers should be <= 536870911 and >= 1, but was -1',
          error.message);
    },
  },
});
