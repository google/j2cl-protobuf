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

/**
 * @fileoverview Utilities to debug JSPB based proto objects.
 */

goog.module('proto.im.debug');

const ByteString = goog.require('proto.im.ByteString');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const Message = goog.require('proto.im.Message');
const asserts = goog.require('goog.asserts');

/**
 * Turns a proto into a human readable object that can i.e. be written to the
 * console: `console.log(dump(myProto))`.
 * This function makes a best effort and may not work in all cases. Since it
 * will not work in compiled code or non-debug mode, it will fail-fast.
 * @param {!Message} message A Message.
 * @return {!Object}
 */
function dump(message) {
  if (!goog.DEBUG || COMPILED) {
    throw new Error('Only use dump when debugging is enabled without compilation.');
  }
  // The type when using a Message will be Object but closure sadly doesn't have
  // conditional types to enforce this at compile time.
  return /** @type{!Object} */ (dump_(message));
}

/**
 * Recursively introspects a message and the values its getters return to
 * make a best effort in creating a human readable representation of the
 * message.
 * @param {!Message|!ListView|!ByteString|!Int8Array|!Long|!Array|number|string|boolean|undefined|null}
 *     thing A Message, ListView, ByteString or primitive type to dump.
 * @return {!Object|number|string|boolean|undefined|null}
 * @private
 */
function dump_(thing) {
  const type = goog.typeOf(thing);
  if (type == 'number' || type == 'string' || type == 'boolean' ||
      type == 'null' || type == 'undefined') {
    return thing;
  }

  if (thing instanceof Long) {
    return thing.toString();
  }

  if (typeof thing[Symbol.iterator] === 'function') {
    return Array.from(/** @type{!Iterable<?>} */ (thing)).map(value => dump_(value));
  }

  if (thing instanceof ByteString) {
    return dump_(thing.toInt8Array());
  }

  asserts.assert(thing instanceof Message, 'Only messages expected: ' + thing);
  const ctor = thing.constructor;
  const messageName = ctor.name || ctor.displayName;
  const object = /** @type{!Object} */ (new class {
    /**
     * @return {string}
     * @override
     */
    toString() {
      return JSON.stringify(this);
    }
  });
  object['$name'] = messageName;
  for (let name of Object.getOwnPropertyNames(ctor.prototype)) {
    const match = /^get([A-Z]\w*)/.exec(name);
    if (match && name != 'getExtension' &&
        name != 'getDefaultInstanceForType') {
      // Handle repeated fields.
      // We say that a field foo is repeated if the prototype contains:
      // 1. getFoo();
      // 2. getFooCount();
      // 3. getFooList();
      // We only care about getFooList() for printing so we just process that
      // one.
      if (ctor.prototype.hasOwnProperty(name + 'List') &&
          ctor.prototype.hasOwnProperty(name + 'Count')) {
        continue;
      }
      if (name.endsWith('Count') &&
          ctor.prototype.hasOwnProperty(name.replace('Count', 'List')) &&
          ctor.prototype.hasOwnProperty(name.replace('Count', ''))) {
        continue;
      }
      // Handle map fields.
      // We say that a field foo is a map if the prototype contains:
      // 1. getFooOrThrow()/getFooOrDefault();
      // 2. getFooCount();
      // 3. getFooMap();
      // We only care about getFooMap() for printing so we just process that
      // one.
      if (name.endsWith('OrThrow') &&
          ctor.prototype.hasOwnProperty(name.replace('OrThrow', 'OrDefault')) &&
          ctor.prototype.hasOwnProperty(name.replace('OrThrow', 'Count'))) {
        continue;
      }
      if (name.endsWith('OrDefault') &&
          ctor.prototype.hasOwnProperty(name.replace('OrDefault', 'OrThrow')) &&
          ctor.prototype.hasOwnProperty(name.replace('OrDefault', 'Count'))) {
        continue;
      }
      if (name.endsWith('Count') &&
          ctor.prototype.hasOwnProperty(name.replace('Count', 'OrThrow')) &&
          ctor.prototype.hasOwnProperty(name.replace('Count', 'OrDefault'))) {
        continue;
      }
      const hasName = 'has' + match[1];
      // Cast because we need to do dict access on the object.
      const message = /** @type{!Object} */ (thing);
      if (!message[hasName] || message[hasName]()) {
        const val = message[name]();
        object[formatFieldName_(match[1])] = dump_(val);
      }
    }
  }
  return object;
}


/**
 * Formats a field name for output as camelCase.
 *
 * @param {string} name Name of the field.
 * @return {string}
 * @private
 */
function formatFieldName_(name) {
  // Name may be in TitleCase.
  return name.replace(/^[A-Z]/, c => {
    return c.toLowerCase();
  });
}

exports = {dump};
