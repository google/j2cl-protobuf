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

goog.module('proto.im.integration.UInt32FieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const TestProto3 = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto3');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto, assertValueIsCleared, assertValueIsSet} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');

const PROTO_DEFAULT_VALUE = -1;

class UInt32FieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(0, TestProto.newBuilder().build().getOptionalUint32());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalUint32());
  }

  testOptionalFieldNoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalUint32(8964);
    assertEqualsForProto(true, builder.hasOptionalUint32());
    assertEqualsForProto(8964, builder.getOptionalUint32());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint32());
    assertEqualsForProto(8964, proto.getOptionalUint32());
  }

  testOptionalFieldNoDefault_setUIntValue() {
    const builder = TestProto.newBuilder();

    builder.setOptionalUint32(4294967295);
    assertEqualsForProto(true, builder.hasOptionalUint32());
    assertEqualsForProto(-1, builder.getOptionalUint32());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint32());
    assertEqualsForProto(-1, proto.getOptionalUint32());
  }

  testOptionalFieldNoDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalUint32(0);
    assertEqualsForProto(true, builder.hasOptionalUint32());
    assertEqualsForProto(0, builder.getOptionalUint32());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint32());
    assertEqualsForProto(0, proto.getOptionalUint32());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto = TestProto.newBuilder().setOptionalUint32(8964).build();

    const builder = startProto.toBuilder();
    builder.clearOptionalUint32();
    assertEqualsForProto(false, builder.hasOptionalUint32());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalUint32());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE,
        TestProto.newBuilder().build().getOptionalUint32WithDefault());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalUint32WithDefault());

    const builder = TestProto.newBuilder().setOptionalUint32WithDefault(
        PROTO_DEFAULT_VALUE);
    assertEqualsForProto(true, builder.hasOptionalUint32WithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, builder.getOptionalUint32WithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint32WithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, proto.getOptionalUint32WithDefault());
  }

  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalUint32WithDefault(246);
    assertEqualsForProto(true, builder.hasOptionalUint32WithDefault());
    assertEqualsForProto(246, builder.getOptionalUint32WithDefault());


    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint32WithDefault());
    assertEqualsForProto(246, proto.getOptionalUint32WithDefault());
  }

  testFieldWithDefault_serialization() {
    assertValueIsSet(TestProto.newBuilder().setOptionalUint32(0).build());

    const proto3builder = TestProto3.newBuilder();
    assertValueIsCleared(proto3builder.setProto3Uint32(0).build());
    assertValueIsSet(proto3builder.setProto3Uint32(1).build());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedUint32Count());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedUint32List().size());
    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedUint32(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedUint32(0));
    }
  }

  testRepeatedField_add() {
    const builder =
        TestProto.newBuilder().addRepeatedUint32(13).addRepeatedUint32(24);
    assertEqualsForProto(2, builder.getRepeatedUint32Count());
    assertEqualsForProto([13, 24], builder.getRepeatedUint32List().toArray());


    const proto = builder.build();
    assertEqualsForProto(2, proto.getRepeatedUint32Count());
    assertEqualsForProto([13, 24], proto.getRepeatedUint32List().toArray());
  }

  testRepeatedField_addUIntValue() {
    const builder = TestProto.newBuilder();

    builder.addRepeatedUint32(4294967295);
    assertEqualsForProto(1, builder.getRepeatedUint32Count());
    assertEqualsForProto([-1], builder.getRepeatedUint32List().toArray());

    const proto = builder.build();
    assertEqualsForProto(1, proto.getRepeatedUint32Count());
    assertEqualsForProto([-1], proto.getRepeatedUint32List().toArray());
  }

  testRepeatedField_addAll() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedUint32(13)
                           .addRepeatedUint32(24)
                           .build();
    const builder = startProto.toBuilder().addAllRepeatedUint32(
        ListView.copyOf([-1, -2, -3]));
    assertEqualsForProto(5, builder.getRepeatedUint32Count());
    assertEqualsForProto(
        [13, 24, -1, -2, -3], builder.getRepeatedUint32List().toArray());
    assertEqualsForProto(13, builder.getRepeatedUint32(0));
    assertEqualsForProto(24, builder.getRepeatedUint32(1));
    assertEqualsForProto(-1, builder.getRepeatedUint32(2));
    assertEqualsForProto(-2, builder.getRepeatedUint32(3));
    assertEqualsForProto(-3, builder.getRepeatedUint32(4));

    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedUint32Count());
    assertEqualsForProto(
        [13, 24, -1, -2, -3], proto.getRepeatedUint32List().toArray());
    assertEqualsForProto(13, proto.getRepeatedUint32(0));
    assertEqualsForProto(24, proto.getRepeatedUint32(1));
    assertEqualsForProto(-1, proto.getRepeatedUint32(2));
    assertEqualsForProto(-2, proto.getRepeatedUint32(3));
    assertEqualsForProto(-3, proto.getRepeatedUint32(4));
  }

  testRepeatedField_addAllWithUIntValue() {
    const builder = TestProto.newBuilder();

    builder.addAllRepeatedUint32(ListView.copyOf([4294967295, 2, 3]));
    assertEqualsForProto(3, builder.getRepeatedUint32Count());
    assertEqualsForProto([-1, 2, 3], builder.getRepeatedUint32List().toArray());
    assertEqualsForProto(-1, builder.getRepeatedUint32(0));
    assertEqualsForProto(2, builder.getRepeatedUint32(1));
    assertEqualsForProto(3, builder.getRepeatedUint32(2));


    const proto = builder.build();
    assertEqualsForProto(3, proto.getRepeatedUint32Count());
    assertEqualsForProto([-1, 2, 3], proto.getRepeatedUint32List().toArray());
    assertEqualsForProto(-1, proto.getRepeatedUint32(0));
    assertEqualsForProto(2, proto.getRepeatedUint32(1));
    assertEqualsForProto(3, proto.getRepeatedUint32(2));
  }

  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedUint32(13)
                           .addRepeatedUint32(24)
                           .addRepeatedUint32(-1)
                           .addRepeatedUint32(-2)
                           .addRepeatedUint32(-3)
                           .build();
    const builder = startProto.toBuilder().setRepeatedUint32(2, 333);
    assertEqualsForProto(
        [13, 24, 333, -2, -3], builder.getRepeatedUint32List().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [13, 24, 333, -2, -3], proto.getRepeatedUint32List().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedUint32(13)
                        .addRepeatedUint32(24)
                        .addRepeatedUint32(-1)
                        .addRepeatedUint32(-2)
                        .addRepeatedUint32(-3);

    assertEqualsForProto(5, builder.getRepeatedUint32Count());
    assertEqualsForProto(13, builder.getRepeatedUint32(0));
    assertEqualsForProto(24, builder.getRepeatedUint32(1));
    assertEqualsForProto(-1, builder.getRepeatedUint32(2));
    assertEqualsForProto(-2, builder.getRepeatedUint32(3));
    assertEqualsForProto(-3, builder.getRepeatedUint32(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedUint32(5));
    } else {
      assertUndefined(builder.getRepeatedUint32(5));
    }


    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedUint32Count());
    assertEqualsForProto(13, proto.getRepeatedUint32(0));
    assertEqualsForProto(24, proto.getRepeatedUint32(1));
    assertEqualsForProto(-1, proto.getRepeatedUint32(2));
    assertEqualsForProto(-2, proto.getRepeatedUint32(3));
    assertEqualsForProto(-3, proto.getRepeatedUint32(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedUint32(5));
    } else {
      assertUndefined(proto.getRepeatedUint32(5));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedUint32(13)
                           .addRepeatedUint32(24)
                           .addRepeatedUint32(-1)
                           .addRepeatedUint32(-2)
                           .addRepeatedUint32(-3)
                           .build();

    const builder = startProto.toBuilder().clearRepeatedUint32();
    assertEqualsForProto(0, builder.getRepeatedUint32Count());
    assertEqualsForProto(0, builder.getRepeatedUint32List().size());

    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedUint32Count());
    assertEqualsForProto(0, proto.getRepeatedUint32List().size());
  }
}

testSuite(new UInt32FieldsTest());
