/**
 * @fileoverview A list representation for repeated fields of protos.
 */
goog.module('proto.im.ListView');
const {checkIndex, isCheckIndex} = goog.require('proto.im.internal.internalChecks');

/**
 * A readonly view of repeated fields.
 * @interface
 * @template T
 * @extends Iterable<T>
 */
class ListView {
  /**
   * Returns a copy of an array as a ListView.
   * @param {!Array<T>} array
   * @return {!ListView<T>}
   * @template T
   */
  static copyOf(array) {
    return new ArrayListView(array);
  }

  /**
   * Returns an iterator for a given ListView.
   * @param {!ListView<T>} listView
   * @return {!Iterator<T>}
   * @template T
   */
  static toIterator(listView) {
    const lastIndex = listView.size() - 1;
    let currentIndex = -1;
    return /** @type {!Iterator<T>}*/ ({
      next: () => {
        currentIndex++;

        if (isCheckIndex() && lastIndex != listView.size() - 1) {
          throw new Error('Underlying data changed during iteration');
        }

        const done = currentIndex > lastIndex;
        const value = done ? null : listView.get(currentIndex);
        return {value: value, done: done};
      }
    });
  }

  /**
   * Returns the value at a given index.
   * @param {number} index
   * @return {T}
   */
  get(index) {}

  /**
   * Returns the size of the list.
   * @return {number}
   */
  size() {}

  /**
   * Returns a new array containing the items of the list.
   * @return {!Array<T>}
   */
  toArray() {};
}

// Not all browsers have support for Symbols and thus we add the method
// conditionally
if (!!goog.global.Symbol && !!goog.global.Symbol.iterator) {
  /**
   * @return {!Iterator<T>}
   */
  ListView.prototype[Symbol.iterator] = () => {};
}

/**
 * @template T
 * @implements {ListView<T>}
 */
class ArrayListView {
  /**
   * @param {!Array<T>} array
   */
  constructor(array) {
    /** @private {!Array<T>} */
    this.array_ = array.slice();
  }

  /**
   * @override
   * @param {number} index
   * @return {T}
   */
  get(index) {
    checkIndex(index, this.size());
    return this.array_[index];
  }

  /**
   * @override
   * @return {number}
   */
  size() {
    return this.array_.length;
  }

  /**
   * @override
   * @return {!Array<T>}
   */
  toArray() {
    return this.array_.slice();
  }

  /**
   * @return {!Iterator<T>}
   */
  [Symbol.iterator]() {
    return ListView.toIterator(this);
  }
}

exports = ListView;
