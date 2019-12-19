// Copyright 2019 Google LLC
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

/**
 * @fileoverview Defines a equality function for protos, useful for assertions
 * in js unit tests.
 */
goog.module('proto.im.proto_asserts');

const {raiseException} = goog.require('goog.testing.asserts');

/**
 * @param {*} expected
 * @param {*} actual
 */
function assertEqualsForProto(expected, actual) {
  if (Object.is(expected, actual)) {
    return;
  }

  if (typeof expected === 'object' && typeof actual === 'object' &&
      objectEquals(expected, actual)) {
    return;
  }

  raise(expected, actual);
}

/**
 * @param {*} expected
 * @param {*} actual
 * @return {boolean}
 */
function objectEquals(expected, actual) {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length != actual.length) {
      raiseException('Array length do not match');
    }
    for (let i = 0; i < expected.length; i++) {
      assertEqualsForProto(expected[i], actual[i]);
    }
    return true;
  }

  // equals method
  if (typeof expected.equals == 'function') {
    return expected.equals(actual);
  }

  return false;
}

/**
 * @param {*} expected
 * @param {*} actual
 */
function raise(expected, actual) {
  raiseException(`Expected ${expected} <${typeof expected}>  but got ${
      actual} <${typeof actual}>`);
}

exports.assertEqualsForProto = assertEqualsForProto;
