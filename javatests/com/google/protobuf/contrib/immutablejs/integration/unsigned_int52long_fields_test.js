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

goog.module('proto.im.integration.UnsignedInt52LongFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const TestProto3 = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto3');
const defines = goog.require('proto.im.defines');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto, assertValueIsCleared, assertValueIsSet} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');


const DEFAULT_PROTO_VALUE = Long.fromString('30000');

class UnsignedInt52LongFieldsTest {
  testOptionalFieldNoDefault_defaultInstance() {
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasOptionalUint52Long());
    assertEqualsForProto(
        Long.fromInt(0),
        TestProto.newBuilder().build().getOptionalUint52Long());
  }

  testOptionalFieldNoDefault_setValue() {
    const builder =
        TestProto.newBuilder().setOptionalUint52Long(Long.fromInt(8964));
    assertEqualsForProto(true, builder.hasOptionalUint52Long());
    assertEqualsForProto(Long.fromInt(8964), builder.getOptionalUint52Long());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint52Long());
    assertEqualsForProto(Long.fromInt(8964), proto.getOptionalUint52Long());
  }

  testOptionalFieldNoDefault_setDefaultValue() {
    const builder =
        TestProto.newBuilder().setOptionalUint52Long(Long.fromInt(0));
    assertEqualsForProto(true, builder.hasOptionalUint52Long());
    assertEqualsForProto(Long.fromInt(0), builder.getOptionalUint52Long());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint52Long());
    assertEqualsForProto(Long.fromInt(0), proto.getOptionalUint52Long());
  }

  testOptionalFieldNoDefault_clear() {
    const startProto =
        TestProto.newBuilder().setOptionalLong(Long.fromInt(0)).build();
    // Test clear
    const builder = startProto.toBuilder();
    builder.clearOptionalUint52Long();
    assertEqualsForProto(false, builder.hasOptionalUint52Long());

    const proto = builder.build();
    assertEqualsForProto(false, proto.hasOptionalUint52Long());
  }

  testOptionalFieldWithDefault_defaultInstance() {
    assertEqualsForProto(
        false,
        TestProto.newBuilder().build().hasOptionalUint52LongWithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE,
        TestProto.newBuilder().build().getOptionalUint52LongWithDefault());
  }

  testOptionalFieldWithDefault_setValue() {
    const builder = TestProto.newBuilder().setOptionalUint52LongWithDefault(
        Long.fromString('-4000000000'));
    assertEqualsForProto(true, builder.hasOptionalUint52LongWithDefault());
    assertEqualsForProto(
        Long.fromString('-4000000000'),
        builder.getOptionalUint52LongWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint52LongWithDefault());
    assertEqualsForProto(
        Long.fromString('-4000000000'),
        proto.getOptionalUint52LongWithDefault());
  }

  testOptionalFieldWithDefault_setDefaultValue() {
    const builder = TestProto.newBuilder().setOptionalUint52LongWithDefault(
        DEFAULT_PROTO_VALUE);
    assertEqualsForProto(true, builder.hasOptionalUint52LongWithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, builder.getOptionalUint52LongWithDefault());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalUint52LongWithDefault());
    assertEqualsForProto(
        DEFAULT_PROTO_VALUE, proto.getOptionalUint52LongWithDefault());
  }

  testFieldWithDefault_serialization() {
    assertValueIsSet(
        TestProto.newBuilder().setOptionalInt52Long(Long.fromInt(0)).build());

    const proto3builder = TestProto3.newBuilder();
    assertValueIsCleared(
        proto3builder.setProto3Int52Long(Long.fromInt(0)).build());
    assertValueIsSet(
        proto3builder.setProto3Int52Long(Long.fromInt(8964)).build());
  }

  testRepeatedField_defaultInstance() {
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedUint52LongCount());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getRepeatedUint52LongList().size());
    if (isCheckIndex()) {
      assertThrows(
          () => TestProto.newBuilder().build().getRepeatedUint52Long(0));
    } else {
      assertUndefined(TestProto.newBuilder().build().getRepeatedUint52Long(0));
    }
  }

  testRepeatedField_add() {
    const builder = TestProto.newBuilder()
                        .addRepeatedUint52Long(Long.fromString('13'))
                        .addRepeatedUint52Long(Long.fromString('24000000000'));
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('24000000000')],
        builder.getRepeatedUint52LongList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [Long.fromString('13'), Long.fromString('24000000000')],
        proto.getRepeatedUint52LongList().toArray());
  }

  testRepeatedField_addAll() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedUint52Long(Long.fromString('13'))
            .addRepeatedUint52Long(Long.fromString('24000000000'))
            .build();

    const builder =
        startProto.toBuilder().addAllRepeatedUint52Long(ListView.copyOf([
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ]));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedUint52LongList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('-1'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedUint52LongList().toArray());
  }

  testRepeatedField_set() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedUint52Long(Long.fromString('13'))
            .addRepeatedUint52Long(Long.fromString('24000000000'))
            .addRepeatedUint52Long(Long.fromString('-1'))
            .addRepeatedUint52Long(Long.fromString('-2'))
            .addRepeatedUint52Long(Long.fromString('-3'))
            .build();

    const builder =
        startProto.toBuilder().setRepeatedUint52Long(2, Long.fromString('333'));
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        builder.getRepeatedUint52LongList().toArray());

    const proto = builder.build();
    assertEqualsForProto(
        [
          Long.fromString('13'), Long.fromString('24000000000'),
          Long.fromString('333'), Long.fromString('-2'), Long.fromString('-3')
        ],
        proto.getRepeatedUint52LongList().toArray());
  }

  testRepeatedField_getAndCount() {
    const builder = TestProto.newBuilder()
                        .addRepeatedUint52Long(Long.fromString('13'))
                        .addRepeatedUint52Long(Long.fromString('24000000000'))
                        .addRepeatedUint52Long(Long.fromString('-1'))
                        .addRepeatedUint52Long(Long.fromString('-2'))
                        .addRepeatedUint52Long(Long.fromString('-3'));

    assertEqualsForProto(5, builder.getRepeatedUint52LongCount());
    assertEqualsForProto(
        Long.fromString('13'), builder.getRepeatedUint52Long(0));
    assertEqualsForProto(
        Long.fromString('24000000000'), builder.getRepeatedUint52Long(1));
    assertEqualsForProto(
        Long.fromString('-1'), builder.getRepeatedUint52Long(2));
    assertEqualsForProto(
        Long.fromString('-2'), builder.getRepeatedUint52Long(3));
    assertEqualsForProto(
        Long.fromString('-3'), builder.getRepeatedUint52Long(4));
    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedUint52Long(5));
    } else {
      assertUndefined(builder.getRepeatedUint52Long(5));
    }

    const proto = builder.build();
    assertEqualsForProto(5, proto.getRepeatedUint52LongCount());
    assertEqualsForProto(
        Long.fromString('24000000000'), proto.getRepeatedUint52Long(1));
    assertEqualsForProto(Long.fromString('-1'), proto.getRepeatedUint52Long(2));
    assertEqualsForProto(Long.fromString('-2'), proto.getRepeatedUint52Long(3));
    assertEqualsForProto(Long.fromString('-3'), proto.getRepeatedUint52Long(4));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedUint52Long(5));
    } else {
      assertUndefined(proto.getRepeatedUint52Long(5));
    }
  }

  testRepeatedField_clear() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedUint52Long(Long.fromString('13'))
            .addRepeatedUint52Long(Long.fromString('24000000000'))
            .addRepeatedUint52Long(Long.fromString('-1'))
            .addRepeatedUint52Long(Long.fromString('-2'))
            .addRepeatedUint52Long(Long.fromString('-3'))
            .build();
    const builder = startProto.toBuilder().clearRepeatedUint52Long();
    assertEqualsForProto(0, builder.getRepeatedUint52LongCount());
    assertEqualsForProto(0, builder.getRepeatedUint52LongList().size());


    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedUint52LongCount());
    assertEqualsForProto(0, proto.getRepeatedUint52LongList().size());
  }

  testDataLoss_singleField() {
    const builder = TestProto.newBuilder().setOptionalUint52Long(
        Long.fromNumber(Math.pow(2, 53) - 1));
    assertEqualsForProto(
        Long.fromNumber(Math.pow(2, 53) - 1), builder.getOptionalUint52Long());
    assertEqualsForProto(
        Long.fromNumber(Math.pow(2, 53) - 1),
        builder.build().getOptionalUint52Long());

    builder.setOptionalUint52Long(Long.fromNumber(-Math.pow(2, 53) + 1));
    assertEqualsForProto(
        Long.fromNumber(-Math.pow(2, 53) + 1), builder.getOptionalUint52Long());
    assertEqualsForProto(
        Long.fromNumber(-Math.pow(2, 53) + 1),
        builder.build().getOptionalUint52Long());

    if (this.checkLongDataLoss()) {
      assertThrows(
          () => TestProto.newBuilder().setOptionalUint52Long(
              Long.fromNumber(Math.pow(2, 53))));
      assertThrows(
          () => TestProto.newBuilder().setOptionalUint52Long(
              Long.fromNumber(-Math.pow(2, 53))));

      // Also verify that default JsType (non-set) is consistent with INT52

      assertThrows(
          () => TestProto.newBuilder().setOptionalDefaultLong(
              Long.fromNumber(Math.pow(2, 53))));
      assertThrows(
          () => TestProto.newBuilder().setOptionalDefaultLong(
              Long.fromNumber(-Math.pow(2, 53))));
    } else {
      const two_53 = Long.fromString('9007199254740992');
      const two_53_plus_1 = Long.fromString('9007199254740993');
      builder.setOptionalUint52Long(two_53_plus_1);
      assertEqualsForProto(two_53, builder.getOptionalUint52Long());

      // Also verify that default JsType (non-set) is consistent with INT52

      builder.setOptionalDefaultLong(two_53_plus_1);
      assertEqualsForProto(two_53, builder.getOptionalDefaultLong());
    }
  }

  testDataLoss_repeatedField() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedUint52Long(Long.fromNumber(Math.pow(2, 53) - 1))
            .addRepeatedUint52Long(Long.fromNumber(-Math.pow(2, 53) + 1));



    assertEqualsForProto(
        Long.fromNumber(Math.pow(2, 53) - 1), builder.getRepeatedUint52Long(0));
    assertEqualsForProto(
        Long.fromNumber(Math.pow(2, 53) - 1),
        builder.build().getRepeatedUint52Long(0));
    assertEqualsForProto(
        Long.fromNumber(-Math.pow(2, 53) + 1),
        builder.getRepeatedUint52Long(1));
    assertEqualsForProto(
        Long.fromNumber(-Math.pow(2, 53) + 1),
        builder.build().getRepeatedUint52Long(1));



    if (this.checkLongDataLoss()) {
      assertThrows(
          () => TestProto.newBuilder().setOptionalUint52Long(
              Long.fromNumber(Math.pow(2, 53))));
      assertThrows(
          () => TestProto.newBuilder().setOptionalUint52Long(
              Long.fromNumber(-Math.pow(2, 53))));
    }
  }

  checkLongDataLoss() {
    return defines.CHECKED_MODE__DO_NOT_USE_INTERNAL;
  }
}

testSuite(new UnsignedInt52LongFieldsTest());
