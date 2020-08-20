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
goog.module('proto.im.JspbKernel');

const ByteString = goog.require('proto.im.ByteString');
const Equivalence = goog.require('proto.im.internal.Equivalence');
const FieldAccessor = goog.require('proto.im.internal.FieldAccessor');
const Hashing = goog.require('proto.im.internal.Hashing');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const internalChecks = goog.require('proto.im.internal.internalChecks');


/** @private @const */
const cachedMsgKey = '$jspb_cached_msg_';

/**
 * @param {!Array} data
 * @return {boolean}
 */
function hasExtensionObject(data) {
  if (data.length > 0) {
    // Look at the data to see if there is a extension object
    const lastObject = data[data.length - 1];
    if (lastObject && typeof lastObject === 'object' &&
        !Array.isArray(lastObject)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {!Array<*>} data
 * @param {number} suggestedPivot
 * @param {number} messageOffset
 * @return {number}
 */
function calculatePivot(data, suggestedPivot, messageOffset) {
  if (hasExtensionObject(data)) {
    // Reuse the existing pivot
    return data.length - 1;
  }

  if (suggestedPivot > 0) {
    return Math.max(suggestedPivot, data.length - messageOffset);
  }

  return Number.MAX_VALUE;
}

/**
 * @param {!Object<number, ?>} data
 */
function cloneRepeatedFields_(data) {
  for (const key in data) {
    const value = data[+key];
    if (Array.isArray(value) && !(cachedMsgKey in value)) {
      // Note that for submessages that are not instantiated, there might not
      // a cached msg (e.g. a parsed Message where getter is not called yet).
      // Those are OK to copy since we don't care about referential equality
      // if the message is not instantiated yet.
      data[+key] = value.slice();
    }
  }
}

/**
 * @final
 */
class JspbKernel {
  /**
   * @param {!Array<*>} data The array holding protobuf data conforming to the
   *     JSPB wireformat.
   * @param {number} suggestedPivot The pivot value after which fields are found
   *     in the extension object.
   * @param {string|number} messageId The apps framework message id.
   * @return {!JspbKernel}
   */
  static create(data, suggestedPivot, messageId) {
    const messageOffset = messageId ? 0 : -1;
    const pivot = calculatePivot(data, suggestedPivot, messageOffset);
    // Assign message id if its not present
    if (messageId && !data[0]) {
      data[0] = messageId;
    }
    return new JspbKernel(data, pivot, messageOffset);
  }

  /**
   * @param {function(new:MESSAGE, !Array<*>)} ctor
   * @param {!Array<?>} data
   * @return {MESSAGE}
   * @template MESSAGE
   */
  static fromArray(ctor, data) {
    const cache = /** @type {!Object} */ (data);
    return cache[cachedMsgKey] || (cache[cachedMsgKey] = new ctor(data));
  }

  /**
   * @param {!Array<*>} data The array holding protobuf data conforming to the
   *     JSPB wireformat.
   * @param {number} pivot The index in the array after which fields are placed
   *     in the extension object.
   * @param {number} messageOffset The apps framework message id.
   * @private
   */
  constructor(data, pivot, messageOffset) {
    /** @private @const {!Array<*>} */
    this.data_ = data;
    /** @private @const {number} */
    this.pivot_ = pivot;
    /** @private @const {number} */
    this.messageOffset_ = messageOffset;

    /** @private */
    this.hash_ = 0;
  }

  /**
   * Returns a shallow copied new message.
   * @param {function(new:MESSAGE, !Array<*>)} ctor
   * @return {MESSAGE}
   * @template MESSAGE
   */
  shallowCopy(ctor) {
    const newData = this.data_.slice();
    // Note that we only need to clone the repeated fields since submessages are
    // not modifiable with the builder.
    cloneRepeatedFields_(newData);

    // Last field in the array might be an extension object
    // For extenions we need to clone the object itself and its repeated fields.
    if (hasExtensionObject(newData)) {
      const clonedExtension =
          Object.assign({}, /** @type {!Object} */ (newData.pop()));
      cloneRepeatedFields_(clonedExtension);
      newData.push(clonedExtension);
    }

    return JspbKernel.fromArray(ctor, newData);
  }



  freeze() {
    internalChecks.freezeObject(this.data_);
  }

  /**
   * @return {string}
   */
  serialize() {
    return JSON.stringify(this.data_);
  }

  /**
   * @param {!JspbKernel} other
   * @return {boolean}
   */
  equals(other) {
    if (this === other) {
      return true;
    }

    return Equivalence.equivalence(this.data_, other.data_);
  }

  /**
   * @return {number}
   */
  hashCode() {
    if (this.hash_ === 0) {
      this.hash_ = Hashing.hash(this.data_);
    }
    return this.hash_;
  }

  /**
   * Adjust index based on whether we are accessing array or the extension
   * object.
   * @param {number} fieldNumber The field number.
   * @return {number}
   * @private
   */
  adjustIndex_(fieldNumber) {
    const adjustedIndex = fieldNumber + this.messageOffset_;
    return adjustedIndex < this.pivot_ ? adjustedIndex : fieldNumber;
  }

  /**
   * Selects either the data object or the extension object based on the
   * adjusted index.
   * @param {number} adjustedIndex is adjusted field number with #adjustIndex_.
   * @return {!Object<number, *>}
   * @private
   */
  getStorageFor_(adjustedIndex) {
    if (adjustedIndex < this.pivot_) {
      return this.data_;
    } else {
      let extension = this.data_[this.pivot_];
      if (!extension) {
        extension = this.data_[this.pivot_] = {};
      }
      return /** @type {!Object<number, *>} */ (extension);
    }
  }

  /**
   * @param {number} fieldNumber
   * @return {boolean}
   */
  hasField(fieldNumber) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    return FieldAccessor.hasField(rawJson, index);
  }


  /**
   * @param {number} fieldNumber
   * @return {number}
   */
  getRepeatedFieldCount(fieldNumber) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    return FieldAccessor.getRepeatedFieldCount(rawJson, index);
  }


  /**
   * @param {number} fieldNumber
   * @param {function(!Object<number, *>, number):T} accessorFn
   * @private
   * @return {T}
   * @template T
   */
  getField_(fieldNumber, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    return accessorFn(rawJson, index);
  }

  /**
   * @param {number} fieldNumber
   * @param {T} defaultValue
   * @param {function(!Object<number, *>, number, T):T} accessorFn
   * @private
   * @return {T}
   * @template T
   */
  getFieldWithDefault_(fieldNumber, defaultValue, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    return accessorFn(rawJson, index, defaultValue);
  }


  /**
   * @param {number} fieldNumber
   * @param {function(!Object<number, *>, number):T} accessorFn
   * @private
   * @return {T}
   * @template T
   */
  getRepeatedField_(fieldNumber, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    return accessorFn(rawJson, index);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {function(!Object<number, *>, number, number):T} accessorFn
   * @private
   * @return {T}
   * @template T
   */
  getElement_(fieldNumber, elementIndex, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    return accessorFn(rawJson, index, elementIndex);
  }

  /**
   * @param {number} fieldNumber
   */
  clearField(fieldNumber) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    delete rawJson[index];
  }

  /**
   * @param {number} fieldNumber
   * @param {T} value
   * @param {function(!Object<number, *>, number, T)} accessorFn
   * @private
   * @template T
   */
  addElement_(fieldNumber, value, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    accessorFn(rawJson, index, value);
  }


  /**
   * @param {number} fieldNumber
   * @param {T} value
   * @param {function(!Object<number, *>, number, T)} accessorFn
   * @private
   * @template T
   */
  addAllElements_(fieldNumber, value, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    accessorFn(rawJson, index, value);
  }


  /**
   * @param {number} fieldNumber
   * @param {T} value
   * @param {function(!Object<number, *>, number, T)} accessorFn
   * @private
   * @template T
   */
  setField_(fieldNumber, value, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    accessorFn(rawJson, index, value);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {T} value
   * @param {function(!Object<number, *>, number, number, T)} accessorFn
   * @private
   * @template T
   */
  setElement_(fieldNumber, elementIndex, value, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    accessorFn(rawJson, index, elementIndex, value);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<T>} value
   * @param {function(!Object<number, *>, number, !Iterable<T>)} accessorFn
   * @private
   * @template T
   */
  setIterable_(fieldNumber, value, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.getStorageFor_(index);
    accessorFn(rawJson, index, value);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Boolean accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @return {boolean}
   */
  getBooleanField(fieldNumber) {
    return this.getField_(fieldNumber, FieldAccessor.getBoolean);
  }

  /**
   * @param {number} fieldNumber
   * @param {boolean} defaultValue
   * @return {boolean}
   */
  getBooleanFieldWithDefault(fieldNumber, defaultValue) {
    return this.getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getBooleanWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @return {!ListView<boolean>}
   */
  getRepeatedBooleanField(fieldNumber) {
    return this.getRepeatedField_(
        fieldNumber, FieldAccessor.getBooleanListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {boolean}
   */
  getBooleanElement(fieldNumber, elementIndex) {
    return this.getElement_(
        fieldNumber, elementIndex, FieldAccessor.getBooleanElement);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Boolean accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // ByteString accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @return {!ByteString}
   */
  getByteStringField(fieldNumber) {
    return this.getField_(fieldNumber, FieldAccessor.getByteString);
  }

  /**
   * @param {number} fieldNumber
   * @param {!ByteString} defaultValue
   * @return {!ByteString}
   */
  getByteStringFieldWithDefault(fieldNumber, defaultValue) {
    return this.getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getByteStringWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @return {!ListView<!ByteString>}
   */
  getRepeatedByteStringField(fieldNumber) {
    return this.getRepeatedField_(
        fieldNumber, FieldAccessor.getByteStringListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {!ByteString}
   */
  getByteStringElement(fieldNumber, elementIndex) {
    return this.getElement_(
        fieldNumber, elementIndex, FieldAccessor.getByteStringElement);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // ByteString accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Double accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @return {number}
   */
  getDoubleField(fieldNumber) {
    return this.getField_(fieldNumber, FieldAccessor.getDouble);
  };

  /**
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @return {number}
   */
  getDoubleFieldWithDefault(fieldNumber, defaultValue) {
    return this.getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getDoubleWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @return {!ListView<number>}
   */
  getRepeatedDoubleField(fieldNumber) {
    return this.getRepeatedField_(fieldNumber, FieldAccessor.getDoubleListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {number}
   */
  getDoubleElement(fieldNumber, elementIndex) {
    return this.getElement_(
        fieldNumber, elementIndex, FieldAccessor.getDoubleElement);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Double accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Int accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @return {number}
   */
  getIntField(fieldNumber) {
    return this.getField_(fieldNumber, FieldAccessor.getInt);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @return {number}
   */
  getIntFieldWithDefault(fieldNumber, defaultValue) {
    return this.getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getIntWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @return {!ListView<number>}
   */
  getRepeatedIntField(fieldNumber) {
    return this.getRepeatedField_(fieldNumber, FieldAccessor.getIntListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {number}
   */
  getIntElement(fieldNumber, elementIndex) {
    return this.getElement_(
        fieldNumber, elementIndex, FieldAccessor.getIntElement);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Int accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Long accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @return {!Long}
   */
  getLongField(fieldNumber) {
    return this.getField_(fieldNumber, FieldAccessor.getLong);
  }

  /**
   * @param {number} fieldNumber
   * @return {!Long}
   */
  getInt52LongField(fieldNumber) {
    return this.getField_(fieldNumber, FieldAccessor.getLong);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @return {!Long}
   */
  getLongFieldWithDefault(fieldNumber, defaultValue) {
    return this.getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getLongWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @return {!Long}
   */
  getInt52LongFieldWithDefault(fieldNumber, defaultValue) {
    return this.getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getLongWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @return {!ListView<!Long>}
   */
  getRepeatedLongField(fieldNumber) {
    return this.getRepeatedField_(fieldNumber, FieldAccessor.getLongListView);
  }

  /**
   * @param {number} fieldNumber
   * @return {!ListView<!Long>}
   */
  getRepeatedInt52LongField(fieldNumber) {
    return this.getRepeatedField_(fieldNumber, FieldAccessor.getLongListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {!Long}
   */
  getLongElement(fieldNumber, elementIndex) {
    return this.getElement_(
        fieldNumber, elementIndex, FieldAccessor.getLongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {!Long}
   */
  getInt52LongElement(fieldNumber, elementIndex) {
    return this.getElement_(
        fieldNumber, elementIndex, FieldAccessor.getLongElement);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Long accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Message accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {function(new:T, !Array<*>)} ctor
   * @template T
   * @return {T}
   */
  getMessageField(fieldNumber, ctor) {
    const instanceCreator = data => JspbKernel.fromArray(ctor, data);
    return this.getField_(
        fieldNumber, (a, i) => FieldAccessor.getMessage(a, i, instanceCreator));
  }

  /**
   * @param {number} fieldNumber
   * @param {function(new:T, !Array<*>)} ctor
   * @template T
   * @return {!ListView<T>}
   */
  getRepeatedMessageField(fieldNumber, ctor) {
    const instanceCreator = data => JspbKernel.fromArray(ctor, data);
    return this.getRepeatedField_(
        fieldNumber,
        (data, fieldNumber) => FieldAccessor.getMessageListView(
            data, fieldNumber, instanceCreator));
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {function(new:T, !Array<*>)} ctor
   * @template T
   * @return {T}
   */
  getMessageElement(fieldNumber, elementIndex, ctor) {
    const instanceCreator = data => JspbKernel.fromArray(ctor, data);
    return this.getElement_(
        fieldNumber, elementIndex,
        (data, fieldNumber, index) => FieldAccessor.getMessageElement(
            data, fieldNumber, index, instanceCreator));
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Message accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // String accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @return {string}
   */
  getStringField(fieldNumber) {
    return this.getField_(fieldNumber, FieldAccessor.getString);
  }

  /**
   * @param {number} fieldNumber
   * @param {string} defaultValue
   * @return {string}
   */
  getStringFieldWithDefault(fieldNumber, defaultValue) {
    return this.getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getStringWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @return {!ListView<string>}
   */
  getRepeatedStringField(fieldNumber) {
    return this.getRepeatedField_(fieldNumber, FieldAccessor.getStringListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @return {string}
   */
  getStringElement(fieldNumber, elementIndex) {
    return this.getElement_(
        fieldNumber, elementIndex, FieldAccessor.getStringElement);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // String accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Boolean accessors for builder start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {boolean} value
   */
  addBooleanElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value, FieldAccessor.addBooleanElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} value
   */
  addAllBooleanElements(fieldNumber, value) {
    this.addAllElements_(
        fieldNumber, value, FieldAccessor.addAllBooleanElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {boolean} value
   */
  setBooleanField(fieldNumber, value) {
    this.setField_(fieldNumber, value, FieldAccessor.setBoolean);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} value
   */
  setBooleanIterable(fieldNumber, value) {
    this.setIterable_(fieldNumber, value, FieldAccessor.setBooleanIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {boolean} value
   */
  setBooleanElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setBooleanElement);
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // Boolean accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // ByteString accessors for builder start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {!ByteString} value
   */
  addByteStringElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value, FieldAccessor.addByteStringElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} value
   */
  addAllByteStringElements(fieldNumber, value) {
    this.addAllElements_(
        fieldNumber, value, FieldAccessor.addAllByteStringElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {!ByteString} value
   */
  setByteStringField(fieldNumber, value) {
    this.setField_(fieldNumber, value, FieldAccessor.setByteString);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} value
   */
  setByteStringIterable(fieldNumber, value) {
    this.setIterable_(fieldNumber, value, FieldAccessor.setByteStringIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!ByteString} value
   */
  setByteStringElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setByteStringElement);
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // ByteString accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Double accessors for builder start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {number} value
   */
  addDoubleElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value, FieldAccessor.addDoubleElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   */
  addAllDoubleElements(fieldNumber, value) {
    this.addAllElements_(
        fieldNumber, value, FieldAccessor.addAllDoubleElements);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} value
   */
  setDoubleField(fieldNumber, value) {
    this.setField_(fieldNumber, value, FieldAccessor.setDouble);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   */
  setDoubleIterable(fieldNumber, value) {
    this.setIterable_(fieldNumber, value, FieldAccessor.setDoubleIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   */
  setDoubleElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setDoubleElement);
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // Double accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Int accessors for builder start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {number} value
   */
  addIntElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value, FieldAccessor.addIntElement);
  }

  /**
   * Note that unparameterized Iterable since JsCompiler doesn't support
   * contravariance in generics and the method is used by both int and enum.
   * @param {number} fieldNumber
   * @param {!Iterable} value
   */
  addAllIntElements(fieldNumber, value) {
    this.addAllElements_(fieldNumber, value, FieldAccessor.addAllIntElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} value
   */
  setIntField(fieldNumber, value) {
    this.setField_(fieldNumber, value, FieldAccessor.setInt);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   */
  setIntIterable(fieldNumber, value) {
    this.setIterable_(fieldNumber, value, FieldAccessor.setIntIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   */
  setIntElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setIntElement);
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // Int accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Long accessors for builder start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  addLongElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value, FieldAccessor.addLongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  addInt52LongElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value, FieldAccessor.addInt52LongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   */
  addAllLongElements(fieldNumber, value) {
    this.addAllElements_(fieldNumber, value, FieldAccessor.addAllLongElements);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   */
  addAllInt52LongElements(fieldNumber, value) {
    this.addAllElements_(
        fieldNumber, value, FieldAccessor.addAllInt52LongElements);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  setLongField(fieldNumber, value) {
    this.setField_(fieldNumber, value, FieldAccessor.setLong);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   */
  setLongIterable(fieldNumber, value) {
    this.setIterable_(fieldNumber, value, FieldAccessor.setLongIterable);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   */
  setInt52LongField(fieldNumber, value) {
    this.setField_(fieldNumber, value, FieldAccessor.setInt52Long);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   */
  setInt52LongIterable(fieldNumber, value) {
    this.setIterable_(fieldNumber, value, FieldAccessor.setInt52LongIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   */
  setLongElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setLongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   */
  setInt52LongElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setInt52LongElement);
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // Long accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // Message accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {!JspbKernel} value
   */
  addMessageElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value.data_, FieldAccessor.addMessageElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!JspbKernel} value
   */
  setMessageField(fieldNumber, value) {
    this.setField_(
        fieldNumber, value, (data, index) => data[index] = value.data_);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!JspbKernel} value
   */
  setMessageElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value.data_,
        FieldAccessor.setMessageElement);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Message accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  // String accessors for builder start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {string} value
   */
  addStringElement(fieldNumber, value) {
    this.addElement_(fieldNumber, value, FieldAccessor.addStringElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<string>} value
   */
  addAllStringElements(fieldNumber, value) {
    this.addAllElements_(
        fieldNumber, value, FieldAccessor.addAllStringElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {string} value
   */
  setStringField(fieldNumber, value) {
    this.setField_(fieldNumber, value, FieldAccessor.setString);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<string>} value
   */
  setStringIterable(fieldNumber, value) {
    this.setIterable_(fieldNumber, value, FieldAccessor.setStringIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {string} value
   */
  setStringElement(fieldNumber, elementIndex, value) {
    this.setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setStringElement);
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // String accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////
}

exports = JspbKernel;
