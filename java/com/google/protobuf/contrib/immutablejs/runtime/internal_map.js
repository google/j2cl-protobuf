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
goog.module('proto.im.internal.InternalMap');

const InternalMutableMapView = goog.require('proto.im.internal.InternalMutableMapView');
const {checkIndex, checkTypeArray, checkTypeMapEntry, checkTypeMapKey, checkTypeNumber} = goog.require('proto.im.internal.internalChecks');

/**
 * Provides a mutable Map wrapper around map field data.
 * @final
 * @template KEY, VALUE
 * @implements {InternalMutableMapView<KEY, VALUE>}
 */
class InternalMap {
  /**
   * @param {!Object<number, *>} jsonArray
   * @param {function(!Object<number, *>, number): KEY} keyAccessorFn
   * @param {function(!Object<number, *>, number, KEY): void} keySetterFn
   * @param {function(!Object<number, *>, number): VALUE} valueAccessorFn
   * @param {function(!Object<number, *>, number, VALUE): void} valueSetterFn
   */
  constructor(
      jsonArray, keyAccessorFn, keySetterFn, valueAccessorFn, valueSetterFn) {
    /** @private @const {!Map<(string|number|boolean), number>} */
    this.indexMap_ = new Map();

    /** @private @const {!Array<*>} */
    this.jsonArray_ = checkTypeArray(jsonArray);

    /** @private @const {function(!Array<*>): KEY} */
    this.keyAccessorFn_ = (mapEntry) => keyAccessorFn(mapEntry, KEY_INDEX);

    /** @private @const {function(!Array<*>, KEY)} */
    this.keySetterFn_ = (mapEntry, key) =>
        keySetterFn(mapEntry, KEY_INDEX, key);

    /** @private @const {function(!Array<*>): VALUE} */
    this.valueAccessorFn_ = (mapEntry) =>
        valueAccessorFn(mapEntry, VALUE_INDEX);

    /** @private @const {function(!Array<*>, VALUE)} */
    this.valueSetterFn_ = (mapEntry, value) =>
        valueSetterFn(mapEntry, VALUE_INDEX, value);

    this.initialIndex_();
  }

  /** @private */
  initialIndex_() {
    for (let i = 0; i < this.jsonArray_.length; i++) {
      // Deserialize the key and then reserialize to normalize it as there are
      // multiple but equivalent ways to serialize some types. For example,
      // booleans could be true/false or 0/1 and integrals could be numbers or
      // strings.
      const deserializedKey = this.keyAccessorFn_(this.getMapEntryByIndex_(i));
      this.indexMap_.set(this.toCacheKey_(deserializedKey), i);
    }
  }

  /** @override */
  get(key) {
    const entry = this.getMapEntryByKey_(key);
    if (entry === undefined) {
      return undefined;
    }
    return this.valueAccessorFn_(entry);
  }

  /** @override */
  set(key, value) {
    if (this.isMalformed_()) {
      this.fixMalformedMap_();
    }

    let entry = this.getMapEntryByKey_(key);
    if (entry === undefined) {
      entry = [];
      this.jsonArray_.push(entry);
      this.indexMap_.set(this.toCacheKey_(key), this.jsonArray_.length - 1);
    }
    this.keySetterFn_(entry, key);
    this.valueSetterFn_(entry, value);
  }

  /** @override */
  remove(key) {
    if (this.isMalformed_()) {
      this.fixMalformedMap_();
    }

    const cacheKey = this.toCacheKey_(key);
    if (!this.indexMap_.has(cacheKey)) {
      return;
    }

    const index = this.indexMap_.get(cacheKey);
    this.indexMap_.delete(cacheKey);

    // If it's the last entry we can just pop it off the end.
    if (index == this.jsonArray_.length - 1) {
      this.jsonArray_.pop();
      return;
    }

    // Since there are no duplicates in this map we can mutate the order. To
    // remove this entry we can simply swap the last entry into the place
    // of the one want want to delete.
    const lastEntry = checkTypeMapEntry(this.jsonArray_.pop());
    this.jsonArray_[index] = lastEntry;

    // Update the index map with the updated position.
    this.indexMap_.set(checkTypeMapKey(lastEntry[KEY_INDEX]), index);
  }

  /** @override */
  has(key) {
    return this.indexMap_.has(this.toCacheKey_(key));
  }

  /** @override */
  size() {
    return this.indexMap_.size;
  }

  /** @override */
  forEach(callback, thisArg = undefined) {
    for (const [key, value] of this.entries()) {
      callback.call(thisArg, value, key, this);
    }
  }

  /** @override */
  toMap() {
    return new Map(this);
  }

  /** @override */
  keys() {
    // Loop over the index map instead of the underlying array to ensure we
    // don't return duplicates.
    return new TransformingIteratorIterable(
        this.indexMap_.values(),
        (index) => this.keyAccessorFn_(this.getMapEntryByIndex_(index)));
  }

  /** @override */
  values() {
    // Loop over the index map instead of the underlying array to ensure we
    // don't return duplicates.
    return new TransformingIteratorIterable(
        this.indexMap_.values(),
        (index) => this.valueAccessorFn_(this.getMapEntryByIndex_(index)));
  }

  /** @override */
  entries() {
    // Loop over the index map instead of the underlying array to ensure we
    // don't return duplicates.
    return new TransformingIteratorIterable(
        this.indexMap_.values(), (index) => {
          const entry = this.getMapEntryByIndex_(index);
          const key = this.keyAccessorFn_(entry);
          const value = this.valueAccessorFn_(entry);
          return [key, value];
        });
  }

  /** @override */
  [Symbol.iterator]() {
    return this.entries();
  }

  /**
   * @param {number} index
   * @return {!Array<*>}
   * @private
   */
  getMapEntryByIndex_(index) {
    checkIndex(index, this.jsonArray_.length);
    return checkTypeMapEntry(this.jsonArray_[index]);
  }

  /**
   * @param {KEY} key
   * @return {!Array<*>|undefined}
   * @private
   */
  getMapEntryByKey_(key) {
    const cacheKey = this.toCacheKey_(key);
    const index = this.indexMap_.get(cacheKey);
    if (index === undefined) {
      return undefined;
    }
    return this.getMapEntryByIndex_(index);
  }

  /**
   * Transforms the supplied key to one suitable for storage as a key in Map.
   *
   * In particular, this is useful for where the KEY type is not a primitve,
   * for example in the case of Longs. If we instead just directly put the key
   * in the map we'd have to rely on instance equality, which would be
   * unexpected in the case of Longs.
   *
   * @param {KEY} key
   * @return {string|number|boolean}
   * @private
   */
  toCacheKey_(key) {
    // Reuse the keySetterFn to serialize the key into a temporary array that we
    // can read back out. This ensures that the key we use in the map is
    // consistent with the key that would be in the resulting JSPB payload.
    this.keySetterFn_(CACHE_KEY_TMP, key);
    return checkTypeMapKey(CACHE_KEY_TMP[KEY_INDEX]);
  }

  /**
   * Returns whether the map is "malformed", that is, duplicate keys exist in
   * the underlying data.
   *
   * @return {boolean}
   * @private
   */
  isMalformed_() {
    return this.size() != this.jsonArray_.length;
  }

  /**
   * Rewrites the underlying data by removing duplicate keys.
   *
   * @private
   */
  fixMalformedMap_() {
    // Splice out the old data rather than replacing it entirely. This avoids
    // wiping out caching that the kernel may have stubbed on.
    const originalData = this.jsonArray_.splice(0, this.jsonArray_.length);
    for (const [key, index] of this.indexMap_.entries()) {
      this.jsonArray_.push(
          checkTypeMapEntry(originalData[checkTypeNumber(index)]));
      this.indexMap_.set(key, this.jsonArray_.length - 1);
    }
  }
}

/**
 * @implements {IteratorIterable<V>}
 * @final
 * @template T, V
 */
class TransformingIteratorIterable {
  /**
   * @param {!Iterator<T>} iterator
   * @param {function(T): V} transformer
   */
  constructor(iterator, transformer) {
    /** @private @const {!Iterator<T>} */
    this.iterator_ = iterator;

    /** @private @const {function(T):V} */
    this.transformer_ = transformer;
  }

  /** @override */
  next() {
    const element = this.iterator_.next();
    if (element.done) {
      return element;
    }
    return {
      done: element.done,
      value: this.transformer_(element.value),
    };
  }

  /** @override */
  [Symbol.iterator]() {
    return this;
  }
}

/** @const {number} */
const KEY_INDEX = 0;

/** @const {number} */
const VALUE_INDEX = 1;

/** @const {!Array<*>} */
const CACHE_KEY_TMP = [];

exports = InternalMap;
