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

/**
 * @fileoverview A map representation for map fields of protos.
 */
goog.module('proto.im.MapView');

/**
 * @interface
 * @extends {Iterable<!KEY|VALUE>}
 * @template KEY, VALUE
 */
class MapView {
  /** @return {!MapView<?, ?>} */
  static empty() {
    return EMPTY_MAP_VIEW;
  }

  /**
   * @param {!Map<KEY, VALUE>} map
   * @return {!MapView<KEY, VALUE>}
   * @template KEY, VALUE
   */
  static copyOf(map) {
    return new Es6MapView(new Map(map));
  }

  /**
   * @param {KEY} key
   * @return {VALUE|undefined}
   */
  get(key) {}

  /**
   * @param {KEY} key
   * @return {boolean}
   */
  has(key) {}

  /**
   * @return {number}
   */
  size() {}

  /**
   * @return {!IteratorIterable<KEY>}
   */
  keys() {}

  /**
   * @return {!IteratorIterable<VALUE>}
   */
  values() {}

  /**
   * @return {!IteratorIterable<!Array<KEY|VALUE>>}
   */
  entries() {}

  /**
   * @param {function(this:THIS, VALUE, KEY, MAP)} callback
   * @param {THIS=} thisArg
   * @this {MAP}
   * @template MAP,THIS
   */
  forEach(callback, thisArg = undefined) {};

  /**
   * @return {!Map<KEY, VALUE>}
   */
  toMap() {}

  /**
   * @return {!IteratorIterable<!Array<KEY|VALUE>>}
   */
  [Symbol.iterator]() {}
}

/**
 * @final
 * @implements {MapView<KEY, VALUE>}
 * @template KEY, VALUE
 */
class Es6MapView {
  /**
   * @param {!Map<KEY,VALUE>} map
   */
  constructor(map) {
    /** @private @const {!Map<KEY,VALUE>} */
    this.map_ = map;
  }

  /** @override */
  get(key) {
    return this.map_.get(key);
  }

  /** @override */
  has(key) {
    return this.map_.has(key);
  }

  /** @override */
  size() {
    return this.map_.size;
  }

  /** @override */
  keys() {
    return this.map_.keys();
  }

  /** @override */
  values() {
    return this.map_.values();
  }

  /** @override */
  entries() {
    return this.map_.entries();
  }

  /** @override */
  forEach(callback, thisArg = undefined) {
    this.map_.forEach((value, key) => {
      callback.call(thisArg, value, key, this);
    });
  }

  /** @override */
  toMap() {
    return new Map(this.map_);
  }

  /** @override */
  [Symbol.iterator]() {
    return this.map_[Symbol.iterator]();
  }
}

/** @const {!MapView<?,?>} */
const EMPTY_MAP_VIEW = new Es6MapView(new Map());

exports = MapView;
