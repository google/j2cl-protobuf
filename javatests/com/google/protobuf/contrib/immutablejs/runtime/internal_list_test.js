// Copyright 2020 Google LLC
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

goog.module('proto.im.internal.InternalListTest');
goog.setTestOnly();

const FieldAccessor = goog.require('proto.im.internal.FieldAccessor');
const InternalList = goog.require('proto.im.internal.InternalList');
const testSuite = goog.require('goog.testing.testSuite');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');

class InternalListTest {
  testSize() {
    assertEquals(0, (new InternalList([])).size());
    assertEquals(3, (new InternalList(['a', 'b', 'c'])).size());
  }

  testGet_withoutAccessorFn_throws() {
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);
    assertThrows(() => list.get(0));
    assertThrows(() => list.get(1));
    assertThrows(() => list.get(2));
  }

  testGet_withAccessorFn_returnsValue() {
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);
    list.setAccessor(FieldAccessor.getString);
    assertEquals('a', list.get(0));
    assertEquals('b', list.get(1));
    assertEquals('c', list.get(2));
  }

  testGet_outOfBounds_withCheckIndexEnabled_throws() {
    if (!isCheckIndex()) {
      return;
    }
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);
    list.setAccessor(FieldAccessor.getString);
    assertThrows(() => list.get(-1));
    assertThrows(() => list.get(3));
  }

  testGet_outOfBounds_withCheckIndexDisabled_returnsUndefined() {
    if (isCheckIndex()) {
      return;
    }
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);
    list.setAccessor(FieldAccessor.getString);
    assertUndefined(list.get(-1));
    assertUndefined(list.get(3));
  }

  testSet() {
    const underlyingArray = ['a', 'b', 'c'];
    const /** !InternalList<string> */ list = new InternalList(underlyingArray);
    list.set(1, 'd', FieldAccessor.setString);

    assertArrayEquals(['a', 'd', 'c'], underlyingArray);
  }

  testSet_outOfBounds_withCheckIndexEnabled_throws() {
    if (!isCheckIndex()) {
      return;
    }
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);
    assertThrows(() => list.set(3, 'd', FieldAccessor.setString));
  }

  testSet_outOfBounds_withCheckIndexDisabled_allowsHoles() {
    if (isCheckIndex()) {
      return;
    }
    const underlyingArray = ['a', 'b', 'c'];
    const /** !InternalList<string> */ list = new InternalList(underlyingArray);
    list.set(4, 'd', FieldAccessor.setString);

    assertArrayEquals(['a', 'b', 'c', undefined, 'd'], underlyingArray);
    // Index 3 ends up with an empty string as a result of
    // FieldAccessor.getString coercing the undefined to an empty string. On the
    // wire there would be a null present.
    list.setAccessor(FieldAccessor.getString);
    assertArrayEquals(['a', 'b', 'c', '', 'd'], list.toArray());
  }

  testSetIterable() {
    const underlyingArray = ['a', 'b', 'c'];
    const /** !InternalList<string> */ list = new InternalList(underlyingArray);
    list.setIterable(['d', 'e', 'f'], FieldAccessor.setString);

    assertArrayEquals(['d', 'e', 'f'], underlyingArray);
  }

  testAdd() {
    const underlyingArray = ['a', 'b', 'c'];
    const /** !InternalList<string> */ list = new InternalList(underlyingArray);
    list.add('d', FieldAccessor.setString);
    list.add('e', FieldAccessor.setString);

    assertArrayEquals(['a', 'b', 'c', 'd', 'e'], underlyingArray);
  }

  testToArray_withAccessorFn_returnsCopy() {
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);
    list.setAccessor(FieldAccessor.getString);

    const firstCopy = list.toArray();
    assertArrayEquals(['a', 'b', 'c'], firstCopy);

    list.add('d', FieldAccessor.setString);
    const secondCopy = list.toArray();
    assertArrayEquals(['a', 'b', 'c'], firstCopy);
    assertArrayEquals(['a', 'b', 'c', 'd'], secondCopy);
  }

  testToArray_withoutAccessorFn_throws() {
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);

    assertThrows(() => list.toArray());
  }

  testIterator_withAccessorFn_returnsIterable() {
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);
    list.setAccessor(FieldAccessor.getString);

    const iterator = list[Symbol.iterator]();

    assertEquals('a', iterator.next().value);
    assertEquals('b', iterator.next().value);
    assertEquals('c', iterator.next().value);
    assertTrue(iterator.next().done);
  }

  testIterator_withoutAccessorFn_throws() {
    const /** !InternalList<string> */ list = new InternalList(['a', 'b', 'c']);

    const iterator = list[Symbol.iterator]();

    assertThrows(() => iterator.next());
  }
}

testSuite(new InternalListTest());
