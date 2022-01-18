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

goog.module('proto.im.integration.FloatFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const TestProto3 = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto3');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto, assertValueIsCleared, assertValueIsSet} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


const PROTO_DEFAULT_VALUE = 1.35;

class FloatFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(0, TestProto.newBuilder().build().getOptionalFloat());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalFloat());
  }

  testOptionalFieldNoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalFloat(89.64);
    assertEqualsForProto(true, builder.hasOptionalFloat());
    assertEqualsForProto(89.64, builder.getOptionalFloat());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFloat());
    assertEqualsForProto(89.64, proto.getOptionalFloat());
  }

  testOptionalFieldNoDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalFloat(0);
    assertEqualsForProto(true, builder.hasOptionalFloat());
    assertEqualsForProto(0, builder.getOptionalFloat());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFloat());
    assertEqualsForProto(0, proto.getOptionalFloat());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto = TestProto.newBuilder().setOptionalFloat(0).build();
    const builder = startProto.toBuilder();
    builder.clearOptionalFloat();
    assertEqualsForProto(false, builder.hasOptionalFloat());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalFloat());
  }

  testOptionalFieldWithDefault_defaultInstance() {
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE,
        TestProto.newBuilder().build().getOptionalFloatWithDefault());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalFloatWithDefault());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    const builder =
        TestProto.newBuilder().setOptionalFloatWithDefault(PROTO_DEFAULT_VALUE);
    assertEqualsForProto(true, builder.hasOptionalFloatWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, builder.getOptionalFloatWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFloatWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, proto.getOptionalFloatWithDefault());
  }

  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalFloatWithDefault(135);
    assertEqualsForProto(true, builder.hasOptionalFloatWithDefault());
    assertEqualsForProto(135, builder.getOptionalFloatWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFloatWithDefault());
    assertEqualsForProto(135, proto.getOptionalFloatWithDefault());
  }

  testFieldWithDefault_serialization() {
    assertValueIsSet(TestProto.newBuilder().setOptionalFloat(0).build());

    const proto3builder = TestProto3.newBuilder();
    assertValueIsCleared(proto3builder.setProto3Float(0).build());
    assertValueIsSet(proto3builder.setProto3Float(1).build());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedFloatCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedFloatList().size());
    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedFloat(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedFloat(0));
    }
  }

  testRepeatedField_add() {
    const builder =
        TestProto.newBuilder().addRepeatedFloat(1.324).addRepeatedFloat(24);
    assertEqualsForProto(2, builder.getRepeatedFloatCount());
    assertEqualsForProto([1.324, 24], builder.getRepeatedFloatList().toArray());


    const proto = builder.build();
    assertEqualsForProto(2, proto.getRepeatedFloatCount());
    assertEqualsForProto([1.324, 24], proto.getRepeatedFloatList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedFloat(1.324)
                           .addRepeatedFloat(24)
                           .build();

    const builder = startProto.toBuilder().addAllRepeatedFloat(
        ListView.copyOf([-1, -2, -3]));
    assertEqualsForProto(
        [1.324, 24, -1, -2, -3], builder.getRepeatedFloatList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [1.324, 24, -1, -2, -3], proto.getRepeatedFloatList().toArray());
  }

  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedFloat(1.324)
                           .addRepeatedFloat(24)
                           .addRepeatedFloat(-1)
                           .addRepeatedFloat(-2)
                           .addRepeatedFloat(-3)
                           .build();

    const builder = startProto.toBuilder().setRepeatedFloat(2, 333);
    assertEqualsForProto(
        [1.324, 24, 333, -2, -3], builder.getRepeatedFloatList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [1.324, 24, 333, -2, -3], proto.getRepeatedFloatList().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedFloat(1.324)
                        .addRepeatedFloat(24)
                        .addRepeatedFloat(-1)
                        .addRepeatedFloat(-2)
                        .addRepeatedFloat(-3);


    assertEqualsForProto(5, builder.getRepeatedFloatCount());
    assertEqualsForProto(1.324, builder.getRepeatedFloat(0));
    assertEqualsForProto(24, builder.getRepeatedFloat(1));
    assertEqualsForProto(-1, builder.getRepeatedFloat(2));
    assertEqualsForProto(-2, builder.getRepeatedFloat(3));
    assertEqualsForProto(-3, builder.getRepeatedFloat(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedFloat(5));
    } else {
      assertUndefined(builder.getRepeatedFloat(5));
    }

    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedFloatCount());

    assertEqualsForProto(1.324, proto.getRepeatedFloat(0));
    assertEqualsForProto(24, proto.getRepeatedFloat(1));
    assertEqualsForProto(-1, proto.getRepeatedFloat(2));
    assertEqualsForProto(-2, proto.getRepeatedFloat(3));
    assertEqualsForProto(-3, proto.getRepeatedFloat(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedFloat(5));
    } else {
      assertUndefined(proto.getRepeatedFloat(5));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedFloat(1.324)
                           .addRepeatedFloat(24)
                           .addRepeatedFloat(-1)
                           .addRepeatedFloat(-2)
                           .addRepeatedFloat(-3)
                           .build();

    const builder = startProto.toBuilder().clearRepeatedFloat();
    assertEqualsForProto(0, builder.getRepeatedFloatCount());
    assertEqualsForProto(0, builder.getRepeatedFloatList().size());


    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedFloatCount());
    assertEqualsForProto(0, proto.getRepeatedFloatList().size());
  }
}

testSuite(new FloatFieldsTest());
