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

goog.module('proto.im.integration.IntFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');

const PROTO_DEFAULT_VALUE = 135;

class IntFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(0, TestProto.newBuilder().build().getOptionalInt());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalInt());
  }

  testOptionalFieldNoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalInt(8964);
    assertEqualsForProto(true, builder.hasOptionalInt());
    assertEqualsForProto(8964, builder.getOptionalInt());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalInt());
    assertEqualsForProto(8964, proto.getOptionalInt());
  }

  testOptionalFieldNoDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalInt(0);
    assertEqualsForProto(true, builder.hasOptionalInt());
    assertEqualsForProto(0, builder.getOptionalInt());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalInt());
    assertEqualsForProto(0, proto.getOptionalInt());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto = TestProto.newBuilder().setOptionalInt(8964).build();

    const builder = startProto.toBuilder();
    builder.clearOptionalInt();
    assertEqualsForProto(false, builder.hasOptionalInt());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalInt());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE,
        TestProto.newBuilder().build().getOptionalIntWithDefault());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalIntWithDefault());

    const builder =
        TestProto.newBuilder().setOptionalIntWithDefault(PROTO_DEFAULT_VALUE);
    assertEqualsForProto(true, builder.hasOptionalIntWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, builder.getOptionalIntWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalIntWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, proto.getOptionalIntWithDefault());
  }

  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalIntWithDefault(246);
    assertEqualsForProto(true, builder.hasOptionalIntWithDefault());
    assertEqualsForProto(246, builder.getOptionalIntWithDefault());


    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalIntWithDefault());
    assertEqualsForProto(246, proto.getOptionalIntWithDefault());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedIntCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedIntList().size());
    assertThrows(() => TestProto.newBuilder().build().getRepeatedInt(0));
  }

  testRepeatedField_add() {
    const builder =
        TestProto.newBuilder().addRepeatedInt(13).addRepeatedInt(24);
    assertEqualsForProto(2, builder.getRepeatedIntCount());
    assertEqualsForProto([13, 24], builder.getRepeatedIntList().toArray());


    const proto = builder.build();
    assertEqualsForProto(2, proto.getRepeatedIntCount());
    assertEqualsForProto([13, 24], proto.getRepeatedIntList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto =
        TestProto.newBuilder().addRepeatedInt(13).addRepeatedInt(24).build();
    const builder =
        startProto.toBuilder().addAllRepeatedInt(ListView.copyOf([-1, -2, -3]));
    assertEqualsForProto(5, builder.getRepeatedIntCount());
    assertEqualsForProto(
        [13, 24, -1, -2, -3], builder.getRepeatedIntList().toArray());
    assertEqualsForProto(13, builder.getRepeatedInt(0));
    assertEqualsForProto(24, builder.getRepeatedInt(1));
    assertEqualsForProto(-1, builder.getRepeatedInt(2));
    assertEqualsForProto(-2, builder.getRepeatedInt(3));
    assertEqualsForProto(-3, builder.getRepeatedInt(4));

    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedIntCount());
    assertEqualsForProto(
        [13, 24, -1, -2, -3], proto.getRepeatedIntList().toArray());
    assertEqualsForProto(13, proto.getRepeatedInt(0));
    assertEqualsForProto(24, proto.getRepeatedInt(1));
    assertEqualsForProto(-1, proto.getRepeatedInt(2));
    assertEqualsForProto(-2, proto.getRepeatedInt(3));
    assertEqualsForProto(-3, proto.getRepeatedInt(4));
  }

  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedInt(13)
                           .addRepeatedInt(24)
                           .addRepeatedInt(-1)
                           .addRepeatedInt(-2)
                           .addRepeatedInt(-3)
                           .build();
    const builder = startProto.toBuilder().setRepeatedInt(2, 333);
    assertEqualsForProto(
        [13, 24, 333, -2, -3], builder.getRepeatedIntList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [13, 24, 333, -2, -3], proto.getRepeatedIntList().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedInt(13)
                        .addRepeatedInt(24)
                        .addRepeatedInt(-1)
                        .addRepeatedInt(-2)
                        .addRepeatedInt(-3);

    assertEqualsForProto(5, builder.getRepeatedIntCount());
    assertEqualsForProto(13, builder.getRepeatedInt(0));
    assertEqualsForProto(24, builder.getRepeatedInt(1));
    assertEqualsForProto(-1, builder.getRepeatedInt(2));
    assertEqualsForProto(-2, builder.getRepeatedInt(3));
    assertEqualsForProto(-3, builder.getRepeatedInt(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedInt(5));
    } else {
      assertEqualsForProto(0, builder.getRepeatedInt(5));
    }


    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedIntCount());
    assertEqualsForProto(13, proto.getRepeatedInt(0));
    assertEqualsForProto(24, proto.getRepeatedInt(1));
    assertEqualsForProto(-1, proto.getRepeatedInt(2));
    assertEqualsForProto(-2, proto.getRepeatedInt(3));
    assertEqualsForProto(-3, proto.getRepeatedInt(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedInt(5));
    } else {
      assertEqualsForProto(0, proto.getRepeatedInt(5));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedInt(13)
                           .addRepeatedInt(24)
                           .addRepeatedInt(-1)
                           .addRepeatedInt(-2)
                           .addRepeatedInt(-3)
                           .build();

    const builder = startProto.toBuilder().clearRepeatedInt();
    assertEqualsForProto(0, builder.getRepeatedIntCount());
    assertEqualsForProto(0, builder.getRepeatedIntList().size());

    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedIntCount());
    assertEqualsForProto(0, proto.getRepeatedIntList().size());
  }
}

testSuite(new IntFieldsTest());
