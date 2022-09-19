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
 * @fileoverview Test for equivalence.js.
 */
goog.module('proto.im.internal.EquivalenceTest');
goog.setTestOnly('proto.im.internal.EquivalenceTest');

const Equivalence = goog.require('proto.im.internal.Equivalence');
const testSuite = goog.require('goog.testing.testSuite');

class EquivalenceTest {
  testSame() {
    const array = [];
    assertTrue(Equivalence.equivalence(array, array));
    const object = {};
    assertFalse(Equivalence.equivalence(object, object));
    const aNumber = 3;
    assertFalse(Equivalence.equivalence(
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aNumber)),
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aNumber))));
    const aBoolean = true;
    assertFalse(Equivalence.equivalence(
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aBoolean)),
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aBoolean))));
    const aString = '';
    assertFalse(Equivalence.equivalence(
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aString)),
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aString))));
  }

  testSimpleField() {
    assertTrue(Equivalence.equivalence(['foo'], ['foo']));
    assertFalse(Equivalence.equivalence(['foo1'], ['foo2']));
  }

  testNumberField() {
    assertTrue(Equivalence.equivalence([1], [1]));
    assertTrue(Equivalence.equivalence([1], ['1']));
    assertTrue(Equivalence.equivalence([-1], ['-1']));
    assertFalse(Equivalence.equivalence([1], [2]));
    assertFalse(Equivalence.equivalence([1], ['2']));
    assertFalse(Equivalence.equivalence([-1], ['1']));
    assertFalse(Equivalence.equivalence([-1], ['-2']));

    // Int52 lossy
    // TODO(b/219749958): False positive. Loss of precision is throwing off the
    //  comparison.
    assertTrue(Equivalence.equivalence(
        [18446744073709552000], ['18446744073709551615']));

    // NaN
    assertTrue(Equivalence.equivalence([NaN], [NaN]));
    assertTrue(Equivalence.equivalence([NaN], ['NaN']));
    assertFalse(Equivalence.equivalence([NaN], [1]));
    assertFalse(Equivalence.equivalence([NaN], ['1']));

    // Infinity
    assertTrue(Equivalence.equivalence([Infinity], [Infinity]));
    assertTrue(Equivalence.equivalence([Infinity], ['Infinity']));
    assertFalse(Equivalence.equivalence([Infinity], [1]));

    // -Infinity
    assertTrue(Equivalence.equivalence([-Infinity], [-Infinity]));
    assertTrue(Equivalence.equivalence([-Infinity], ['-Infinity']));
    assertFalse(Equivalence.equivalence([-Infinity], [1]));
  }

  testBoolField() {
    // Boolean values can be encoded as either true/false literals or a number
    // where only 0 is treated as false.
    assertTrue(Equivalence.equivalence([true], [true]));
    assertTrue(Equivalence.equivalence([true], [1]));
    assertTrue(Equivalence.equivalence([true], ['1']));
    assertTrue(Equivalence.equivalence([true], [2]));
    assertTrue(Equivalence.equivalence([true], [-1]));
    assertTrue(Equivalence.equivalence([false], [false]));
    assertTrue(Equivalence.equivalence([false], [0]));
    assertTrue(Equivalence.equivalence([false], ['0']));

    assertFalse(Equivalence.equivalence([true], [false]));
    assertFalse(Equivalence.equivalence([true], [0]));
    // TODO(b/219749958): False positive. Boolean fields cannot be encoded as
    //  strings.
    assertTrue(Equivalence.equivalence([true], ['true']));

    // Nested messages: normally these would coerce to true/false under JS
    // coercion rules.
    // See: https://dorey.github.io/JavaScript-Equality-Table/
    assertFalse(Equivalence.equivalence([true], [[]]));
    assertFalse(Equivalence.equivalence([false], [[]]));
    assertFalse(Equivalence.equivalence([true], [[0]]));
    assertFalse(Equivalence.equivalence([false], [[0]]));
    assertFalse(Equivalence.equivalence([true], [[1]]));
    assertFalse(Equivalence.equivalence([false], [[1]]));
  }

  testObjectField() {
    assertFalse(Equivalence.equivalence([{}, 'foo'], [{}, 'foo']));
    const sameObject = {};
    assertFalse(
        Equivalence.equivalence([sameObject, 'foo'], [sameObject, 'foo']));
  }

  testNestedMessage() {
    assertTrue(Equivalence.equivalence([['foo']], [['foo']]));
  }

  testFieldsInExtension() {
    assertTrue(
        Equivalence.equivalence(['foo', {10: 'bar'}], ['foo', {10: 'bar'}]));

    assertFalse(
        Equivalence.equivalence(['foo', {10: 'bar'}], ['foo', {10: 'baz'}]));
  }

  testFieldsInOneExtension() {
    assertTrue(Equivalence.equivalence(
        ['foo', null, null, 'bar'], ['foo', {3: 'bar'}]));

    assertFalse(
        Equivalence.equivalence(['foo', null, null, 'bar'], ['foo', {}]));
    assertFalse(Equivalence.equivalence(
        ['foo', null, null, 'bar'], ['foo', {3: 'baz'}]));

    assertTrue(Equivalence.equivalence(
        ['foo', {3: 'bar'}], ['foo', null, null, 'bar']));

    assertFalse(
        Equivalence.equivalence(['foo', {}], ['foo', null, null, 'bar']));
    assertFalse(Equivalence.equivalence(
        ['foo', {3: 'baz'}], ['foo', null, null, 'bar']));
  }

  testMoreFieldsPresentInExtension() {
    assertFalse(Equivalence.equivalence(
        ['foo', null, null, 'bar'], ['foo', {3: 'bar', 4: 'baz'}]));
  }

  testNull() {
    assertTrue(Equivalence.equivalence([null], []));
    assertTrue(Equivalence.equivalence(['foo', null, null], ['foo', null]));
  }
}

testSuite(new EquivalenceTest());
