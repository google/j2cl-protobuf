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

goog.module('proto.im.integration.DoubleFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const TestProto3 = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto3');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto, assertValueIsCleared, assertValueIsSet} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


const PROTO_DEFAULT_FLOAT = 2.46;

class DoubleFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(0, TestProto.newBuilder().build().getOptionalDouble());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalDouble());
  }


  testOptionalFieldNoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalDouble(89.64);
    assertEqualsForProto(true, builder.hasOptionalDouble());
    assertEqualsForProto(89.64, builder.getOptionalDouble());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalDouble());
    assertEqualsForProto(89.64, proto.getOptionalDouble());
  }

  testOptionalFieldNoDefault_setDefault() {
    const builder = TestProto.newBuilder().setOptionalDouble(0);
    assertEqualsForProto(true, builder.hasOptionalDouble());
    assertEqualsForProto(0, builder.getOptionalDouble());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalDouble());
    assertEqualsForProto(0, proto.getOptionalDouble());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto = TestProto.newBuilder().setOptionalDouble(1).build();

    // Test clear
    const builder = startProto.toBuilder();
    assertEqualsForProto(true, builder.hasOptionalDouble());
    builder.clearOptionalDouble();
    assertEqualsForProto(false, builder.hasOptionalDouble());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalDouble());
  }

  testOptionalFieldWithDefault_defaultInstance() {
    assertEqualsForProto(
        2.46, TestProto.newBuilder().build().getOptionalDoubleWithDefault());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalDoubleWithDefault());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalDoubleWithDefault(
        PROTO_DEFAULT_FLOAT);
    assertEqualsForProto(true, builder.hasOptionalDoubleWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_FLOAT, builder.getOptionalDoubleWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalDoubleWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_FLOAT, proto.getOptionalDoubleWithDefault());
  }

  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalDoubleWithDefault(246);
    assertEqualsForProto(true, builder.hasOptionalDoubleWithDefault());
    assertEqualsForProto(246, builder.getOptionalDoubleWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalDoubleWithDefault());
    assertEqualsForProto(246, proto.getOptionalDoubleWithDefault());
  }

  testFieldWithDefault_serialization() {
    assertValueIsSet(TestProto.newBuilder().setOptionalDouble(0).build());

    const proto3builder = TestProto3.newBuilder();
    assertValueIsCleared(proto3builder.setProto3Double(0).build());
    assertValueIsSet(proto3builder.setProto3Double(1).build());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedDoubleCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedDoubleList().size());

    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedDouble(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedDouble(0));
    }
  }

  testRepeatedField_add() {
    const builder =
        TestProto.newBuilder().addRepeatedDouble(1.324).addRepeatedDouble(24);
    assertEqualsForProto(
        [1.324, 24], builder.getRepeatedDoubleList().toArray());


    const proto = builder.build();
    assertEqualsForProto([1.324, 24], proto.getRepeatedDoubleList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedDouble(1.324)
                           .addRepeatedDouble(24)
                           .build();

    // test addAll
    const builder = startProto.toBuilder().addAllRepeatedDouble(
        ListView.copyOf([-1, -2, -3]));
    assertEqualsForProto(
        [1.324, 24, -1, -2, -3], builder.getRepeatedDoubleList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [1.324, 24, -1, -2, -3], proto.getRepeatedDoubleList().toArray());
  }

  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedDouble(1.324)
                           .addRepeatedDouble(24)
                           .addRepeatedDouble(-1)
                           .addRepeatedDouble(-2)
                           .addRepeatedDouble(-3)
                           .build();

    const builder = startProto.toBuilder().setRepeatedDouble(2, 333);

    assertEqualsForProto(
        [1.324, 24, 333, -2, -3], builder.getRepeatedDoubleList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [1.324, 24, 333, -2, -3], proto.getRepeatedDoubleList().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedDouble(1.324)
                        .addRepeatedDouble(24)
                        .addRepeatedDouble(-1)
                        .addRepeatedDouble(-2)
                        .addRepeatedDouble(-3);

    assertEqualsForProto(5, builder.getRepeatedDoubleCount());
    assertEqualsForProto(1.324, builder.getRepeatedDouble(0));
    assertEqualsForProto(24, builder.getRepeatedDouble(1));
    assertEqualsForProto(-1, builder.getRepeatedDouble(2));
    assertEqualsForProto(-2, builder.getRepeatedDouble(3));
    assertEqualsForProto(-3, builder.getRepeatedDouble(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedDouble(5));
    } else {
      assertUndefined(builder.getRepeatedDouble(5));
    }

    const proto = builder.build();
    assertEqualsForProto(1.324, proto.getRepeatedDouble(0));
    assertEqualsForProto(24, proto.getRepeatedDouble(1));
    assertEqualsForProto(-1, proto.getRepeatedDouble(2));
    assertEqualsForProto(-2, proto.getRepeatedDouble(3));
    assertEqualsForProto(-3, proto.getRepeatedDouble(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedDouble(5));
    } else {
      assertUndefined(proto.getRepeatedDouble(5));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedDouble(1.324)
                           .addRepeatedDouble(24)
                           .addRepeatedDouble(-1)
                           .addRepeatedDouble(-2)
                           .addRepeatedDouble(-3)
                           .build();

    const builder = startProto.toBuilder().clearRepeatedDouble();
    assertEqualsForProto(0, builder.getRepeatedDoubleCount());
    assertEqualsForProto(0, builder.getRepeatedDoubleList().size());


    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedDoubleCount());
    assertEqualsForProto(0, proto.getRepeatedDoubleList().size());
  }
}

testSuite(new DoubleFieldsTest());
