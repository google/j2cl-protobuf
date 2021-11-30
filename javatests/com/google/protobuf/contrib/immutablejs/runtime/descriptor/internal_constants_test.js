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

goog.module('proto.im.internal.constantsTest');

const testSuite = goog.require('goog.testing.testSuite');
const {fieldTypeConstants} = goog.require('proto.im.internal.constants');

testSuite({
  testFieldTypeConstants_areValidBase92() {
    for (const [key, value] of Object.entries(fieldTypeConstants)) {
      assertTrue(
          `fieldTypeConstants.${key} is not in Base92 value range.`,
          value >= 0 && value < 92);
    }
  },
});