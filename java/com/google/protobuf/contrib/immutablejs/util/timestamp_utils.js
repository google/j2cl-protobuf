// Copyright 2021 Google LLC
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
 * @fileoverview Functions to common Timestamp operations.
 */

goog.module('proto.im.util.timestamp_utils');

const Long = goog.require('goog.math.Long');
const Timestamp = goog.require('improto.google.protobuf.Timestamp');

/**
 * Returns a JavaScript 'Date' object corresponding to the given Timestamp.
 * @param {!Timestamp} timestamp The timestamp to convert.
 * @return {!Date}
 */
function toDate(timestamp) {
  const seconds = timestamp.getSeconds().toNumber();
  const nanos = timestamp.getNanos();
  const totalMillis = (seconds * 1000) + (nanos / 1_000_000);
  return new Date(totalMillis);
}

/**
 * Factory method that returns a Timestamp object with value equal to
 * the given Date.
 * @param {!Date} date The value to set.
 * @return {!Timestamp}
 */
function fromDate(date) {
  return Timestamp.newBuilder()
      .setSeconds(Long.fromNumber(date.getTime() / 1000))
      .setNanos(date.getMilliseconds() * 1_000_000)
      .build();
}

exports = {
  toDate,
  fromDate
};
