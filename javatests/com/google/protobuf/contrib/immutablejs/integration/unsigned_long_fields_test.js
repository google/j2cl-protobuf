// Copyright 2022 Google LLC
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

goog.module('proto.im.integration.UnsignedLongFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


const DEFAULT_PROTO_VALUE = Long.fromString('9223372036854775810');

class UnsignedLongFieldsTest {
  // uint64
  testOptionalUint64NoDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalUint64());
    assertEqualsForProto(
        Long.fromInt(0), TestProto.newBuilder().build().getOptionalUint64());
  }

  testOptionalUint64NoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalUint64(
        Long.fromString('9223372036854775811'));
    assertEqualsForProto(true, builder.hasOptionalUint64());
    assertEqualsForProto(
        Long.fromString('9223372036854775811'), builder.getOptionalUint64());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint64());
    assertEqualsForProto(
        Long.fromString('9223372036854775811'), proto.getOptionalUint64());
  }

  testOptionalUint64NoDefault_setValueSigned() {
    const builder = TestProto.newBuilder().setOptionalUint64(Long.fromInt(-2));
    assertEqualsForProto(true, builder.hasOptionalUint64());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), builder.getOptionalUint64());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint64());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), proto.getOptionalUint64());
  }

  testOptionalUint64NoDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalUint64(Long.fromInt(0));
    assertEqualsForProto(true, builder.hasOptionalUint64());
    assertEqualsForProto(Long.fromInt(0), builder.getOptionalUint64());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint64());
    assertEqualsForProto(Long.fromInt(0), proto.getOptionalUint64());
  }

  testOptionalUint64NoDefault_clear() {
    const startProto =
        TestProto.newBuilder().setOptionalUint64(Long.fromInt(0)).build();
    // Test clear
    const builder = startProto.toBuilder();
    builder.clearOptionalUint64();
    assertEqualsForProto(false, builder.hasOptionalUint64());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalUint64());
  }

  testOptionalUint64WithDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalUint64WithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE,
        TestProto.newBuilder().build().getOptionalUint64WithDefault());
  }

  testOptionalUint64WithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalUint64WithDefault(
        Long.fromString('18446744073709551614'));
    assertEqualsForProto(true, builder.hasOptionalUint64WithDefault());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'),
        builder.getOptionalUint64WithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint64WithDefault());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'),
        proto.getOptionalUint64WithDefault());
  }

  testOptionalUint64WithDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalUint64WithDefault(
        DEFAULT_PROTO_VALUE);
    assertEqualsForProto(true, builder.hasOptionalUint64WithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, builder.getOptionalUint64WithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint64WithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, proto.getOptionalUint64WithDefault());
  }

  testRepeatedUint64_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedUint64Count());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedUint64List().size());
    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedUint64(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedUint64(0));
    }
  }

  testRepeatedUint64_add() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedUint64(Long.fromString('13'))
            .addRepeatedUint64(Long.fromString('18446744073709551614'));
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('18446744073709551614')],
        builder.getRepeatedUint64List().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('18446744073709551614')],
        proto.getRepeatedUint64List().toArray());
  }

  testRepeatedUint64_addAll() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedUint64(Long.fromString('13'))
            .addRepeatedUint64(Long.fromString('18446744073709551614'))
            .build();

    const builder = startProto.toBuilder().addAllRepeatedUint64(ListView.copyOf(
        [Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')]));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedUint64List().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedUint64List().toArray());
  }

  testRepeatedUint64_set() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedUint64(Long.fromString('13'))
            .addRepeatedUint64(Long.fromString('18446744073709551614'))
            .addRepeatedUint64(Long.fromString('-1'))
            .addRepeatedUint64(Long.fromString('-2'))
            .addRepeatedUint64(Long.fromString('-3'))
            .build();

    const builder =
        startProto.toBuilder().setRepeatedUint64(2, Long.fromString('333'));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedUint64List().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedUint64List().toArray());
  }

  testRepeatedUint64_getAndCount() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedUint64(Long.fromString('13'))
            .addRepeatedUint64(Long.fromString('18446744073709551614'))
            .addRepeatedUint64(Long.fromString('-1'))
            .addRepeatedUint64(Long.fromString('-2'))
            .addRepeatedUint64(Long.fromString('-3'));

    assertEqualsForProto(5, builder.getRepeatedUint64Count());
    assertEqualsForProto(Long.fromString('13'), builder.getRepeatedUint64(0));
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), builder.getRepeatedUint64(1));
    assertEqualsForProto(Long.fromString('-1'), builder.getRepeatedUint64(2));
    assertEqualsForProto(Long.fromString('-2'), builder.getRepeatedUint64(3));
    assertEqualsForProto(Long.fromString('-3'), builder.getRepeatedUint64(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedUint64(5));
    } else {
      assertUndefined(builder.getRepeatedUint64(5));
    }

    const proto = builder.build();
    assertEquals(5, proto.getRepeatedUint64Count());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), proto.getRepeatedUint64(1));
    assertEqualsForProto(Long.fromString('-1'), proto.getRepeatedUint64(2));
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), proto.getRepeatedUint64(3));
    assertEqualsForProto(Long.fromString('-3'), proto.getRepeatedUint64(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedUint64(5));
    } else {
      assertUndefined(proto.getRepeatedUint64(5));
    }
  }

  testRepeatedUint64_clear() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedUint64(Long.fromString('13'))
            .addRepeatedUint64(Long.fromString('18446744073709551614'))
            .addRepeatedUint64(Long.fromString('-1'))
            .addRepeatedUint64(Long.fromString('-2'))
            .addRepeatedUint64(Long.fromString('-3'))
            .build();
    const builder = startProto.toBuilder().clearRepeatedUint64();
    assertEqualsForProto(0, builder.getRepeatedUint64Count());
    assertEqualsForProto(0, builder.getRepeatedUint64List().size());


    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedUint64Count());
    assertEqualsForProto(0, proto.getRepeatedUint64List().size());
  }

  testUint64NoDataLoss() {
    const builder = TestProto.newBuilder().setOptionalUint64WithDefault(
        Long.fromString('18446744073709551615'));
    assertEqualsForProto(
        Long.fromString('18446744073709551615'),
        builder.getOptionalUint64WithDefault());

    builder.setOptionalUint64WithDefault(Long.fromNumber(-1));
    assertEqualsForProto(
        Long.fromString('18446744073709551615'),
        builder.getOptionalUint64WithDefault());
  }

  // fixed64
  testOptionalFixed64NoDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalFixed64());
    assertEqualsForProto(
        Long.fromInt(0), TestProto.newBuilder().build().getOptionalFixed64());
  }

  testOptionalFixed64NoDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalFixed64(
        Long.fromString('9223372036854775811'));
    assertEqualsForProto(true, builder.hasOptionalFixed64());
    assertEqualsForProto(
        Long.fromString('9223372036854775811'), builder.getOptionalFixed64());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFixed64());
    assertEqualsForProto(
        Long.fromString('9223372036854775811'), proto.getOptionalFixed64());
  }

  testOptionalFixed64NoDefault_setValueSigned() {
    const builder = TestProto.newBuilder().setOptionalFixed64(Long.fromInt(-2));
    assertEqualsForProto(true, builder.hasOptionalFixed64());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), builder.getOptionalFixed64());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFixed64());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), proto.getOptionalFixed64());
  }

  testOptionalFixed64NoDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalFixed64(Long.fromInt(0));
    assertEqualsForProto(true, builder.hasOptionalFixed64());
    assertEqualsForProto(Long.fromInt(0), builder.getOptionalFixed64());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFixed64());
    assertEqualsForProto(Long.fromInt(0), proto.getOptionalFixed64());
  }

  testOptionalFixed64NoDefault_clear() {
    const startProto =
        TestProto.newBuilder().setOptionalFixed64(Long.fromInt(0)).build();
    // Test clear
    const builder = startProto.toBuilder();
    builder.clearOptionalFixed64();
    assertEqualsForProto(false, builder.hasOptionalFixed64());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalFixed64());
  }

  testOptionalFixed64WithDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalFixed64WithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE,
        TestProto.newBuilder().build().getOptionalFixed64WithDefault());
  }

  testOptionalFixed64WithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalFixed64WithDefault(
        Long.fromString('18446744073709551614'));
    assertEqualsForProto(true, builder.hasOptionalFixed64WithDefault());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'),
        builder.getOptionalFixed64WithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFixed64WithDefault());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'),
        proto.getOptionalFixed64WithDefault());
  }

  testOptionalFixed64WithDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalFixed64WithDefault(
        DEFAULT_PROTO_VALUE);
    assertEqualsForProto(true, builder.hasOptionalFixed64WithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, builder.getOptionalFixed64WithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalFixed64WithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, proto.getOptionalFixed64WithDefault());
  }

  testRepeatedFixed64_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedFixed64Count());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedFixed64List().size());
    if (isCheckIndex()) {
      assertThrows(() => TestProto.newBuilder().build().getRepeatedFixed64(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedFixed64(0));
    }
  }

  testRepeatedFixed64_add() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedFixed64(Long.fromString('13'))
            .addRepeatedFixed64(Long.fromString('18446744073709551614'));
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('18446744073709551614')],
        builder.getRepeatedFixed64List().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('18446744073709551614')],
        proto.getRepeatedFixed64List().toArray());
  }

  testRepeatedFixed64_addAll() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedFixed64(Long.fromString('13'))
            .addRepeatedFixed64(Long.fromString('18446744073709551614'))
            .build();

    const builder =
        startProto.toBuilder().addAllRepeatedFixed64(ListView.copyOf([
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ]));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedFixed64List().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedFixed64List().toArray());
  }

  testRepeatedFixed64_set() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedFixed64(Long.fromString('13'))
            .addRepeatedFixed64(Long.fromString('18446744073709551614'))
            .addRepeatedFixed64(Long.fromString('-1'))
            .addRepeatedFixed64(Long.fromString('-2'))
            .addRepeatedFixed64(Long.fromString('-3'))
            .build();

    const builder =
        startProto.toBuilder().setRepeatedFixed64(2, Long.fromString('333'));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedFixed64List().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('18446744073709551614'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedFixed64List().toArray());
  }

  testRepeatedFixed64_getAndCount() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedFixed64(Long.fromString('13'))
            .addRepeatedFixed64(Long.fromString('18446744073709551614'))
            .addRepeatedFixed64(Long.fromString('-1'))
            .addRepeatedFixed64(Long.fromString('-2'))
            .addRepeatedFixed64(Long.fromString('-3'));

    assertEqualsForProto(5, builder.getRepeatedFixed64Count());
    assertEqualsForProto(Long.fromString('13'), builder.getRepeatedFixed64(0));
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), builder.getRepeatedFixed64(1));
    assertEqualsForProto(Long.fromString('-1'), builder.getRepeatedFixed64(2));
    assertEqualsForProto(Long.fromString('-2'), builder.getRepeatedFixed64(3));
    assertEqualsForProto(Long.fromString('-3'), builder.getRepeatedFixed64(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedFixed64(5));
    } else {
      assertUndefined(builder.getRepeatedFixed64(5));
    }

    const proto = builder.build();
    assertEquals(5, proto.getRepeatedFixed64Count());
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), proto.getRepeatedFixed64(1));
    assertEqualsForProto(Long.fromString('-1'), proto.getRepeatedFixed64(2));
    assertEqualsForProto(
        Long.fromString('18446744073709551614'), proto.getRepeatedFixed64(3));
    assertEqualsForProto(Long.fromString('-3'), proto.getRepeatedFixed64(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedFixed64(5));
    } else {
      assertUndefined(proto.getRepeatedFixed64(5));
    }
  }

  testRepeatedFixed64_clear() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedFixed64(Long.fromString('13'))
            .addRepeatedFixed64(Long.fromString('18446744073709551614'))
            .addRepeatedFixed64(Long.fromString('-1'))
            .addRepeatedFixed64(Long.fromString('-2'))
            .addRepeatedFixed64(Long.fromString('-3'))
            .build();
    const builder = startProto.toBuilder().clearRepeatedFixed64();
    assertEqualsForProto(0, builder.getRepeatedFixed64Count());
    assertEqualsForProto(0, builder.getRepeatedFixed64List().size());


    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedFixed64Count());
    assertEqualsForProto(0, proto.getRepeatedFixed64List().size());
  }

  testFixed64NoDataLoss() {
    const builder = TestProto.newBuilder().setOptionalFixed64WithDefault(
        Long.fromString('18446744073709551615'));
    assertEqualsForProto(
        Long.fromString('18446744073709551615'),
        builder.getOptionalFixed64WithDefault());

    builder.setOptionalFixed64WithDefault(Long.fromNumber(-1));
    assertEqualsForProto(
        Long.fromString('18446744073709551615'),
        builder.getOptionalFixed64WithDefault());
  }
}

testSuite(new UnsignedLongFieldsTest());
