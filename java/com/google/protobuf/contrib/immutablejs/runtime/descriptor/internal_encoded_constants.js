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

goog.module('proto.im.internal.encodedConstants');

/**
 * Pre-encoded Base-92 chars that mark special values or ranges of values for
 * the field type portion of the encoded descriptor.
 *
 * These values should map directly to values in `constants.fieldTypeConstants`,
 * however, not all values need to be included here.
 */
exports.fieldTypeConstants = {
  /** @const {string} */
  END_OF_FIELD_DESCRIPTOR: '^',
};