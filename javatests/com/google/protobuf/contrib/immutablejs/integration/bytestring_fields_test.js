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

goog.module('proto.im.integration.ByteStringFieldsTest');
goog.setTestOnly();

const ByteString = goog.require('proto.im.ByteString');
const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


const TEST_STRING = ByteString.copyFrom([1, 2, 3, 4]);
const DEFAULT_VALUE = ByteString.copyFrom(stringToBytes('a bytey default'));

/**
 * Converts a string into an array of char codes.
 *
 * Only works for ascii strings
 *
 * @param {string }val
 * @return {!Array<number>}
 */
function stringToBytes(val) {
  const result = [];
  for (let i = 0; i < val.length; i++) {
    result.push(val.charCodeAt(i));
  }
  return result;
}

class ByteStringFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(
        ByteString.EMPTY, TestProto.newBuilder().build().getOptionalBytes());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalBytes());
  }

  testOptionalFieldNoDefault_setTestBytes() {
    const builder = TestProto.newBuilder().setOptionalBytes(TEST_STRING);
    assertEqualsForProto(true, builder.hasOptionalBytes());
    assertEqualsForProto(TEST_STRING, builder.getOptionalBytes());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBytes());
    assertEqualsForProto(TEST_STRING, proto.getOptionalBytes());
  }

  testOptionalFieldNoDefault_setEmptyBytes() {
    const builder = TestProto.newBuilder().setOptionalBytes(ByteString.EMPTY);
    assertEqualsForProto(true, builder.hasOptionalBytes());
    assertEqualsForProto(ByteString.EMPTY, builder.getOptionalBytes());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBytes());
    assertEqualsForProto(ByteString.EMPTY, proto.getOptionalBytes());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto =
        TestProto.newBuilder().setOptionalBytes(TEST_STRING).build();

    // Test clear
    const builder = startProto.toBuilder();
    builder.clearOptionalBytes();
    assertEqualsForProto(false, builder.hasOptionalBytes());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalBytes());
  }

  testOptionalFieldWithDefault_defaultInstance() {
    assertEqualsForProto(
        DEFAULT_VALUE,
        TestProto.newBuilder().build().getOptionalBytesWithDefault());

    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalBytesWithDefault());
  }

  testOptionalFieldWithDefault_setDefault() {
    const builder =
        TestProto.newBuilder().setOptionalBytesWithDefault(DEFAULT_VALUE);
    assertEqualsForProto(true, builder.hasOptionalBytesWithDefault());
    assertEqualsForProto(DEFAULT_VALUE, builder.getOptionalBytesWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBytesWithDefault());
    assertEqualsForProto(DEFAULT_VALUE, proto.getOptionalBytesWithDefault());
  }

  testOptionalFieldWithDefault_clear() {
    const builder =
        TestProto.newBuilder().setOptionalBytesWithDefault(TEST_STRING);
    assertEqualsForProto(true, builder.hasOptionalBytesWithDefault());
    assertEqualsForProto(TEST_STRING, builder.getOptionalBytesWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBytesWithDefault());
    assertEqualsForProto(TEST_STRING, proto.getOptionalBytesWithDefault());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedBytesCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedBytesList().size());
    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedBytes(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedBytes(0));
    }
  }

  testRepeatedField_add() {
    const builder = TestProto.newBuilder()
                        .addRepeatedBytes(TEST_STRING)
                        .addRepeatedBytes(ByteString.EMPTY);
    assertEqualsForProto(2, builder.getRepeatedBytesCount());
    assertEqualsForProto(
        [TEST_STRING, ByteString.EMPTY],
        builder.getRepeatedBytesList().toArray());

    const proto = builder.build();
    assertEqualsForProto(2, proto.getRepeatedBytesCount());
    assertEqualsForProto(
        [TEST_STRING, ByteString.EMPTY],
        proto.getRepeatedBytesList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedBytes(TEST_STRING)
                           .addRepeatedBytes(ByteString.EMPTY)
                           .build();

    // test addAll
    const builder = startProto.toBuilder().addAllRepeatedBytes(ListView.copyOf([
      ByteString.copyFrom([1, 2, 3]), ByteString.copyFrom([4, 5, 6]),
      ByteString.copyFrom([7, 8, 9])
    ]));

    assertEqualsForProto(5, builder.getRepeatedBytesCount());
    assertEqualsForProto(
        [
          TEST_STRING, ByteString.EMPTY, ByteString.copyFrom([1, 2, 3]),
          ByteString.copyFrom([4, 5, 6]), ByteString.copyFrom([7, 8, 9])
        ],
        builder.getRepeatedBytesList().toArray());
    assertEqualsForProto(TEST_STRING, builder.getRepeatedBytes(0));
    assertEqualsForProto(ByteString.EMPTY, builder.getRepeatedBytes(1));
    assertEqualsForProto(
        ByteString.copyFrom([1, 2, 3]), builder.getRepeatedBytes(2));
    assertEqualsForProto(
        ByteString.copyFrom([4, 5, 6]), builder.getRepeatedBytes(3));
    assertEqualsForProto(
        ByteString.copyFrom([7, 8, 9]), builder.getRepeatedBytes(4));


    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedBytesCount());
    assertEqualsForProto(
        [
          TEST_STRING, ByteString.EMPTY, ByteString.copyFrom([1, 2, 3]),
          ByteString.copyFrom([4, 5, 6]), ByteString.copyFrom([7, 8, 9])
        ],
        proto.getRepeatedBytesList().toArray());
    assertEqualsForProto(TEST_STRING, proto.getRepeatedBytes(0));
    assertEqualsForProto(ByteString.EMPTY, proto.getRepeatedBytes(1));
    assertEqualsForProto(
        ByteString.copyFrom([1, 2, 3]), proto.getRepeatedBytes(2));
    assertEqualsForProto(
        ByteString.copyFrom([4, 5, 6]), proto.getRepeatedBytes(3));
    assertEqualsForProto(
        ByteString.copyFrom([7, 8, 9]), proto.getRepeatedBytes(4));
  }

  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedBytes(TEST_STRING)
                           .addRepeatedBytes(ByteString.EMPTY)
                           .addRepeatedBytes(ByteString.copyFrom([0, 0, 0]))
                           .build();

    const builder = startProto.toBuilder().setRepeatedBytes(
        2, ByteString.copyFrom([3, 3, 3]));

    assertEqualsForProto(
        [
          TEST_STRING,
          ByteString.EMPTY,
          ByteString.copyFrom([3, 3, 3]),
        ],
        builder.getRepeatedBytesList().toArray());


    const proto = builder.build();


    assertEqualsForProto(
        [
          TEST_STRING,
          ByteString.EMPTY,
          ByteString.copyFrom([3, 3, 3]),
        ],
        proto.getRepeatedBytesList().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedBytes(TEST_STRING)
                        .addRepeatedBytes(ByteString.EMPTY)
                        .addRepeatedBytes(ByteString.EMPTY);

    assertEqualsForProto(3, builder.getRepeatedBytesCount());
    assertEqualsForProto(TEST_STRING, builder.getRepeatedBytes(0));
    assertEqualsForProto(ByteString.EMPTY, builder.getRepeatedBytes(1));
    assertEqualsForProto(ByteString.EMPTY, builder.getRepeatedBytes(2));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedBytes(3));
    }

    const proto = builder.build();
    assertEqualsForProto(3, proto.getRepeatedBytesCount());
    assertEqualsForProto(TEST_STRING, proto.getRepeatedBytes(0));
    assertEqualsForProto(ByteString.EMPTY, proto.getRepeatedBytes(1));
    assertEqualsForProto(ByteString.EMPTY, proto.getRepeatedBytes(2));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedBytes(3));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedBytes(TEST_STRING)
                           .addRepeatedBytes(ByteString.EMPTY)
                           .addRepeatedBytes(ByteString.copyFrom([0, 0, 0]))
                           .build();

    const builder = startProto.toBuilder().clearRepeatedBytes();
    assertEqualsForProto(0, builder.getRepeatedBytesCount());
    assertEqualsForProto(0, builder.getRepeatedBytesList().size());

    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedBytesCount());
    assertEqualsForProto(0, proto.getRepeatedBytesList().size());
  }
}

testSuite(new ByteStringFieldsTest());
