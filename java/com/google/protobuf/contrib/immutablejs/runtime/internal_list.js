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

goog.module('proto.im.internal.InternalList');

const InternalMutableListView = goog.require('proto.im.internal.InternalMutableListView');
const ListView = goog.require('proto.im.ListView');
const {assertExists} = goog.require('goog.asserts');
const {checkIndex} = goog.require('proto.im.internal.internalChecks');

/**
 * @final
 * @implements {InternalMutableListView<T>}
 * @template T
 */
class InternalList {
  /**
   * @param {!Array<*>} jsonArray
   */
  constructor(jsonArray) {
    /** @private @const {!Array<*>} */
    this.jsonArray_ = jsonArray;

    /** @private {(function(!Object<number, *>, number): T)|undefined} */
    this.accessorFn_;

    /** @private {(function(!Object<number, *>, number, T))|undefined} */
    this.setterFn_;
  }

  /**
   * @param {function(!Object<number, *>, number): T} accessorFn
   */
  setAccessor(accessorFn) {
    this.accessorFn_ = accessorFn;
  }

  /**
   * @param {function(!Object<number, *>, number, T)} setterFn
   */
  setSetter(setterFn) {
    this.setterFn_ = setterFn;
  }

  /** @override */
  get(index) {
    checkIndex(index, this.size());
    const withinRange = index >= 0 && index < this.size();
    const accessorFn = assertExists(
        this.accessorFn_,
        'accessorFn must be set before values can be retrieved. ' +
            'Are you missing a call to setAccessor?');
    return withinRange ? accessorFn(this.jsonArray_, index) : undefined;
  }

  /** @override */
  set(index, value) {
    checkIndex(index, this.size());
    const setterFn = assertExists(
        this.setterFn_,
        'setterFn must be set before values can be retrieved. ' +
            'Are you missing a call to setSetter?');
    setterFn(this.jsonArray_, index, value);
  }

  /** @override */
  setIterable(values) {
    const setterFn = assertExists(
        this.setterFn_,
        'setterFn must be set before values can be retrieved. ' +
            'Are you missing a call to setSetter?');
    this.jsonArray_.length = 0;
    for (const value of values) {
      setterFn(this.jsonArray_, this.size(), value);
    }
  }

  /** @override */
  add(value) {
    const setterFn = assertExists(
        this.setterFn_,
        'setterFn must be set before values can be retrieved. ' +
            'Are you missing a call to setSetter?');
    setterFn(this.jsonArray_, this.size(), value);
  }

  /** @override */
  size() {
    return this.jsonArray_.length;
  }

  /** @override */
  toArray() {
    let newArray = new Array(this.size());
    for (let i = 0; i < newArray.length; i++) {
      newArray[i] = this.get(i);
    }
    return newArray;
  }

  /** @override */
  [Symbol.iterator]() {
    return ListView.toIterator(this);
  }
}

exports = InternalList;
