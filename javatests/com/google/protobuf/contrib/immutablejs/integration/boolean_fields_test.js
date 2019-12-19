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

goog.module('proto.im.integration.BooleanFieldsTest');
goog.setTestOnly();

const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');

class BooleanFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalBool());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().getOptionalBool());
  }

  testOptionalFieldNoDefault_setTrue() {
    const builder = TestProto.newBuilder().setOptionalBool(true);
    assertEqualsForProto(true, builder.hasOptionalBool());
    assertEqualsForProto(true, builder.getOptionalBool());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBool());
    assertEqualsForProto(true, proto.getOptionalBool());
  }

  testOptionalFieldNoDefault_setFalse() {
    const builder = TestProto.newBuilder().setOptionalBool(false);
    assertEqualsForProto(true, builder.hasOptionalBool());
    assertEqualsForProto(false, builder.getOptionalBool());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBool());
    assertEqualsForProto(false, proto.getOptionalBool());
  }

  testOptionalFieldNoDefault_clear() {
    const builder = TestProto.newBuilder().setOptionalBool(true);
    builder.clearOptionalBool();
    assertEqualsForProto(false, builder.hasOptionalBool());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalBool());
  }

  testOptionalFieldWithDefault_setTrue() {
    assertEqualsForProto(
        true, TestProto.newBuilder().build().getOptionalBoolWithDefault());

    const builder = TestProto.newBuilder().setOptionalBoolWithDefault(true);
    assertEqualsForProto(true, builder.getOptionalBoolWithDefault());
    assertEqualsForProto(true, builder.hasOptionalBoolWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBoolWithDefault());
    assertEqualsForProto(true, proto.getOptionalBoolWithDefault());
  }

  testOptionalFieldWithDefault_setFalse() {
    const builder = TestProto.newBuilder().setOptionalBoolWithDefault(false);
    assertEqualsForProto(true, builder.hasOptionalBoolWithDefault());
    assertEqualsForProto(false, builder.getOptionalBoolWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalBoolWithDefault());
    assertEqualsForProto(false, proto.getOptionalBoolWithDefault());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedBoolCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedBoolList().size());

    assertThrows(() => TestProto.newBuilder().build().getRepeatedBool(3));
  }

  testRepeatedField_add() {
    const builder =
        TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false);
    assertEqualsForProto(
        [true, false], builder.getRepeatedBoolList().toArray());

    const proto = builder.build();
    assertEqualsForProto([true, false], proto.getRepeatedBoolList().toArray());
  }

  testRepeatedField_addAll() {
    const proto = TestProto.newBuilder()
                      .addRepeatedBool(true)
                      .addRepeatedBool(false)
                      .build();

    const builder = proto.toBuilder().addAllRepeatedBool(
        ListView.copyOf([false, true, true]));
    assertEqualsForProto(
        [true, false, false, true, true],
        builder.getRepeatedBoolList().toArray());

    const proto2 = builder.build();
    assertEqualsForProto(
        [true, false, false, true, true],
        proto2.getRepeatedBoolList().toArray());
  }

  testRepeatedField_set() {
    const proto = TestProto.newBuilder()
                      .addRepeatedBool(true)
                      .addRepeatedBool(false)
                      .addRepeatedBool(false)
                      .build();

    const builder = proto.toBuilder().setRepeatedBool(2, true);
    assertEqualsForProto(
        [true, false, true], builder.getRepeatedBoolList().toArray());

    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedBool(3));
    } else {
      assertEqualsForProto(false, builder.getRepeatedBool(3));
    }

    const proto2 = builder.build();
    assertEqualsForProto(
        [true, false, true], proto2.getRepeatedBoolList().toArray());

    if (isCheckIndex()) {
      assertThrows(() => proto2.getRepeatedBool(3));
    } else {
      assertEqualsForProto(false, proto2.getRepeatedBool(3));
    }
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedBool(true)
                        .addRepeatedBool(false)
                        .addRepeatedBool(false);

    assertEqualsForProto(3, builder.getRepeatedBoolCount());
    assertEqualsForProto(true, builder.getRepeatedBool(0));
    assertEqualsForProto(false, builder.getRepeatedBool(1));
    assertEqualsForProto(false, builder.getRepeatedBool(2));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedBool(3));
    } else {
      assertEqualsForProto(false, builder.getRepeatedBool(3));
    }

    const proto = builder.build();
    assertEqualsForProto(3, proto.getRepeatedBoolCount());
    assertEqualsForProto(true, proto.getRepeatedBool(0));
    assertEqualsForProto(false, proto.getRepeatedBool(1));
    assertEqualsForProto(false, proto.getRepeatedBool(2));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedBool(3));
    } else {
      assertEqualsForProto(false, proto.getRepeatedBool(3));
    }
  }

  testRepeatedField_clear() {
    const proto = TestProto.newBuilder()
                      .addRepeatedBool(true)
                      .addRepeatedBool(false)
                      .build();

    const builder = proto.toBuilder().clearRepeatedBool();
    assertEqualsForProto(0, builder.getRepeatedBoolCount());
    assertEqualsForProto(0, builder.getRepeatedBoolList().size());

    const proto2 = builder.build();
    assertEqualsForProto(0, proto2.getRepeatedBoolCount());
    assertEqualsForProto(0, proto2.getRepeatedBoolList().size());
  }
}

testSuite(new BooleanFieldsTest());
