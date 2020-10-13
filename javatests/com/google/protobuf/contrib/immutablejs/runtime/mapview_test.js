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

goog.module('proto.im.MapViewTest');
goog.setTestOnly();

const MapView = goog.require('proto.im.MapView');
const testSuite = goog.require('goog.testing.testSuite');

class MapViewTest {
  testUnmodifiableView_get() {
    const mapView = MapView.copyOf(new Map([['foo', 'bar']]));

    assertEquals('bar', mapView.get('foo'));
    assertUndefined(mapView.get('buzz'));
  }

  testUnmodifiableView_has() {
    const mapView = MapView.copyOf(new Map([['foo', 'bar']]));

    assertTrue(mapView.has('foo'));
    assertFalse(mapView.has('buzz'));
  }

  testUnmodifiableView_size() {
    const mapView = MapView.copyOf(new Map([['foo', 'bar']]));

    assertEquals(1, mapView.size());
  }

  testUnmodifiableView_keys() {
    const mapView = MapView.copyOf(new Map([['foo', 'bar']]));
    assertArrayEquals(['foo'], [...mapView.keys()]);
  }

  testUnmodifiableView_values() {
    const mapView = MapView.copyOf(new Map([['foo', 'bar']]));
    assertArrayEquals(['bar'], [...mapView.values()]);
  }

  testUnmodifiableView_entries() {
    const mapView = MapView.copyOf(new Map([['foo', 'bar']]));
    const entries = [...mapView.entries()];

    assertEquals(1, entries.length);
    assertArrayEquals(['foo', 'bar'], entries[0]);
  }

  testUnmodifiableView_forEach() {
    const entries = [['firstKey', 'firstValue'], ['secondKey', 'secondValue']];
    const mapView = MapView.copyOf(new Map(entries));

    let i = 0;
    mapView.forEach((value, key, innerMapView) => {
      assertEquals(entries[i][0], key);
      assertEquals(entries[i][1], value);
      assertEquals(mapView, innerMapView);
      i++;
    });

    assertEquals(2, i);
  }

  testUnmodifiableView_toMap() {
    const entries = [['firstKey', 'firstValue'], ['secondKey', 'secondValue']];
    const mapView = MapView.copyOf(new Map(entries));

    const map = mapView.toMap();

    assertEquals(2, map.size);
    assertEquals('firstValue', map.get('firstKey'));
    assertEquals('secondValue', map.get('secondKey'));
  }

  testUnmodifiableView_iterator() {
    const entries = [['firstKey', 'firstValue'], ['secondKey', 'secondValue']];
    const mapView = MapView.copyOf(new Map(entries));

    const iterator = mapView[Symbol.iterator]();

    let element = iterator.next();
    assertArrayEquals(['firstKey', 'firstValue'], element.value);
    assertFalse(element.done);

    element = iterator.next();
    assertArrayEquals(['secondKey', 'secondValue'], element.value);
    assertFalse(element.done);

    assertTrue(iterator.next().done);
  }
}

testSuite(new MapViewTest());
