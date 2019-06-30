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
const Equivalence = goog.require('proto.im.internal.Equivalence');
const FieldAccessor = goog.require('proto.im.internal.FieldAccessor');
const Hashing = goog.require('proto.im.internal.Hashing');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const Message = goog.require('proto.im.Message');
const internalChecks = goog.require('proto.im.internal.internalChecks');
const reflect = goog.require('goog.reflect');

/** @private @const */
const cachedMsgKey_ = '$jspb_cached_msg_';

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
    /** @private @const {!Array<*>} */
    this.data_ = data;
    /** @private @const {number} */
    this.pivot_ = InternalMessage.calculatePivot_(data, suggestedPivot);
    /** @private @const {number} */
    this.messageOffset_ = messageId ? 0 : -1;

    /** @private */
    this.hash_ = 0;

    // Assign message id if its not present
    if (messageId && !data[0]) {
      data[0] = messageId;
    }
  }

  /**
   * @param {function(new:MESSAGE, !Array<*>)} ctor
   * @param {!Array<?>} data
   * @return {MESSAGE}
   * @protected
   * @template MESSAGE
   */
  static fromArray(ctor, data) {
    const cache = /** @type {!Object} */ (data);
    return cache[cachedMsgKey_] || (cache[cachedMsgKey_] = new ctor(data));
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
   * @param {!Array} data
   * @return {boolean}
   * @private
   */
  static hasExtensionObject_(data) {
    if (data.length && data.length > 0) {
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
   * @return {number}
   * @private
   */
  static calculatePivot_(data, suggestedPivot) {
    if (InternalMessage.hasExtensionObject_(data)) {
      return data.length - 1;
    }

    if (suggestedPivot > 0) {
      return suggestedPivot;
    }

    return Number.MAX_VALUE;
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
    return JSON.stringify(this.data_);
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
    return Equivalence.equivalence(this.data_, otherMessage.data_);
  }

  /**
   * @return {number}
   * @final
   * @override
   */
  hashCode() {
    if (this.hash_ === 0) {
      this.hash_ = Hashing.hash(this.data_);
    }
    return this.hash_;
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
    internalChecks.freezeObject(this.data_);
  }

  /**
   * Adjust index based on whether we are accesing array or the extension
   * object.
   * @param {number} fieldNumber The field number.
   * @return {number}
   * @private
   */
  adjustIndex_(fieldNumber) {
    return fieldNumber < this.pivot_ ? fieldNumber + this.messageOffset_ :
                                       fieldNumber;
  }

  /**
   * Returns a shallow copied new message.
   * @return {MESSAGE}
   * @private
   */
  shallowCopy_() {
    const newData = this.data_.slice();
    // Note that we only need to clone the repeated fields since submessages are
    // not modifiable with the builder.
    InternalMessage.cloneRepeatedFields_(newData);

    // Last field in the array might be an extension object
    // For extenions we need to clone the object itself and its repeated fields.
    if (InternalMessage.hasExtensionObject_(newData)) {
      const clonedExtension =
          Object.assign({}, /** @type {!Object} */ (newData.pop()));
      InternalMessage.cloneRepeatedFields_(clonedExtension);
      newData.push(clonedExtension);
    }

    return InternalMessage.fromArray(this.getConstructor_(), newData);
  }

  /**
   * @param {!Object<number, ?>} data
   * @private
   */
  static cloneRepeatedFields_(data) {
    for (const key in data) {
      const value = data[+key];
      if (Array.isArray(value) && !(cachedMsgKey_ in value)) {
        // Note that for submessages that are not instantiated, there might not
        // a cached msg (e.g. a parsed Message where getter is not called yet).
        // Those are OK to copy since we don't care about referential equality
        // if the message is not instantiated yet.
        data[+key] = value.slice();
      }
    }
  }

  /**
   * Selects either the data object or the extension object based on the field
   * number.
   * @param {number} fieldNumber The field number.
   * @return {!Object<number, *>}
   * @protected
   */
  internal_getStorageFor(fieldNumber) {
    if (fieldNumber < this.pivot_) {
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
   * @protected
   */
  internal_hasField(fieldNumber) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.internal_getStorageFor(index);
    return FieldAccessor.hasField(rawJson, index);
  }


  /**
   * @param {number} fieldNumber
   * @return {number}
   * @protected
   */
  internal_getRepeatedFieldCount(fieldNumber) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.internal_getStorageFor(index);
    return FieldAccessor.getRepeatedFieldCount(rawJson, index);
  }


  /**
   * @param {number} fieldNumber
   * @param {function(!Object<number, *>, number):T} accessorFn
   * @private
   * @return {T}
   * @template T
   */
  internal_getField_(fieldNumber, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.internal_getStorageFor(index);
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
  internal_getFieldWithDefault_(fieldNumber, defaultValue, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.internal_getStorageFor(index);
    return accessorFn(rawJson, index, defaultValue);
  }


  /**
   * @param {number} fieldNumber
   * @param {function(!Object<number, *>, number):T} accessorFn
   * @private
   * @return {T}
   * @template T
   */
  internal_getRepeatedField_(fieldNumber, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.internal_getStorageFor(index);
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
  internal_getElement_(fieldNumber, elementIndex, accessorFn) {
    const index = this.adjustIndex_(fieldNumber);
    const rawJson = this.internal_getStorageFor(index);
    return accessorFn(rawJson, index, elementIndex);
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
    return this.internal_getField_(fieldNumber, FieldAccessor.getBoolean);
  }

  /**
   * @param {number} fieldNumber
   * @param {boolean} defaultValue
   * @protected
   * @return {boolean}
   */
  internal_getBooleanFieldWithDefault(fieldNumber, defaultValue) {
    return this.internal_getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getBooleanWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<boolean>}
   */
  internal_getRepeatedBooleanField(fieldNumber) {
    return this.internal_getRepeatedField_(
        fieldNumber, FieldAccessor.getBooleanListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {boolean}
   */
  internal_getBooleanElement(fieldNumber, elementIndex) {
    return this.internal_getElement_(
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
   * @protected
   * @return {!ByteString}
   */
  internal_getByteStringField(fieldNumber) {
    return this.internal_getField_(fieldNumber, FieldAccessor.getByteString);
  }

  /**
   * @param {number} fieldNumber
   * @param {!ByteString} defaultValue
   * @protected
   * @return {!ByteString}
   */
  internal_getByteStringFieldWithDefault(fieldNumber, defaultValue) {
    return this.internal_getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getByteStringWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<!ByteString>}
   */
  internal_getRepeatedByteStringField(fieldNumber) {
    return this.internal_getRepeatedField_(
        fieldNumber, FieldAccessor.getByteStringListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {!ByteString}
   */
  internal_getByteStringElement(fieldNumber, elementIndex) {
    return this.internal_getElement_(
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
   * @protected
   * @return {number}
   */
  internal_getDoubleField(fieldNumber) {
    return this.internal_getField_(fieldNumber, FieldAccessor.getDouble);
  };

  /**
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @protected
   * @return {number}
   */
  internal_getDoubleFieldWithDefault(fieldNumber, defaultValue) {
    return this.internal_getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getDoubleWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<number>}
   */
  internal_getRepeatedDoubleField(fieldNumber) {
    return this.internal_getRepeatedField_(
        fieldNumber, FieldAccessor.getDoubleListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {number}
   */
  internal_getDoubleElement(fieldNumber, elementIndex) {
    return this.internal_getElement_(
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
   * @protected
   * @return {number}
   */
  internal_getIntField(fieldNumber) {
    return this.internal_getField_(fieldNumber, FieldAccessor.getInt);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} defaultValue
   * @protected
   * @return {number}
   */
  internal_getIntFieldWithDefault(fieldNumber, defaultValue) {
    return this.internal_getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getIntWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<number>}
   */
  internal_getRepeatedIntField(fieldNumber) {
    return this.internal_getRepeatedField_(
        fieldNumber, FieldAccessor.getIntListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {number}
   */
  internal_getIntElement(fieldNumber, elementIndex) {
    return this.internal_getElement_(
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
   * @protected
   * @return {!Long}
   */
  internal_getLongField(fieldNumber) {
    return this.internal_getField_(fieldNumber, FieldAccessor.getLong);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!Long}
   */
  internal_getInt52LongField(fieldNumber) {
    return this.internal_getField_(fieldNumber, FieldAccessor.getLong);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @protected
   * @return {!Long}
   */
  internal_getLongFieldWithDefault(fieldNumber, defaultValue) {
    return this.internal_getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getLongWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} defaultValue
   * @protected
   * @return {!Long}
   */
  internal_getInt52LongFieldWithDefault(fieldNumber, defaultValue) {
    return this.internal_getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getLongWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<!Long>}
   */
  internal_getRepeatedLongField(fieldNumber) {
    return this.internal_getRepeatedField_(
        fieldNumber, FieldAccessor.getLongListView);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<!Long>}
   */
  internal_getRepeatedInt52LongField(fieldNumber) {
    return this.internal_getRepeatedField_(
        fieldNumber, FieldAccessor.getLongListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {!Long}
   */
  internal_getLongElement(fieldNumber, elementIndex) {
    return this.internal_getElement_(
        fieldNumber, elementIndex, FieldAccessor.getLongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {!Long}
   */
  internal_getInt52LongElement(fieldNumber, elementIndex) {
    return this.internal_getElement_(
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
   * @protected
   * @template T
   * @return {T}
   */
  internal_getMessageField(fieldNumber, ctor) {
    const instanceCreator = data => InternalMessage.fromArray(ctor, data);
    return this.internal_getField_(
        fieldNumber, (a, i) => FieldAccessor.getMessage(a, i, instanceCreator));
  }

  /**
   * @param {number} fieldNumber
   * @param {function(new:T, !Array<*>)} ctor
   * @protected
   * @template T
   * @return {!ListView<T>}
   */
  internal_getRepeatedMessageField(fieldNumber, ctor) {
    const instanceCreator = data => InternalMessage.fromArray(ctor, data);
    return this.internal_getRepeatedField_(
        fieldNumber,
        (data, fieldNumber) => FieldAccessor.getMessageListView(
            data, fieldNumber, instanceCreator));
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
    const instanceCreator = data => InternalMessage.fromArray(ctor, data);
    return this.internal_getElement_(
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
   * @protected
   * @return {string}
   */
  internal_getStringField(fieldNumber) {
    return this.internal_getField_(fieldNumber, FieldAccessor.getString);
  }

  /**
   * @param {number} fieldNumber
   * @param {string} defaultValue
   * @protected
   * @return {string}
   */
  internal_getStringFieldWithDefault(fieldNumber, defaultValue) {
    return this.internal_getFieldWithDefault_(
        fieldNumber, defaultValue, FieldAccessor.getStringWithDefault);
  }

  /**
   * @param {number} fieldNumber
   * @protected
   * @return {!ListView<string>}
   */
  internal_getRepeatedStringField(fieldNumber) {
    return this.internal_getRepeatedField_(
        fieldNumber, FieldAccessor.getStringListView);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @protected
   * @return {string}
   */
  internal_getStringElement(fieldNumber, elementIndex) {
    return this.internal_getElement_(
        fieldNumber, elementIndex, FieldAccessor.getStringElement);
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
    /** @protected {MESSAGE} */
    this.message = originalMessage.shallowCopy_();
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
    const index = this.message.adjustIndex_(fieldNumber);
    const rawJson = this.message.internal_getStorageFor(index);
    rawJson[index] = null;
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

  /**
   * @param {number} fieldNumber
   * @param {T} value
   * @param {function(!Object<number, *>, number, T)} accessorFn
   * @private
   * @template T
   * @return {BUILDER}
   */
  internal_addElement_(fieldNumber, value, accessorFn) {
    const index = this.message.adjustIndex_(fieldNumber);
    const rawJson = this.message.internal_getStorageFor(index);
    accessorFn(rawJson, index, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {T} value
   * @param {function(!Object<number, *>, number, T)} accessorFn
   * @private
   * @template T
   * @return {BUILDER}
   */
  internal_addAllElements_(fieldNumber, value, accessorFn) {
    const index = this.message.adjustIndex_(fieldNumber);
    const rawJson = this.message.internal_getStorageFor(index);
    accessorFn(rawJson, index, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {T} value
   * @param {function(!Object<number, *>, number, T)} accessorFn
   * @private
   * @template T
   * @return {BUILDER}
   */
  internal_setField_(fieldNumber, value, accessorFn) {
    const index = this.message.adjustIndex_(fieldNumber);
    const rawJson = this.message.internal_getStorageFor(index);
    accessorFn(rawJson, index, value);
    return this;
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {T} value
   * @param {function(!Object<number, *>, number, number, T)} accessorFn
   * @private
   * @template T
   * @return {BUILDER}
   */
  internal_setElement_(fieldNumber, elementIndex, value, accessorFn) {
    const index = this.message.adjustIndex_(fieldNumber);
    const rawJson = this.message.internal_getStorageFor(index);
    accessorFn(rawJson, index, elementIndex, value);
    return this;
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<T>} value
   * @param {function(!Object<number, *>, number, !Iterable<T>)} accessorFn
   * @private
   * @template T
   * @return {BUILDER}
   */
  internal_setIterable_(fieldNumber, value, accessorFn) {
    const index = this.message.adjustIndex_(fieldNumber);
    const rawJson = this.message.internal_getStorageFor(index);
    accessorFn(rawJson, index, value);
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
    return this.internal_addElement_(
        fieldNumber, value, FieldAccessor.addBooleanElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllBooleanElements(fieldNumber, value) {
    return this.internal_addAllElements_(
        fieldNumber, value, FieldAccessor.addAllBooleanElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {boolean} value
   * @protected
   * @return {BUILDER}
   */
  internal_setBooleanField(fieldNumber, value) {
    return this.internal_setField_(
        fieldNumber, value, FieldAccessor.setBoolean);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<boolean>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setBooleanIterable(fieldNumber, value) {
    return this.internal_setIterable_(
        fieldNumber, value, FieldAccessor.setBooleanIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {boolean} value
   * @protected
   * @return {BUILDER}
   */
  internal_setBooleanElement(fieldNumber, elementIndex, value) {
    return this.internal_setElement_(
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
   * @protected
   * @return {BUILDER}
   */
  internal_addByteStringElement(fieldNumber, value) {
    return this.internal_addElement_(
        fieldNumber, value, FieldAccessor.addByteStringElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllByteStringElements(fieldNumber, value) {
    return this.internal_addAllElements_(
        fieldNumber, value, FieldAccessor.addAllByteStringElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {!ByteString} value
   * @protected
   * @return {BUILDER}
   */
  internal_setByteStringField(fieldNumber, value) {
    return this.internal_setField_(
        fieldNumber, value, FieldAccessor.setByteString);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!ByteString>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setByteStringIterable(fieldNumber, value) {
    return this.internal_setIterable_(
        fieldNumber, value, FieldAccessor.setByteStringIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!ByteString} value
   * @protected
   * @return {BUILDER}
   */
  internal_setByteStringElement(fieldNumber, elementIndex, value) {
    return this.internal_setElement_(
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
   * @protected
   * @return {BUILDER}
   */
  internal_addDoubleElement(fieldNumber, value) {
    return this.internal_addElement_(
        fieldNumber, value, FieldAccessor.addDoubleElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllDoubleElements(fieldNumber, value) {
    return this.internal_addAllElements_(
        fieldNumber, value, FieldAccessor.addAllDoubleElements);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setDoubleField(fieldNumber, value) {
    return this.internal_setField_(fieldNumber, value, FieldAccessor.setDouble);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setDoubleIterable(fieldNumber, value) {
    return this.internal_setIterable_(
        fieldNumber, value, FieldAccessor.setDoubleIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setDoubleElement(fieldNumber, elementIndex, value) {
    return this.internal_setElement_(
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
   * @protected
   * @return {BUILDER}
   */
  internal_addIntElement(fieldNumber, value) {
    return this.internal_addElement_(
        fieldNumber, value, FieldAccessor.addIntElement);
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
    return this.internal_addAllElements_(
        fieldNumber, value, FieldAccessor.addAllIntElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setIntField(fieldNumber, value) {
    return this.internal_setField_(fieldNumber, value, FieldAccessor.setInt);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<number>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setIntIterable(fieldNumber, value) {
    return this.internal_setIterable_(
        fieldNumber, value, FieldAccessor.setIntIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {number} value
   * @protected
   * @return {BUILDER}
   */
  internal_setIntElement(fieldNumber, elementIndex, value) {
    return this.internal_setElement_(
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
   * @protected
   * @return {BUILDER}
   */
  internal_addLongElement(fieldNumber, value) {
    return this.internal_addElement_(
        fieldNumber, value, FieldAccessor.addLongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_addInt52LongElement(fieldNumber, value) {
    return this.internal_addElement_(
        fieldNumber, value, FieldAccessor.addInt52LongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllLongElements(fieldNumber, value) {
    return this.internal_addAllElements_(
        fieldNumber, value, FieldAccessor.addAllLongElements);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllInt52LongElements(fieldNumber, value) {
    return this.internal_addAllElements_(
        fieldNumber, value, FieldAccessor.addAllInt52LongElements);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setLongField(fieldNumber, value) {
    return this.internal_setField_(fieldNumber, value, FieldAccessor.setLong);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setLongIterable(fieldNumber, value) {
    return this.internal_setIterable_(
        fieldNumber, value, FieldAccessor.setLongIterable);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setInt52LongField(fieldNumber, value) {
    return this.internal_setField_(
        fieldNumber, value, FieldAccessor.setInt52Long);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<!Long>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setInt52LongIterable(fieldNumber, value) {
    return this.internal_setIterable_(
        fieldNumber, value, FieldAccessor.setInt52LongIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setLongElement(fieldNumber, elementIndex, value) {
    return this.internal_setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setLongElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {!Long} value
   * @protected
   * @return {BUILDER}
   */
  internal_setInt52LongElement(fieldNumber, elementIndex, value) {
    return this.internal_setElement_(
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
   * @param {!InternalMessage|!InternalMessage.Builder} value
   * @protected
   * @return {BUILDER}
   */
  internal_addMessageElement(fieldNumber, value) {
    if (value instanceof Message.Builder) {
      value = value.build();
    }
    const messageData = value.data_;
    return this.internal_addElement_(
        fieldNumber, messageData, FieldAccessor.addMessageElement);
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
    return this.message.internal_getMessageField(fieldNumber, ctor);
  }

  /**
   * @param {number} fieldNumber
   * @param {function(new:T, !Array<*>)} ctor
   * @protected
   * @template T
   * @return {!Iterable<T>}
   */
  internal_getRepeatedMessageField(fieldNumber, ctor) {
    return this.message.internal_getRepeatedMessageField(fieldNumber, ctor);
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
    return this.message.internal_getMessageElement(
        fieldNumber, elementIndex, ctor);
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
    const messageData = value.data_;
    return this.internal_setField_(
        fieldNumber, value, (data, index) => data[index] = messageData);
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
    const messageData = value.data_;
    return this.internal_setElement_(
        fieldNumber, elementIndex, messageData,
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
   * @protected
   * @return {BUILDER}
   */
  internal_addStringElement(fieldNumber, value) {
    return this.internal_addElement_(
        fieldNumber, value, FieldAccessor.addStringElement);
  }

  /**
   * @param {number} fieldNumber
   * @param {!Iterable<string>} value
   * @protected
   * @return {BUILDER}
   */
  internal_addAllStringElements(fieldNumber, value) {
    return this.internal_addAllElements_(
        fieldNumber, value, FieldAccessor.addAllStringElements);
  }


  /**
   * @param {number} fieldNumber
   * @param {string} value
   * @protected
   * @return {BUILDER}
   */
  internal_setStringField(fieldNumber, value) {
    return this.internal_setField_(fieldNumber, value, FieldAccessor.setString);
  }


  /**
   * @param {number} fieldNumber
   * @param {!Iterable<string>} value
   * @protected
   * @return {BUILDER}
   */
  internal_setStringIterable(fieldNumber, value) {
    return this.internal_setIterable_(
        fieldNumber, value, FieldAccessor.setStringIterable);
  }


  /**
   * @param {number} fieldNumber
   * @param {number} elementIndex
   * @param {string} value
   * @protected
   * @return {BUILDER}
   */
  internal_setStringElement(fieldNumber, elementIndex, value) {
    return this.internal_setElement_(
        fieldNumber, elementIndex, value, FieldAccessor.setStringElement);
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  // String accessors for builder stop
  //
  //////////////////////////////////////////////////////////////////////////////
};


/**
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
