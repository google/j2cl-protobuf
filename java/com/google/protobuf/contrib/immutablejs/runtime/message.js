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

goog.module('proto.im.Message');

const ListView = goog.require('proto.im.ListView');

/**
 * Base class for all immutable proto messages.
 * @abstract
 * @template MESSAGE
 * @template BUILDER
 */
class Message {
  /**
   * Returns the internal JSON representation of a proto in JSPB wire format.
   * The return value of this method should not be used directly but rather be
   * treated as an opaque value that can be send to the server or be used to
   * construct another proto.
   * @return {string}
   * @abstract
   */
  serialize() {}

  /**
   * Returns a parser that takes a JSPB wire format string and returns a new
   * message of the same type as this message.
   * @return {function(string):MESSAGE}
   * @abstract
   */
  getParserForType() {}

  /**
   * Get an instance of the type with no fields set.
   * @return {!MESSAGE}
   * @abstract
   */
  getDefaultInstanceForType() {}

  /**
   * Returns true for any proto that is a message of the same type and contains
   * identical values.
   * @param {*} other
   * @return {boolean}
   * @abstract
   */
  equals(other) {}

  /**
   * Returns a number (int32) that is suitable for use in hashed structures.
   * @return {number}
   * @abstract
   */
  hashCode() {}

  /**
   * Returns a builder initialized with the values of this message.
   * @return {BUILDER}
   * @abstract
   */
  toBuilder() {}

  /**
   * Gets the value of an extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {T}
   * @template T
   * @abstract
   */
  getExtension(extensionInfo) {}

  /**
   * Returns the element at the specified position of the repeated extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {number} index
   * @return {T}
   * @template T
   * @abstract
   */
  getExtensionAtIndex(extensionInfo, index) {}

  /**
   * Returns the number of elements in a repeated extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @return {number}
   * @template T
   * @abstract
   */
  getExtensionCount(extensionInfo) {}

  /**
   * Returns true if a singular extension is present.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {boolean}
   * @template T
   * @abstract
   */
  hasExtension(extensionInfo) {}
}


/**
 * Base class for all immutable proto builders.
 * @template MESSAGE
 * @template BUILDER
 * @abstract
 */
Message.Builder = class {
  /**
   * Constructs the message based on the state of the Builder. Subsequent
   * changes to the Builder will not affect the returned message.
   * @return {MESSAGE}
   * @abstract
   */
  build() {}

  /**
   * Clones the Builder.
   * @return {BUILDER} A copy of this builder.
   * @abstract
   */
  clone() {}

  /**
   * Appends a value to a repeated extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {T} value
   * @return {BUILDER}
   * @template T
   * @abstract
   */
  addExtension(extensionInfo, value) {}

  /**
   * Clears an extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {BUILDER}
   * @template T
   * @abstract
   */
  clearExtension(extensionInfo) {}

  /**
   * Gets the value of an extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {T}
   * @template T
   * @abstract
   */
  getExtension(extensionInfo) {}

  /**
   * Returns the element at the specified position of the repeated extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {number} index
   * @return {T}
   * @template T
   * @abstract
   */
  getExtensionAtIndex(extensionInfo, index) {}

  /**
   * Returns the number of elements in a repeated extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @return {number}
   * @template T
   * @abstract
   */
  getExtensionCount(extensionInfo) {}

  /**
   * Returns true if a singular extension is present.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @return {boolean}
   * @template T
   * @abstract
   */
  hasExtension(extensionInfo) {}

  /**
   * Sets the value of an extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, T>} extensionInfo
   * @param {T} value
   * @return {BUILDER}
   * @template T
   * @abstract
   */
  setExtension(extensionInfo, value) {}

  /**
   * Sets the element at the specified position of the repeated extension.
   * @param {!Message.ExtensionFieldInfo<MESSAGE, !ListView<T>>} extensionInfo
   * @param {number} index
   * @param {T} value
   * @return {BUILDER}
   * @template T
   * @abstract
   */
  setExtensionAtIndex(extensionInfo, index, value) {}
};


/**
 * @template TARGET_MESSAGE
 * @template T
 * @interface
 */
Message.ExtensionFieldInfo = class {
};

exports = Message;
