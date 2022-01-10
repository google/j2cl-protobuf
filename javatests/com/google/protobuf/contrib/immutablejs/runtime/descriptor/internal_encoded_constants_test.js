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

goog.module('proto.im.descriptor.internal_encodedConstantsTest');

const testSuite = goog.require('goog.testing.testSuite');
const {encodeValues} = goog.require('proto.im.descriptor.testing.descriptors');
const {fieldTypeConstants: encodedFieldTypeConstants} = goog.require('proto.im.descriptor.internal_encodedConstants');
const {fieldTypeConstants} = goog.require('proto.im.descriptor.internal_constants');

testSuite({
  testEncodedFieldTypeConstants_correlateToFieldTypeContants() {
    for (const key of Object.keys(encodedFieldTypeConstants)) {
      assertEquals(
          `Encoded fieldTypeConstants.${
              key} should correlate to fieldTypeConstants.${key}`,
          encodeValues(fieldTypeConstants[key]),
          encodedFieldTypeConstants[key]);
    }
  },

  testEncodedFieldTypeConstants_isSubsetOfFieldTypeConstants() {
    for (const key of Object.keys(encodedFieldTypeConstants)) {
      assertNotUndefined(
          `Encoded ${key} exists but fieldTypeConstants.${key} does not`,
          fieldTypeConstants[key]);
    }
  },
});
