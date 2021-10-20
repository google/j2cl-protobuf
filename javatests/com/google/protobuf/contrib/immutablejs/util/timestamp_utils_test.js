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

goog.module('proto.im.util.TimestampUtilsTest');
goog.setTestOnly();

const Long = goog.require('goog.math.Long');
const Timestamp = goog.require('improto.google.protobuf.Timestamp');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {fromDate, toDate} = goog.require('proto.im.util.timestamp_utils');


class TimestampUtilsTest {
  testFromDate() {
    const date = new Date('December 17, 1995 13:24:12:50');
    const timestamp = fromDate(date);
    assertEqualsForProto(50000000, timestamp.getNanos());
    assertEqualsForProto(Long.fromNumber(819235452), timestamp.getSeconds());
    assertEquals(date.getTime(), toDate(timestamp).getTime());
  }

  testToDate() {
    const timestamp = Timestamp.newBuilder()
                          .setNanos(50000000)
                          .setSeconds(Long.fromNumber(819235452))
                          .build();
    const date = toDate(timestamp);
    assertEquals(
        new Date('December 17, 1995 13:24:12:50').getTime(), date.getTime());
  }
}

testSuite(new TimestampUtilsTest());
