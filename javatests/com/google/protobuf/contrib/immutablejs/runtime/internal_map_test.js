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

goog.module('proto.im.InternalMapTest');
goog.setTestOnly();

const FieldAccessor = goog.require('proto.im.internal.FieldAccessor');
const InternalMap = goog.require('proto.im.internal.InternalMap');
const Long = goog.require('goog.math.Long');
const testSuite = goog.require('goog.testing.testSuite');

class InternalMapTest {
  testHas() {
    const mapEntries =
        [['firstKey', 'firstValue'], ['secondKey', 'secondValue']];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertTrue(map.has('firstKey'));
    assertTrue(map.has('secondKey'));
    assertFalse(map.has('other'));
  }

  testGet() {
    const mapEntries =
        [['firstKey', 'firstValue'], ['secondKey', 'secondValue']];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertEquals('firstValue', map.get('firstKey'));
    assertEquals('secondValue', map.get('secondKey'));
    assertUndefined(map.get('other'));
  }

  testGet_withDuplicatedKey_lastOccuranceReturned() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertEquals('duplicateValue', map.get('firstKey'));
  }

  testSize() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertEquals(2, map.size());
  }

  testSize_withDuplicateKeys_duplicatesNotCounted() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertEquals(2, map.size());
  }

  testKeys() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(['firstKey', 'secondKey'], [...map.keys()]);
  }

  testKeys_withDuplicates_duplicatesAreOmitted() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(['firstKey', 'secondKey'], [...map.keys()]);
  }

  testValues() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(['firstValue', 'secondValue'], [...map.values()]);
  }

  testValues_withDuplicates_duplicatesAreOmitted() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(['duplicateValue', 'secondValue'], [...map.values()]);
  }

  testEntries() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(
        [['firstKey', 'firstValue'], ['secondKey', 'secondValue']],
        [...map.entries()]);
  }

  testEntries_withDuplicates_duplicatesAreOmitted() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(
        [['firstKey', 'duplicateValue'], ['secondKey', 'secondValue']],
        [...map.entries()]);
  }

  testToMap() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(
        [['firstKey', 'firstValue'], ['secondKey', 'secondValue']],
        [...map.toMap().entries()]);
  }

  testToMap_withDuplicates_duplicatesAreOmitted() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertArrayEquals(
        [['firstKey', 'duplicateValue'], ['secondKey', 'secondValue']],
        [...map.toMap().entries()]);
  }

  testForEach() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    let i = 0;
    map.forEach((value, key, innerMapView) => {
      assertEquals(mapEntries[i][0], key);
      assertEquals(mapEntries[i][1], value);
      assertEquals(map, innerMapView);
      i++;
    });

    assertEquals(2, i);
  }

  testForEach_withDuplicates_duplicatesAreOmitted() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    const expectedEntries = [
      ['firstKey', 'duplicateValue'],
      ['secondKey', 'secondValue'],
    ];
    let i = 0;
    map.forEach((value, key, innerMapView) => {
      assertEquals(expectedEntries[i][0], key);
      assertEquals(expectedEntries[i][1], value);
      assertEquals(map, innerMapView);
      i++;
    });

    assertEquals(2, i);
  }

  testIterator() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    const iterator = map[Symbol.iterator]();

    let element = iterator.next();
    assertArrayEquals(['firstKey', 'firstValue'], element.value);
    assertFalse(element.done);

    element = iterator.next();
    assertArrayEquals(['secondKey', 'secondValue'], element.value);
    assertFalse(element.done);

    element = iterator.next();
    assertTrue(element.done);
  }

  testIterator_withDuplicates_duplicatesAreOmitted() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    const iterator = map[Symbol.iterator]();

    let element = iterator.next();
    assertArrayEquals(['firstKey', 'duplicateValue'], element.value);
    assertFalse(element.done);

    element = iterator.next();
    assertArrayEquals(['secondKey', 'secondValue'], element.value);
    assertFalse(element.done);

    element = iterator.next();
    assertTrue(element.done);
  }

  testSet_keyAlreadyPresent_isUpdated() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    map.set('secondKey', 'newValue');

    assertArrayEquals(
        [['firstKey', 'firstValue'], ['secondKey', 'newValue']], mapEntries);
    assertEquals('newValue', map.get('secondKey'));
    assertEquals(2, map.size());
  }

  testSet_keyNotPresent_isAdded() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    map.set('thirdKey', 'newValue');

    assertArrayEquals(
        [
          ['firstKey', 'firstValue'],
          ['secondKey', 'secondValue'],
          ['thirdKey', 'newValue'],
        ],
        mapEntries);
    assertEquals('newValue', map.get('thirdKey'));
    assertEquals(3, map.size());
  }

  testSet_withRelatedDuplicateKey_removesDuplicatesAndUpdates() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    map.set('firstKey', 'newValue');

    assertArrayEquals(
        [
          ['firstKey', 'newValue'],
          ['secondKey', 'secondValue'],
        ],
        mapEntries);
    assertEquals('newValue', map.get('firstKey'));
    assertEquals(2, map.size());
  }

  testSet_withUnrelatedDuplicateKey_removesDuplicatesAndUpdates() {
    const mapEntries = [
      ['secondKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['firstKey', 'duplicateValue'],
    ];
    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    map.set('firstKey', 'newValue');

    assertArrayEquals(
        [
          ['secondKey', 'secondValue'],
          ['firstKey', 'newValue'],
        ],
        mapEntries);
    assertEquals('newValue', map.get('firstKey'));
    assertEquals(2, map.size());
  }

  testRemove_withoutDuplicates_elementRemoved() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['thirdKey', 'thirdValue'],
    ];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    map.remove('firstKey');

    assertArrayEquals(
        [['thirdKey', 'thirdValue'], ['secondKey', 'secondValue']], mapEntries);
    assertUndefined(map.get('firstKey'));
    assertEquals(2, map.size());
  }

  testRemove_withUnrelatedDuplicates_elementAndDuplicatesRemoved() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['secondKey', 'duplicateValue'],
    ];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    map.remove('firstKey');

    assertArrayEquals([['secondKey', 'duplicateValue']], mapEntries);
    assertUndefined(map.get('firstKey'));
    assertEquals(1, map.size());
  }

  testRemove_withRelatedDuplicates_allOccurancesRemoved() {
    const mapEntries = [
      ['firstKey', 'firstValue'],
      ['secondKey', 'secondValue'],
      ['secondKey', 'duplicateValue'],
      ['thirdKey', 'thirdValue'],
    ];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    map.remove('secondKey');

    assertArrayEquals(
        [['firstKey', 'firstValue'], ['thirdKey', 'thirdValue']], mapEntries);
    assertUndefined(map.get('secondKey'));
    assertEquals(2, map.size());
  }

  testCreate_withStringKeySerializer() {
    const mapEntries = [['firstKey', 'firstValue']];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getString, FieldAccessor.setString,
        FieldAccessor.getString, FieldAccessor.setString);

    assertTrue(map.has('firstKey'));
  }

  testCreate_withIntKeySerializer() {
    const mapEntries = [[1234, 'firstValue']];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getInt, FieldAccessor.setInt,
        FieldAccessor.getString, FieldAccessor.setString);

    assertTrue(map.has(1234));
  }

  testCreate_withBoolKeySerializer() {
    const mapEntries = [[1, 'firstValue']];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getBoolean, FieldAccessor.setBoolean,
        FieldAccessor.getString, FieldAccessor.setString);

    assertTrue(map.has(true));
  }

  testCreate_withInt52KeySerializer() {
    const mapEntries = [[1234, 'firstValue']];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getInt52Long, FieldAccessor.setInt52Long,
        FieldAccessor.getString, FieldAccessor.setString);

    assertTrue(map.has(Long.fromNumber(1234)));
  }

  testMalformedMap_withEquivalentLongKeys_areConsideredTheSame() {
    const mapEntries = [[1234, 'firstValue'], ['1234', 'secondValue']];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getInt52Long, FieldAccessor.setInt52Long,
        FieldAccessor.getString, FieldAccessor.setString);

    assertEquals(1, map.size());
    assertEquals('secondValue', map.get(Long.fromNumber(1234)));
  }

  testMalformedMap_withEquivalenBooleanKeys_areConsideredTheSame() {
    const mapEntries = [[true, 'firstValue'], [1, 'secondValue']];

    const map = new InternalMap(
        mapEntries, FieldAccessor.getBoolean, FieldAccessor.setBoolean,
        FieldAccessor.getString, FieldAccessor.setString);

    assertEquals(1, map.size());
    assertEquals('secondValue', map.get(true));
  }
}

testSuite(new InternalMapTest());
