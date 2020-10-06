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

goog.module('proto.im.integration.LongFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


const DEFAULT_PROTO_VALUE = Long.fromString('3000000000');

class LongFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalLong());
    assertEqualsForProto(
        Long.fromInt(0), TestProto.newBuilder().build().getOptionalLong());
  }

  testOptionalFieldNoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalLong(Long.fromInt(8964));
    assertEqualsForProto(true, builder.hasOptionalLong());
    assertEqualsForProto(Long.fromInt(8964), builder.getOptionalLong());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalLong());
    assertEqualsForProto(Long.fromInt(8964), proto.getOptionalLong());
  }

  testOptionalFieldNoDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalLong(Long.fromInt(0));
    assertEqualsForProto(true, builder.hasOptionalLong());
    assertEqualsForProto(Long.fromInt(0), builder.getOptionalLong());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalLong());
    assertEqualsForProto(Long.fromInt(0), proto.getOptionalLong());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto =
        TestProto.newBuilder().setOptionalLong(Long.fromInt(0)).build();
    // Test clear
    const builder = startProto.toBuilder();
    builder.clearOptionalLong();
    assertEqualsForProto(false, builder.hasOptionalLong());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalLong());
  }

  testOptionalFieldWithDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalLongWithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE,
        TestProto.newBuilder().build().getOptionalLongWithDefault());
  }
  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalLongWithDefault(
        Long.fromString('-4000000000'));
    assertEqualsForProto(true, builder.hasOptionalLongWithDefault());
    assertEqualsForProto(
        Long.fromString('-4000000000'), builder.getOptionalLongWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalLongWithDefault());
    assertEqualsForProto(
        Long.fromString('-4000000000'), proto.getOptionalLongWithDefault());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    const builder =
        TestProto.newBuilder().setOptionalLongWithDefault(DEFAULT_PROTO_VALUE);
    assertEqualsForProto(true, builder.hasOptionalLongWithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, builder.getOptionalLongWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalLongWithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, proto.getOptionalLongWithDefault());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedLongCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedLongList().size());
    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedLong(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedLong(0));
    }
  }

  testRepeatedField_add() {
    const builder = TestProto.newBuilder()
                        .addRepeatedLong(Long.fromString('13'))
                        .addRepeatedLong(Long.fromString('24000000000'));
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('24000000000')],
        builder.getRepeatedLongList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('24000000000')],
        proto.getRepeatedLongList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedLong(Long.fromString('13'))
                           .addRepeatedLong(Long.fromString('24000000000'))
                           .build();

    const builder = startProto.toBuilder().addAllRepeatedLong(ListView.copyOf(
        [Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')]));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedLongList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedLongList().toArray());
  }

  testRepeatedField_set() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedLong(Long.fromString('13'))
                           .addRepeatedLong(Long.fromString('24000000000'))
                           .addRepeatedLong(Long.fromString('-1'))
                           .addRepeatedLong(Long.fromString('-2'))
                           .addRepeatedLong(Long.fromString('-3'))
                           .build();

    const builder =
        startProto.toBuilder().setRepeatedLong(2, Long.fromString('333'));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedLongList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedLongList().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedLong(Long.fromString('13'))
                        .addRepeatedLong(Long.fromString('24000000000'))
                        .addRepeatedLong(Long.fromString('-1'))
                        .addRepeatedLong(Long.fromString('-2'))
                        .addRepeatedLong(Long.fromString('-3'));

    assertEqualsForProto(5, builder.getRepeatedLongCount());
    assertEqualsForProto(Long.fromString('13'), builder.getRepeatedLong(0));
    assertEqualsForProto(
        Long.fromString('24000000000'), builder.getRepeatedLong(1));
    assertEqualsForProto(Long.fromString('-1'), builder.getRepeatedLong(2));
    assertEqualsForProto(Long.fromString('-2'), builder.getRepeatedLong(3));
    assertEqualsForProto(Long.fromString('-3'), builder.getRepeatedLong(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedLong(5));
    } else {
      assertUndefined(builder.getRepeatedLong(5));
    }

    const proto = builder.build();
    assertEquals(5, proto.getRepeatedLongCount());
    assertEqualsForProto(
        Long.fromString('24000000000'), proto.getRepeatedLong(1));
    assertEqualsForProto(Long.fromString('-1'), proto.getRepeatedLong(2));
    assertEqualsForProto(Long.fromString('-2'), proto.getRepeatedLong(3));
    assertEqualsForProto(Long.fromString('-3'), proto.getRepeatedLong(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedLong(5));
    } else {
      assertUndefined(proto.getRepeatedLong(5));
    }
  }

  testRepeatedField_clear() {
    const startProto = TestProto.newBuilder()
                           .addRepeatedLong(Long.fromString('13'))
                           .addRepeatedLong(Long.fromString('24000000000'))
                           .addRepeatedLong(Long.fromString('-1'))
                           .addRepeatedLong(Long.fromString('-2'))
                           .addRepeatedLong(Long.fromString('-3'))
                           .build();
    const builder = startProto.toBuilder().clearRepeatedLong();
    assertEqualsForProto(0, builder.getRepeatedLongCount());
    assertEqualsForProto(0, builder.getRepeatedLongList().size());


    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedLongCount());
    assertEqualsForProto(0, proto.getRepeatedLongList().size());
  }

  testNoDataLoss() {
    const builder = TestProto.newBuilder().setOptionalLongWithDefault(
        Long.fromNumber(Math.pow(2, 63)));
    assertEqualsForProto(
        Long.fromNumber(Math.pow(2, 63)), builder.getOptionalLongWithDefault());

    builder.setOptionalLongWithDefault(Long.fromNumber(-Math.pow(2, 63)));
    assertEqualsForProto(
        Long.fromNumber(-Math.pow(2, 63)),
        builder.getOptionalLongWithDefault());
  }
}

testSuite(new LongFieldsTest());
