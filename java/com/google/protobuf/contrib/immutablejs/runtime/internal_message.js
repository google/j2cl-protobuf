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

/*
##########################################################
#                                                        #
#  __          __     _____  _   _ _____ _   _  _____    #
#  \ \        / /\   |  __ \| \ | |_   _| \ | |/ ____|   #
#   \ \  /\  / /  \  | |__) |  \| | | | |  \| | |  __    #
#    \ \/  \/ / /\ \ |  _  /| . ` | | | | . ` | | |_ |   #
#     \  /\  / ____ \| | \ \| |\  |_| |_| |\  | |__| |   #
#      \/  \/_/    \_\_|  \_\_| \_|_____|_| \_|\_____|   #
#                                                        #
#                                                        #
##########################################################
# Do not use this class in your code. This class purely  #
# exists to make proto code generation easier.           #
# If you are looking for the public usable api please    #
# look at proto.im.Message.                              #
##########################################################
 */
goog.module('proto.im.internal.InternalMessage');

const ByteString = goog.require('proto.im.ByteString');
const JspbKernel = goog.require('proto.im.JspbKernel');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const Message = goog.require('proto.im.Message');
const internalChecks = goog.require('proto.im.internal.internalChecks');
const reflect = goog.require('goog.reflect');

/**
 * Base class for all immutable proto messages.
 * @abstract
 * @template MESSAGE
 * @template BUILDER
 * @extends {Message<MESSAGE, BUILDER>}
 */
class InternalMessage extends Message {
  /**
   * @param {!Array<*>} data The array holding protobuf data conforming to the
   *     JSPB wireformat.
   * @param {number} suggestedPivot The pivot value after which fields are found
   *     in the extension object.
   * @param {string|number} messageId The apps framework message id.
   * @protected
   */
  constructor(data, suggestedPivot, messageId) {
    super();
    /** @private @const {!JspbKernel} */
    this.kernel_ = JspbKernel.create(data, suggestedPivot, messageId);
  }

  /**
   * @param {function(new:MESSAGE, !Array<*>)} ctor
   * @param {!Array<?>} data
   * @return {MESSAGE}
   * @protected
   * @template MESSAGE
   */
  static fromArray(ctor, data) {
    return JspbKernel.fromArray(ctor, data);
  }

  /**
   * @param {function(new:MESSAGE, !Array<*>)} ctor
   * @param {string} json
   * @return {MESSAGE}
   * @template MESSAGE
   * @protected
   */
  static parseBase(ctor, json) {
    const parsedProto = JSON.parse(json);
    return InternalMessage.fromArray(
        ctor, internalChecks.checkTypeArray(parsedProto));
  }

  /**
   * Gets the default message instance for the given module name.
   *
   * @param {function(new:MESSAGE, !Array<*>)} ctor
   * @return {!MESSAGE}
   * @template MESSAGE
   * @protected
   */
  static getDefaultInstanceForMessage(ctor) {
    return reflect.cache(
        DEFAULT_INSTANCES, /* key= */ undefined,
        () => InternalMessage.fromArray(ctor, []),
        () => goog.getUid(ctor));
  }

  /**
   * @return {function(new:MESSAGE, !Array<*>)}
   * @private
   */
  getConstructor_() {
    return /** @type {function(new:MESSAGE, !Array<*>)} */ (this.constructor);
  }

  /**
   * @return {function(string):MESSAGE}
   * @final
   * @override
   */
  getParserForType() {
    const ctor = this.getConstructor_();
    return json => InternalMessage.parseBase(ctor, json);
  }

  /**
   * @return {string}
   * @final
   * @override
   */
  serialize() {
    return this.kernel_.serialize();
  }

  /**
   * @param {*} other
   * @return {boolean}
   * @final
   * @override
   */
  equals(other) {
    if (this === other) {
      return true;
    }

    if (!(other instanceof this.getConstructor_())) {
      return false;
    }

    const otherMessage = /** @type{!InternalMessage} */ (other);
    return this.kernel_.equals(otherMessage.kernel_);
  }

  /**
   * @return {number}
   * @final
   * @override
   */
  hashCode() {
    return this.kernel_.hashCode();
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {T}
   * @template T
   * @final
   * @override
   */
  getExtension(extensionInfo) {
    const accessor =
        (/** @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, T>} */ (
             extensionInfo))
            .getReadAccessor();
    return accessor(this);
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {number} index
   * @return {T}
   * @template T
   * @final
   * @override
   */
  getExtensionAtIndex(extensionInfo, index) {
    const accessor =
        (/**
            @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, !ListView<T>>}
              */
         (extensionInfo))
            .getIndexReadAccessor();
    return accessor(this, index);
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @template T
   * @return {number}
   * @final
   * @override
   */
  getExtensionCount(extensionInfo) {
    return this.internal_getRepeatedFieldCount(
        (/**
            @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, !ListView<T>>}
              */
         (extensionInfo))
            .getFieldNumber());
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @template T
   * @return {boolean}
   * @final
   * @override
   */
  hasExtension(extensionInfo) {
    return this.internal_hasField(
        (/** @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, T>} */ (
             extensionInfo))
            .getFieldNumber());
  }

  /**
   * @private
   */
  freeze_() {
    this.kernel_.freeze();
  }

  /**
   * Returns a shallow copied new message.
   * @return {MESSAGE}
   * @private
   */
  shallowCopy_() {
    return this.kernel_.shallowCopy(this.getConstructor_());
  }

  /**
   * @param {number} fieldNumber
   * @return {boolean}
   * @protected
   */
  internal_hasField(fieldNumber) {
    return this.kernel_.hasField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @return {number}
   * @protected
   */
  internal_getRepeatedFieldCount(fieldNumber) {
    return this.kernel_.getRepeatedFieldCount(fieldNumber);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // Boolean accessors start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {boolean}
   */
  internal_getBooleanField(fieldNumber) {
    return this.kernel_.getBooleanField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {boolean} defaultValue
   * @protected
   * @return {boolean}
   */
  internal_getBooleanFieldWithDefault(fieldNumber, defaultValue) {
    return this.kernel_.getBooleanFieldWithDefault(fieldNumber, defaultValue);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<boolean>}
   */
  internal_getRepeatedBooleanField(fieldNumber) {
    return this.kernel_.getRepeatedBooleanField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {boolean}
   */
  internal_getBooleanElement(fieldNumber, elementIndex) {
    return this.kernel_.getBooleanElement(fieldNumber, elementIndex);
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
   * @protected
   * @return {!ByteString}
   */
  internal_getByteStringField(fieldNumber) {
    return this.kernel_.getByteStringField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {!ByteString} defaultValue
   * @protected
   * @return {!ByteString}
   */
  internal_getByteStringFieldWithDefault(fieldNumber, defaultValue) {
    return this.kernel_.getByteStringFieldWithDefault(
        fieldNumber, defaultValue);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<!ByteString>}
   */
  internal_getRepeatedByteStringField(fieldNumber) {
    return this.kernel_.getRepeatedByteStringField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {!ByteString}
   */
  internal_getByteStringElement(fieldNumber, elementIndex) {
    return this.kernel_.getByteStringElement(fieldNumber, elementIndex);
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
   * @protected
   * @return {number}
   */
  internal_getDoubleField(fieldNumber) {
    return this.kernel_.getDoubleField(fieldNumber);
  };

  /**
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @protected
   * @return {number}
   */
  internal_getDoubleFieldWithDefault(fieldNumber, defaultValue) {
    return this.kernel_.getDoubleFieldWithDefault(fieldNumber, defaultValue);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<number>}
   */
  internal_getRepeatedDoubleField(fieldNumber) {
    return this.kernel_.getRepeatedDoubleField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {number}
   */
  internal_getDoubleElement(fieldNumber, elementIndex) {
    return this.kernel_.getDoubleElement(fieldNumber, elementIndex);
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
   * @protected
   * @return {number}
   */
  internal_getIntField(fieldNumber) {
    return this.kernel_.getIntField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @protected
   * @return {number}
   */
  internal_getIntFieldWithDefault(fieldNumber, defaultValue) {
    return this.kernel_.getIntFieldWithDefault(fieldNumber, defaultValue);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<number>}
   */
  internal_getRepeatedIntField(fieldNumber) {
    return this.kernel_.getRepeatedIntField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {number}
   */
  internal_getIntElement(fieldNumber, elementIndex) {
    return this.kernel_.getIntElement(fieldNumber, elementIndex);
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
   * @protected
   * @return {!Long}
   */
  internal_getLongField(fieldNumber) {
    return this.kernel_.getLongField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!Long}
   */
  internal_getInt52LongField(fieldNumber) {
    return this.kernel_.getInt52LongField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @protected
   * @return {!Long}
   */
  internal_getLongFieldWithDefault(fieldNumber, defaultValue) {
    return this.kernel_.getLongFieldWithDefault(fieldNumber, defaultValue);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @protected
   * @return {!Long}
   */
  internal_getInt52LongFieldWithDefault(fieldNumber, defaultValue) {
    return this.kernel_.getInt52LongFieldWithDefault(fieldNumber, defaultValue);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<!Long>}
   */
  internal_getRepeatedLongField(fieldNumber) {
    return this.kernel_.getRepeatedLongField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<!Long>}
   */
  internal_getRepeatedInt52LongField(fieldNumber) {
    return this.kernel_.getRepeatedInt52LongField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {!Long}
   */
  internal_getLongElement(fieldNumber, elementIndex) {
    return this.kernel_.getLongElement(fieldNumber, elementIndex);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {!Long}
   */
  internal_getInt52LongElement(fieldNumber, elementIndex) {
    return this.kernel_.getInt52LongElement(fieldNumber, elementIndex);
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
   * @protected
   * @template T
   * @return {T}
   */
  internal_getMessageField(fieldNumber, ctor) {
    return this.kernel_.getMessageField(fieldNumber, ctor);
  }

  /**
   * @param {number} fieldNumber
   * @param {function(new:T, !Array<*>)} ctor
   * @protected
   * @template T
   * @return {!ListView<T>}
   */
  internal_getRepeatedMessageField(fieldNumber, ctor) {
    return this.kernel_.getRepeatedMessageField(fieldNumber, ctor);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {function(new:T, !Array<*>)} ctor
   * @protected
   * @template T
   * @return {T}
   */
  internal_getMessageElement(fieldNumber, elementIndex, ctor) {
    return this.kernel_.getMessageElement(fieldNumber, elementIndex, ctor);
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
   * @protected
   * @return {string}
   */
  internal_getStringField(fieldNumber) {
    return this.kernel_.getStringField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {string} defaultValue
   * @protected
   * @return {string}
   */
  internal_getStringFieldWithDefault(fieldNumber, defaultValue) {
    return this.kernel_.getStringFieldWithDefault(fieldNumber, defaultValue);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<string>}
   */
  internal_getRepeatedStringField(fieldNumber) {
    return this.kernel_.getRepeatedStringField(fieldNumber);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {string}
   */
  internal_getStringElement(fieldNumber, elementIndex) {
    return this.kernel_.getStringElement(fieldNumber, elementIndex);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  // String accessors stop
  //
  //////////////////////////////////////////////////////////////////////////////
}


/**
 * Base class for all immutable proto builders.
 * @abstract
 * @template MESSAGE
 * @template BUILDER
 * @extends {Message.Builder<MESSAGE, BUILDER>}
 * @suppress {checkPrototypalTypes} TODO(b/113171732): Remove suppression.
 */
InternalMessage.Builder = class extends Message.Builder {
  /**
   * @param {MESSAGE} originalMessage the message that this builder will be
   *     initially populated with.
   * @protected
   */
  constructor(originalMessage) {
    super();
    /** @protected @const {MESSAGE} */
    this.message = originalMessage.shallowCopy_();
    /** @private @const {!JspbKernel} */
    this.kernel_ = this.message.kernel_;
  }

  /**
   * @return {MESSAGE}
   * @final
   * @override
   */
  build() {
    // Clone the message so further modifications in builder doesn't reflect.
    const m = this.message.shallowCopy_();
    m.freeze_();
    return m;
  }

  /**
   * @return {BUILDER} A copy of this builder.
   * @final
   * @override
   */
  clone() {
    // TODO(b/114300224): Remove this cast. As an instance of an abstact class,
    // the compiler can't determines that `this.constructor` must be a concrete
    // class. It therefore warns about abstract class instantiation. This cast
    // suppresses the warning.
    const ctor = /** @type {function(new:BUILDER, ...?)} */ (this.constructor);
    return new ctor(this.message);
  }


  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {T} value
   * @return {BUILDER}
   * @template T
   * @final
   * @override
   */
  addExtension(extensionInfo, value) {
    const accessor =
        (/**
            @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, !ListView<T>>}
              */
         (extensionInfo))
            .getAddAccessor();
    accessor(this, value);
    return this;
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {BUILDER}
   * @template T
   * @final
   * @override
   */
  clearExtension(extensionInfo) {
    return this.internal_clearField(
        (/** @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, T>} */ (
             extensionInfo))
            .getFieldNumber());
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {T}
   * @template T
   * @final
   * @override
   */
  getExtension(extensionInfo) {
    return this.message.getExtension(extensionInfo);
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {number} index
   * @return {T}
   * @template T
   * @final
   * @override
   */
  getExtensionAtIndex(extensionInfo, index) {
    return this.message.getExtensionAtIndex(extensionInfo, index);
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @template T
   * @return {number}
   * @final
   * @override
   */
  getExtensionCount(extensionInfo) {
    return this.message.getExtensionCount(extensionInfo);
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @template T
   * @return {boolean}
   * @final
   * @override
   */
  hasExtension(extensionInfo) {
    return this.message.hasExtension(extensionInfo);
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @param {T} value
   * @return {BUILDER}
   * @template T
   * @final
   * @override
   */
  setExtension(extensionInfo, value) {
    const accessor =
        (/** @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, T>} */ (
             extensionInfo))
            .getWriteAccessor();
    accessor(this, value);
    return this;
  }

  /**
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {number} index
   * @param {T} value
   * @return {BUILDER}
   * @template T
   * @final
   * @override
   */
  setExtensionAtIndex(extensionInfo, index, value) {
    const accessor =
        (/**
            @type {!InternalMessage.ExtensionFieldInfo<MESSAGE, !ListView<T>>}
              */
         (extensionInfo))
            .getIndexWriteAccessor();
    accessor(this, index, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {BUILDER}
   */
  internal_clearField(fieldNumber) {
    this.kernel_.clearField(fieldNumber);
    return this;
  }

  /**
   * @param {...number} fieldNumbers
   * @protected
   * @return {BUILDER}
   */
  internal_clearFields(...fieldNumbers) {
    for (let i = 0; i < fieldNumbers.length; i++) {
      this.internal_clearField(fieldNumbers[i]);
    }
    return this;
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // Boolean accessors for builder start
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {number} fieldNumber
   * @param {boolean} value
   * @protected
   * @return {BUILDER}
   */
  internal_addBooleanElement(fieldNumber, value) {
    this.kernel_.addBooleanElement(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllBooleanElements(fieldNumber, value) {
    this.kernel_.addAllBooleanElements(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {boolean} value
   * @protected
   * @return {BUILDER}
   */
  internal_setBooleanField(fieldNumber, value) {
    this.kernel_.setBooleanField(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setBooleanIterable(fieldNumber, value) {
    this.kernel_.setBooleanIterable(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {boolean} value
   * @protected
   * @return {BUILDER}
   */
  internal_setBooleanElement(fieldNumber, elementIndex, value) {
    this.kernel_.setBooleanElement(fieldNumber, elementIndex, value);
    return this;
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
   * @protected
   * @return {BUILDER}
   */
  internal_addByteStringElement(fieldNumber, value) {
    this.kernel_.addByteStringElement(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllByteStringElements(fieldNumber, value) {
    this.kernel_.addAllByteStringElements(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!ByteString} value
   * @protected
   * @return {BUILDER}
   */
  internal_setByteStringField(fieldNumber, value) {
    this.kernel_.setByteStringField(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setByteStringIterable(fieldNumber, value) {
    this.kernel_.setByteStringIterable(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!ByteString} value
   * @protected
   * @return {BUILDER}
   */
  internal_setByteStringElement(fieldNumber, elementIndex, value) {
    this.kernel_.setByteStringElement(fieldNumber, elementIndex, value);
    return this;
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
   * @protected
   * @return {BUILDER}
   */
  internal_addDoubleElement(fieldNumber, value) {
    this.kernel_.addDoubleElement(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllDoubleElements(fieldNumber, value) {
    this.kernel_.addAllDoubleElements(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setDoubleField(fieldNumber, value) {
    this.kernel_.setDoubleField(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setDoubleIterable(fieldNumber, value) {
    this.kernel_.setDoubleIterable(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setDoubleElement(fieldNumber, elementIndex, value) {
    this.kernel_.setDoubleElement(fieldNumber, elementIndex, value);
    return this;
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
   * @protected
   * @return {BUILDER}
   */
  internal_addIntElement(fieldNumber, value) {
    this.kernel_.addIntElement(fieldNumber, value);
    return this;
  }

  /**
   * Note that unparameterized Iterable since JsCompiler doesn't support
   * contravariance in generics and the method is used by both int and enum.
   * @param {number} fieldNumber
   * @param {!Iterable} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllIntElements(fieldNumber, value) {
    this.kernel_.addAllIntElements(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setIntField(fieldNumber, value) {
    this.kernel_.setIntField(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setIntIterable(fieldNumber, value) {
    this.kernel_.setIntIterable(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setIntElement(fieldNumber, elementIndex, value) {
    this.kernel_.setIntElement(fieldNumber, elementIndex, value);
    return this;
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
   * @protected
   * @return {BUILDER}
   */
  internal_addLongElement(fieldNumber, value) {
    this.kernel_.addLongElement(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_addInt52LongElement(fieldNumber, value) {
    this.kernel_.addInt52LongElement(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllLongElements(fieldNumber, value) {
    this.kernel_.addAllLongElements(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllInt52LongElements(fieldNumber, value) {
    this.kernel_.addAllInt52LongElements(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setLongField(fieldNumber, value) {
    this.kernel_.setLongField(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setLongIterable(fieldNumber, value) {
    this.kernel_.setLongIterable(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setInt52LongField(fieldNumber, value) {
    this.kernel_.setInt52LongField(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setInt52LongIterable(fieldNumber, value) {
    this.kernel_.setInt52LongIterable(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setLongElement(fieldNumber, elementIndex, value) {
    this.kernel_.setLongElement(fieldNumber, elementIndex, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setInt52LongElement(fieldNumber, elementIndex, value) {
    this.kernel_.setInt52LongElement(fieldNumber, elementIndex, value);
    return this;
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
   * @param {!InternalMessage|!InternalMessage.Builder} value
   * @protected
   * @return {BUILDER}
   */
  internal_addMessageElement(fieldNumber, value) {
    if (value instanceof Message.Builder) {
      value = value.build();
    }
    this.kernel_.addMessageElement(fieldNumber, value.kernel_);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<T>} values
   * @protected
   * @template T
   * @return {BUILDER}
   */
  internal_addAllMessageElements(fieldNumber, values) {
    for (const value of values) {
      this.internal_addMessageElement(fieldNumber, value);
    }
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {function(new:T, !Array<*>)} ctor
   * @protected
   * @template T
   * @return {T}
   */
  internal_getMessageField(fieldNumber, ctor) {
    return this.kernel_.getMessageField(fieldNumber, ctor);
  }

  /**
   * @param {number} fieldNumber
   * @param {function(new:T, !Array<*>)} ctor
   * @protected
   * @template T
   * @return {!Iterable<T>}
   */
  internal_getRepeatedMessageField(fieldNumber, ctor) {
    return this.kernel_.getRepeatedMessageField(fieldNumber, ctor);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {function(new:T, !Array<*>)} ctor
   * @protected
   * @template T
   * @return {T}
   */
  internal_getMessageElement(fieldNumber, elementIndex, ctor) {
    return this.kernel_.getMessageElement(fieldNumber, elementIndex, ctor);
  }

  /**
   * @param {number} fieldNumber
   * @param {!InternalMessage|!InternalMessage.Builder} value
   * @protected
   * @return {BUILDER}
   */
  internal_setMessageField(fieldNumber, value) {
    if (value instanceof Message.Builder) {
      value = value.build();
    }
    this.kernel_.setMessageField(fieldNumber, value.kernel_);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!InternalMessage>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setMessageIterable(fieldNumber, value) {
    this.internal_clearField(fieldNumber);
    for (const message of value) {
      this.internal_addMessageElement(fieldNumber, message);
    }
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!InternalMessage|!InternalMessage.Builder} value
   * @protected
   * @return {BUILDER}
   */
  internal_setMessageElement(fieldNumber, elementIndex, value) {
    if (value instanceof Message.Builder) {
      value = value.build();
    }
    this.kernel_.setMessageElement(fieldNumber, elementIndex, value.kernel_);
    return this;
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
   * @protected
   * @return {BUILDER}
   */
  internal_addStringElement(fieldNumber, value) {
    this.kernel_.addStringElement(fieldNumber, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<string>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllStringElements(fieldNumber, value) {
    this.kernel_.addAllStringElements(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {string} value
   * @protected
   * @return {BUILDER}
   */
  internal_setStringField(fieldNumber, value) {
    this.kernel_.setStringField(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<string>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setStringIterable(fieldNumber, value) {
    this.kernel_.setStringIterable(fieldNumber, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {string} value
   * @protected
   * @return {BUILDER}
   */
  internal_setStringElement(fieldNumber, elementIndex, value) {
    this.kernel_.setStringElement(fieldNumber, elementIndex, value);
    return this;
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // String accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////
};


/**
 * @override
 * @template TARGET_MESSAGE
 * @template T
 * @implements {Message.ExtensionFieldInfo<TARGET_MESSAGE, T>}
 * @final
 */
InternalMessage.ExtensionFieldInfo = class {
  /**
   * Creates a single boolean extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, boolean>}
   */
  static createSingleBooleanExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getBooleanField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setBooleanField(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated boolean extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ListView<boolean>>}
   */
  static createRepeatedBooleanExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getRepeatedBooleanField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setBooleanIterable(fieldNumber, value);
    const getElementFunction = (message, elementIndex) =>
        message.internal_getBooleanElement(fieldNumber, elementIndex);
    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setBooleanElement(fieldNumber, elementIndex, value);
    const addElementFunction = (builder, value) =>
        builder.internal_addBooleanElement(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * Creates a single byte string extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ByteString>}
   */
  static createSingleByteStringExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getByteStringField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setByteStringField(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated byte string extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ListView<!ByteString>>}
   */
  static createRepeatedByteStringExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getRepeatedByteStringField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setByteStringIterable(fieldNumber, value);
    const getElementFunction = (message, elementIndex) =>
        message.internal_getByteStringElement(fieldNumber, elementIndex);
    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setByteStringElement(fieldNumber, elementIndex, value);
    const addElementFunction = (builder, value) =>
        builder.internal_addByteStringElement(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * Creates a single double extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, number>}
   */
  static createSingleDoubleExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getDoubleField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setDoubleField(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated double extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ListView<number>>}
   */
  static createRepeatedDoubleExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getRepeatedDoubleField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setDoubleIterable(fieldNumber, value);
    const getElementFunction = (message, elementIndex) =>
        message.internal_getDoubleElement(fieldNumber, elementIndex);
    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setDoubleElement(fieldNumber, elementIndex, value);
    const addElementFunction = (builder, value) =>
        builder.internal_addDoubleElement(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * Creates a single int extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, E>}
   * @template E
   */
  static createSingleIntExtension(fieldNumber) {
    const getterFunction = message => message.internal_getIntField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setIntField(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated int extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ListView<E>>}
   * @template E
   */
  static createRepeatedIntExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getRepeatedIntField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setIntIterable(fieldNumber, value);
    const getElementFunction = (message, elementIndex) =>
        message.internal_getIntElement(fieldNumber, elementIndex);
    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setIntElement(fieldNumber, elementIndex, value);
    const addElementFunction = (builder, value) =>
        builder.internal_addIntElement(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * Creates a single Long extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !Long>}
   */
  static createSingleLongExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getLongField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setLongField(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated Long extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ListView<!Long>>}
   * @template TARGET_MESSAGE
   */
  static createRepeatedLongExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getRepeatedLongField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setLongIterable(fieldNumber, value);
    const getElementFunction = (message, elementIndex) =>
        message.internal_getLongElement(fieldNumber, elementIndex);
    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setLongElement(fieldNumber, elementIndex, value);
    const addElementFunction = (builder, value) =>
        builder.internal_addLongElement(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * Creates a single Long extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !Long>}
   */
  static createSingleInt52LongExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getInt52LongField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setInt52LongField(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated Long extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ListView<!Long>>}
   * @template TARGET_MESSAGE
   */
  static createRepeatedInt52LongExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getRepeatedInt52LongField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setInt52LongIterable(fieldNumber, value);
    const getElementFunction = (message, elementIndex) =>
        message.internal_getInt52LongElement(fieldNumber, elementIndex);
    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setInt52LongElement(fieldNumber, elementIndex, value);
    const addElementFunction = (builder, value) =>
        builder.internal_addInt52LongElement(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * Creates a single string extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, string>}
   */
  static createSingleStringExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getStringField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setStringField(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated string extension info object.
   * @param {number} fieldNumber
   * @return {!Message.ExtensionFieldInfo<?, !ListView<string>>}
   */
  static createRepeatedStringExtension(fieldNumber) {
    const getterFunction = message =>
        message.internal_getRepeatedStringField(fieldNumber);
    const setterFunction = (builder, value) =>
        builder.internal_setStringIterable(fieldNumber, value);
    const getElementFunction = (message, elementIndex) =>
        message.internal_getStringElement(fieldNumber, elementIndex);
    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setStringElement(fieldNumber, elementIndex, value);
    const addElementFunction = (builder, value) =>
        builder.internal_addStringElement(fieldNumber, value);
    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * Creates a single message extension info object.
   * @param {number} fieldNumber
   * @param {function(new:MESSAGE, !Array<?>)} ctor
   * @return {!Message.ExtensionFieldInfo<?, !MESSAGE>}
   * @template MESSAGE
   */
  static createSingleMessageExtension(fieldNumber, ctor) {
    const getterFunction = (message) =>
        message.internal_getMessageField(fieldNumber, ctor);


    const setterFunction = (builder, value) =>
        builder.internal_setMessageField(fieldNumber, value);


    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction);
  }

  /**
   * Creates a repeated message extension info object.
   * @param {number} fieldNumber
   * @param {function(new:MESSAGE, !Array<?>)} ctor
   * @return {!Message.ExtensionFieldInfo<?, !ListView<MESSAGE>>}
   * @template MESSAGE
   */
  static createRepeatedMessageExtension(fieldNumber, ctor) {
    const getterFunction = (message) =>
        message.internal_getRepeatedMessageField(fieldNumber, ctor);


    const setterFunction = (builder, value) =>
        builder.internal_setMessageIterable(fieldNumber, value);


    const getElementFunction = (message, elementIndex) =>
        message.internal_getMessageElement(fieldNumber, elementIndex, ctor);


    const setElementFunction = (builder, elementIndex, value) =>
        builder.internal_setMessageElement(fieldNumber, elementIndex, value);


    const addElementFunction = (builder, value) =>
        builder.internal_addMessageElement(fieldNumber, value);


    return new InternalMessage.ExtensionFieldInfo(
        fieldNumber, getterFunction, setterFunction, getElementFunction,
        setElementFunction, addElementFunction);
  }

  /**
   * @param {number} fieldNumber
   * @param {function(!Message): T} readAccessor
   * @param {function(!Message.Builder, T): *} writeAccessor
   * @param {(function(!Message, number): ?)=}
   *     indexReadAccessor
   * @param {(function(!Message.Builder, number, ?): *)=}
   *     indexWriteAccessor
   * @param {(function(!Message.Builder, ?): *)=} addAccessor
   * @private
   */
  constructor(
      fieldNumber, readAccessor, writeAccessor, indexReadAccessor,
      indexWriteAccessor, addAccessor) {
    /** @const @private */
    this.fieldNumber_ = fieldNumber;
    /** @const @private */
    this.readAccessor_ = readAccessor;
    /** @const @private */
    this.writeAccessor_ = writeAccessor;
    /** @const @private */
    this.indexReadAccessor_ = indexReadAccessor || null;
    /** @const @private */
    this.indexWriteAccessor_ = indexWriteAccessor || null;
    /** @const @private */
    this.addAccessor_ = addAccessor || null;
  }

  /**
   * @return {number}
   * @package
   */
  getFieldNumber() {
    return this.fieldNumber_;
  }

  /**
   * @return {function(!Message): !T}
   * @package
   */
  getReadAccessor() {
    return this.readAccessor_;
  }

  /**
   * @return {function(!Message.Builder, !T): *}
   * @package
   */
  getWriteAccessor() {
    return this.writeAccessor_;
  }

  /**
   * @return {?(function(!Message, number): ?)}
   * @package
   */
  getIndexReadAccessor() {
    return this.indexReadAccessor_;
  }

  /**
   * @return {?(function(!Message.Builder, number, ?): *)}
   * @package
   */
  getIndexWriteAccessor() {
    return this.indexWriteAccessor_;
  }

  /**
   * @return {?(function(!Message.Builder, ?): *)}
   * @package
   */
  getAddAccessor() {
    return this.addAccessor_;
  }
};

/**
 * @const {!Object<number, !InternalMessage>}
 */
const DEFAULT_INSTANCES = {};

exports = InternalMessage;
