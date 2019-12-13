goog.module('proto.im.ListViewFactoryTest');
goog.setTestOnly();

const ByteString = goog.require('proto.im.ByteString');
const ListView = goog.require('proto.im.ListView');
const testSuite = goog.require('goog.testing.testSuite');


class ListViewFactoryTest {
  testPrimitive() {
    const array = [true, false];
    const listView = ListView.copyOf(array);
    assertEquals(2, listView.size());
    assertArrayEquals([true, false], listView.toArray());

    // modification
    array[0] = false;
    assertEquals(2, listView.size());
    assertArrayEquals([true, false], listView.toArray());

    assertThrows(
        'null',
        () => ListView.copyOf(
            /** @type{!Array<boolean>} */ (/** @type {*} */ (null))));
  }

  testObject() {
    const array = [ByteString.copyFrom([1]), ByteString.copyFrom([2])];
    const listView = ListView.copyOf(array);
    assertEquals(2, listView.size());
    assertArrayEquals(
        [ByteString.copyFrom([1]), ByteString.copyFrom([2])],
        listView.toArray());

    // modification
    array[0] = ByteString.copyFrom([3]);
    assertEquals(2, listView.size());
    assertArrayEquals(
        [ByteString.copyFrom([1]), ByteString.copyFrom([2])],
        listView.toArray());

    assertThrows(
        'null',
        () => ListView.copyOf(
            /** @type{!Array<!ByteString>} */ (/** @type {*} */ (null))));
  }

  testIterator() {
    const array = [1, 2, 3, 4];
    const listView = ListView.copyOf(array);
    const iterator = listView[Symbol.iterator]();

    for (const value of array) {
      const entry = iterator.next();
      assertFalse(entry.done);
      assertEquals(value, entry.value);
    }
    assertTrue(iterator.next().done);
  }

  testForLoop() {
    const array = [1, 2, 3, 4];
    const listView = ListView.copyOf(array);

    const otherArray = [];

    for (const value of listView) {
      otherArray.push(value);
    }

    assertArrayEquals(array, otherArray);
  }
}

testSuite(new ListViewFactoryTest());
