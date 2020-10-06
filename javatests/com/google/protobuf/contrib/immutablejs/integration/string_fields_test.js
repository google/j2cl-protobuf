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

goog.module('proto.im.integration.StringFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


const PROTO_DEFAULT_VALUE = 'non-trivial default';


class StringFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalString());
    assertEqualsForProto(
        '', TestProto.newBuilder().build().getOptionalString());
  }

  testOptionalFieldNoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalString('two');
    assertEqualsForProto(true, builder.hasOptionalString());
    assertEqualsForProto('two', builder.getOptionalString());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalString());
    assertEqualsForProto('two', proto.getOptionalString());
  }

  testOptionalFieldNoDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalString('');
    assertEqualsForProto(true, builder.hasOptionalString());
    assertEqualsForProto('', builder.getOptionalString());


    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalString());
    assertEqualsForProto('', proto.getOptionalString());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto = TestProto.newBuilder().setOptionalString('two').build();
    const builder = startProto.toBuilder();
    builder.clearOptionalString();
    assertEqualsForProto(false, builder.hasOptionalString());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalString());
  }

  testOptionalFieldWithDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalStringWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE,
        TestProto.newBuilder().build().getOptionalStringWithDefault());
  }

  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalStringWithDefault('two');
    assertEqualsForProto(true, builder.hasOptionalStringWithDefault());
    assertEqualsForProto('two', builder.getOptionalStringWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalStringWithDefault());
    assertEqualsForProto('two', proto.getOptionalStringWithDefault());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalStringWithDefault(
        PROTO_DEFAULT_VALUE);
    assertEqualsForProto(true, builder.hasOptionalStringWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, builder.getOptionalStringWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalStringWithDefault());
    assertEqualsForProto(
        PROTO_DEFAULT_VALUE, proto.getOptionalStringWithDefault());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedStringCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedStringList().size());

    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedString(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedString(0));
    }
  }

  testRepeatedField_add() {
    const builder =
        TestProto.newBuilder().addRepeatedString('two').addRepeatedString(
            'five');
    assertEqualsForProto(
        ['two', 'five'], builder.getRepeatedStringList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        ['two', 'five'], proto.getRepeatedStringList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedString('two')
                           .addRepeatedString('five')
                           .build();

    const builder = startProto.toBuilder().addAllRepeatedString(
        ListView.copyOf(['one', 'two', 'three']));
    assertEqualsForProto(
        ['two', 'five', 'one', 'two', 'three'],
        builder.getRepeatedStringList().toArray());
    const proto = builder.build();
    assertEqualsForProto(
        ['two', 'five', 'one', 'two', 'three'],
        proto.getRepeatedStringList().toArray());
  }
  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedString('two')
                           .addRepeatedString('five')
                           .addRepeatedString('one')
                           .addRepeatedString('two')
                           .addRepeatedString('three')
                           .build();

    const builder = startProto.toBuilder().setRepeatedString(2, 'six');
    assertEqualsForProto(
        ['two', 'five', 'six', 'two', 'three'],
        builder.getRepeatedStringList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        ['two', 'five', 'six', 'two', 'three'],
        proto.getRepeatedStringList().toArray());
  }

  testRepeatedField_getAndCount() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedString('two')
                           .addRepeatedString('five')
                           .addRepeatedString('one')
                           .addRepeatedString('two')
                           .addRepeatedString('three')
                           .build();
    const builder = startProto.toBuilder();
    assertEqualsForProto(5, builder.getRepeatedStringCount());

    assertEqualsForProto('two', builder.getRepeatedString(0));
    assertEqualsForProto('five', builder.getRepeatedString(1));
    assertEqualsForProto('one', builder.getRepeatedString(2));
    assertEqualsForProto('two', builder.getRepeatedString(3));
    assertEqualsForProto('three', builder.getRepeatedString(4));

    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedString(5));
    } else {
      assertUndefined(builder.getRepeatedString(5));
    }

    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedStringCount());
    assertEqualsForProto('two', proto.getRepeatedString(0));
    assertEqualsForProto('five', proto.getRepeatedString(1));
    assertEqualsForProto('one', proto.getRepeatedString(2));
    assertEqualsForProto('two', proto.getRepeatedString(3));
    assertEqualsForProto('three', proto.getRepeatedString(4));

    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedString(5));
    } else {
      assertUndefined(proto.getRepeatedString(5));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedString('two')
                           .addRepeatedString('five')
                           .addRepeatedString('one')
                           .addRepeatedString('two')
                           .addRepeatedString('three')
                           .build();

    const builder = startProto.toBuilder().clearRepeatedString();
    assertEqualsForProto(0, builder.getRepeatedStringCount());
    assertEqualsForProto(0, builder.getRepeatedStringList().size());


    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedStringCount());
    assertEqualsForProto(0, proto.getRepeatedStringList().size());
  }
}

testSuite(new StringFieldsTest());
