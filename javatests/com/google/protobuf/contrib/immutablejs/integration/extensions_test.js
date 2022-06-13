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

goog.module('proto.im.testdata.ExtensionsTest');
goog.setTestOnly('proto.im.testdata.Extensions');

const Base = goog.require('improto.protobuf.contrib.immutablejs.protos.Base');
const ByteString = goog.require('proto.im.ByteString');
const JSPB_DATA1 = goog.require('testdata.Extensions1');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const Primitives = goog.require('improto.protobuf.contrib.immutablejs.protos.Primitives');
const Recursive = goog.require('improto.protobuf.contrib.immutablejs.protos.Recursive');
const TestEnum = goog.require('improto.protobuf.contrib.immutablejs.protos.TestEnum');
const extensions = goog.require('improto.protobuf.contrib.immutablejs.protos.extensions');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');

class ExtensionsTest {
  test() {
    const jspbDataAsString = JSON.stringify(JSPB_DATA1);
    const baseProto = Base.parse(jspbDataAsString);
    this.assertProtoValues(baseProto);
    this.assertProtoValues(baseProto.toBuilder());
  }

  testRoundTrip() {
    const baseBuilder = Base.newBuilder();

    baseBuilder.setOptionalLong(Long.fromInt(2));
    baseBuilder.addRepeatedString('2');
    baseBuilder.addRepeatedString('3');
    baseBuilder.setOptionalEnum(Base.EmotionalState.SAD);
    baseBuilder.setOptionalInt(6);
    baseBuilder.setOptionalMessage(
        Base.newBuilder()
            .setOptionalLong(Long.fromInt(20))
            .addRepeatedString('20')
            .addRepeatedString('30')
            .setOptionalEnum(Base.EmotionalState.HAPPY)
            .setOptionalInt(60)
            .build());

    // Single extensions
    baseBuilder.setExtension(Primitives.singleBoolExtension, true)
        .setExtension(Primitives.singleInt32Extension, 2)
        .setExtension(Primitives.singleUint32Extension, -1)
        .setExtension(Primitives.singleInt64Extension, Long.fromInt(3))
        .setExtension(Primitives.singleStringExtension, '4')
        .setExtension(Primitives.singleDoubleExtension, 5)
        .setExtension(Primitives.singleFloatExtension, 6)
        .setExtension(Primitives.singleEnumExtension, TestEnum.GREEN);

    // repeated extensions
    baseBuilder
        .setExtension(
            Primitives.repeatedBoolExtension, ListView.copyOf([true, true]))
        .setExtension(
            Primitives.repeatedInt32Extension, ListView.copyOf([1, 2]))
        .setExtension(
            Primitives.repeatedUint32Extension, ListView.copyOf([-1, 12]))
        .setExtension(
            Primitives.repeatedInt64Extension,
            ListView.copyOf([Long.fromInt(3), Long.fromInt(4)]))
        .setExtension(
            Primitives.repeatedStringExtension, ListView.copyOf(['5', '6']))
        .setExtension(
            Primitives.repeatedDoubleExtension, ListView.copyOf([7, 8]))
        .setExtension(
            Primitives.repeatedFloatExtension, ListView.copyOf([9, 10]))
        .setExtension(
            Primitives.repeatedEnumExtension,
            ListView.copyOf([TestEnum.BLUE, TestEnum.BLUE]));

    // Extensions message
    baseBuilder.setExtension(
        Recursive.recursiveOptional,
        Base.newBuilder()
            .setOptionalLong(Long.fromInt(200))
            .addRepeatedString('200')
            .addRepeatedString('300')
            .setOptionalEnum(Base.EmotionalState.HAPPY)
            .setOptionalInt(600)
            .build());

    // Repeated extension messages
    const listView = ListView.copyOf([
      Base.newBuilder()
          .setOptionalLong(Long.fromInt(2000))
          .addRepeatedString('2000')
          .addRepeatedString('3000')
          .setOptionalEnum(Base.EmotionalState.HAPPY)
          .setOptionalInt(6000)
          .build(),
      Base.newBuilder()
          .setOptionalLong(Long.fromInt(20000))
          .addRepeatedString('20000')
          .addRepeatedString('30000')
          .setOptionalEnum(Base.EmotionalState.HAPPY)
          .setOptionalInt(60000)
          .build()
    ]);

    baseBuilder.setExtension(Recursive.recursiveRepeated, listView);

    baseBuilder.setExtension(
        extensions.standaloneStringExtension, 'standalone_value');
    baseBuilder.setExtension(
        extensions.standaloneDoubleExtension, ListView.copyOf([1.0]));

    this.assertProtoValues(baseBuilder);
    this.assertProtoValues(baseBuilder.build());
  }

  assertProtoValues(baseProto) {
    assertEqualsForProto(Long.fromInt(2), baseProto.getOptionalLong());
    assertEqualsForProto(
        ['2', '3'], baseProto.getRepeatedStringList().toArray());
    assertEqualsForProto(2, baseProto.getOptionalEnum());
    assertEqualsForProto(6, baseProto.getOptionalInt());
    const nested = baseProto.getOptionalMessage();
    assertEqualsForProto(Long.fromInt(20), nested.getOptionalLong());
    assertEqualsForProto(
        ['20', '30'], nested.getRepeatedStringList().toArray());
    assertEqualsForProto(1, nested.getOptionalEnum());
    assertEqualsForProto(60, nested.getOptionalInt());

    // Extensions
    // single
    assertEqualsForProto(
        true, baseProto.getExtension(Primitives.singleBoolExtension));
    assertEqualsForProto(
        2, baseProto.getExtension(Primitives.singleInt32Extension));
    assertEqualsForProto(
        -1, baseProto.getExtension(Primitives.singleUint32Extension));
    assertEqualsForProto(
        Long.fromInt(3),
        baseProto.getExtension(Primitives.singleInt64Extension));
    assertEqualsForProto(
        '4', baseProto.getExtension(Primitives.singleStringExtension));
    assertEqualsForProto(
        5, baseProto.getExtension(Primitives.singleDoubleExtension));
    assertEqualsForProto(
        6, baseProto.getExtension(Primitives.singleFloatExtension));
    assertEqualsForProto(
        TestEnum.GREEN, baseProto.getExtension(Primitives.singleEnumExtension));
    // Extensions
    // repeated
    assertEqualsForProto(
        [true, true],
        baseProto.getExtension(Primitives.repeatedBoolExtension).toArray());
    assertEqualsForProto(
        [1, 2],
        baseProto.getExtension(Primitives.repeatedInt32Extension).toArray());
    assertEqualsForProto(
        [-1, 12],
        baseProto.getExtension(Primitives.repeatedUint32Extension).toArray());
    const longArray =
        baseProto.getExtension(Primitives.repeatedInt64Extension).toArray();
    assertEqualsForProto(2, longArray.length);
    assertEqualsForProto(
        [
          Long.fromInt(3),
          Long.fromInt(4),
        ],
        longArray);
    assertEqualsForProto(
        ['5', '6'],
        baseProto.getExtension(Primitives.repeatedStringExtension).toArray());
    assertEqualsForProto(
        [7, 8],
        baseProto.getExtension(Primitives.repeatedDoubleExtension).toArray());
    assertEqualsForProto(
        [9, 10],
        baseProto.getExtension(Primitives.repeatedFloatExtension).toArray());
    assertEqualsForProto(
        [TestEnum.BLUE, TestEnum.BLUE],
        baseProto.getExtension(Primitives.repeatedEnumExtension).toArray());

    // Extensions message
    const baseProtoAsExtension =
        baseProto.getExtension(Recursive.recursiveOptional);
    assertEqualsForProto(
        Long.fromInt(200), baseProtoAsExtension.getOptionalLong());
    assertEqualsForProto(
        ['200', '300'], baseProtoAsExtension.getRepeatedStringList().toArray());
    assertEqualsForProto(1, baseProtoAsExtension.getOptionalEnum());
    assertEqualsForProto(600, baseProtoAsExtension.getOptionalInt());

    // Extensions message repeated
    const repeatedProto1 =
        baseProto.getExtension(Recursive.recursiveRepeated).get(0);
    assertEqualsForProto(Long.fromInt(2000), repeatedProto1.getOptionalLong());
    assertEqualsForProto(
        ['2000', '3000'], repeatedProto1.getRepeatedStringList().toArray());
    assertEqualsForProto(1, repeatedProto1.getOptionalEnum());
    assertEqualsForProto(6000, repeatedProto1.getOptionalInt());

    const repeatedProto2 =
        baseProto.getExtension(Recursive.recursiveRepeated).get(1);
    assertEqualsForProto(Long.fromInt(20000), repeatedProto2.getOptionalLong());
    assertEqualsForProto(
        ['20000', '30000'], repeatedProto2.getRepeatedStringList().toArray());
    assertEqualsForProto(1, repeatedProto2.getOptionalEnum());
    assertEqualsForProto(60000, repeatedProto2.getOptionalInt());

    assertEqualsForProto(
        'standalone_value',
        baseProto.getExtension(extensions.standaloneStringExtension));
    assertEqualsForProto(
        [1.0],
        baseProto.getExtension(extensions.standaloneDoubleExtension).toArray());
  }

  testUnitializedExtension() {
    const baseProto = Base.newBuilder().build();
    assertEqualsForProto(
        false, baseProto.getExtension(Primitives.singleBoolExtension));
  }

  testSingleBooleanExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleBoolExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleBoolExtension));
    assertEqualsForProto(
        false, baseBuilder.getExtension(Primitives.singleBoolExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().getExtension(Primitives.singleBoolExtension));

    baseBuilder.setExtension(Primitives.singleBoolExtension, true);
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Primitives.singleBoolExtension));
    assertEqualsForProto(
        true, baseBuilder.build().hasExtension(Primitives.singleBoolExtension));

    assertEqualsForProto(
        true, baseBuilder.getExtension(Primitives.singleBoolExtension));
    assertEqualsForProto(
        true, baseBuilder.build().getExtension(Primitives.singleBoolExtension));
  }

  testSingleBooleanExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleBoolExtension, true);

    baseBuilder.clearExtension(Primitives.singleBoolExtension);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleBoolExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleBoolExtension));
  }

  testRepeatedBooleanExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedBoolExtension));
    assertEqualsForProto(
        [],
        baseBuilder.getExtension(Primitives.repeatedBoolExtension).toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Primitives.repeatedBoolExtension)
            .toArray());

    baseBuilder.setExtension(
        Primitives.repeatedBoolExtension, ListView.copyOf([true, true]));
    assertEqualsForProto(
        2, baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedBoolExtension));

    assertEqualsForProto(
        [true, true],
        baseBuilder.getExtension(Primitives.repeatedBoolExtension).toArray());
    assertEqualsForProto(
        [true, true],
        baseBuilder.build()
            .getExtension(Primitives.repeatedBoolExtension)
            .toArray());
  }

  testRepeatedBooleanExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.getExtensionAtIndex(
              Primitives.repeatedBoolExtension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedBoolExtension, ListView.copyOf([true, false]));

    assertEqualsForProto(
        true,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedBoolExtension, 0));
    assertEqualsForProto(
        true,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedBoolExtension, 0));
    assertEqualsForProto(
        false,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedBoolExtension, 1));
    assertEqualsForProto(
        false,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedBoolExtension, 1));
  }

  testRepeatedBooleanExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Primitives.repeatedBoolExtension, 2, true));
    }

    baseBuilder.setExtension(
        Primitives.repeatedBoolExtension, ListView.copyOf([true, false]));

    baseBuilder.setExtensionAtIndex(Primitives.repeatedBoolExtension, 0, false);
    baseBuilder.setExtensionAtIndex(Primitives.repeatedBoolExtension, 1, true);

    assertEqualsForProto(
        [false, true],
        baseBuilder.getExtension(Primitives.repeatedBoolExtension).toArray());
    assertEqualsForProto(
        [false, true],
        baseBuilder.build()
            .getExtension(Primitives.repeatedBoolExtension)
            .toArray());
  }

  testRepeatedBooleanExtension_add() {
    const baseBuilder = Base.newBuilder();


    baseBuilder.setExtension(
        Primitives.repeatedBoolExtension, ListView.copyOf([true, false]));

    baseBuilder.addExtension(Primitives.repeatedBoolExtension, true);
    baseBuilder.addExtension(Primitives.repeatedBoolExtension, false);

    assertEqualsForProto(
        [true, false, true, false],
        baseBuilder.getExtension(Primitives.repeatedBoolExtension).toArray());
    assertEqualsForProto(
        [true, false, true, false],
        baseBuilder.build()
            .getExtension(Primitives.repeatedBoolExtension)
            .toArray());
  }

  testRepeatedBooleanExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedBoolExtension, ListView.copyOf([true, false]));

    baseBuilder.clearExtension(Primitives.repeatedBoolExtension);

    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedBoolExtension));
  }

  testSingleByteStringExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleByteStringExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleByteStringExtension));
    assertEqualsForProto(
        ByteString.EMPTY,
        baseBuilder.getExtension(Primitives.singleByteStringExtension));
    assertEqualsForProto(
        ByteString.EMPTY,
        baseBuilder.build().getExtension(Primitives.singleByteStringExtension));

    baseBuilder.setExtension(
        Primitives.singleByteStringExtension, ByteString.copyFrom([1]));
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Primitives.singleByteStringExtension));
    assertEqualsForProto(
        true,
        baseBuilder.build().hasExtension(Primitives.singleByteStringExtension));

    assertEqualsForProto(
        ByteString.copyFrom([1]),
        baseBuilder.getExtension(Primitives.singleByteStringExtension));
    assertEqualsForProto(
        ByteString.copyFrom([1]),
        baseBuilder.build().getExtension(Primitives.singleByteStringExtension));
  }

  testSingleByteStringExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.singleByteStringExtension, ByteString.copyFrom([1]));

    baseBuilder.clearExtension(Primitives.singleByteStringExtension);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleByteStringExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleByteStringExtension));
  }

  testRepeatedByteStringExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0,
        baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedByteStringExtension));
    assertEqualsForProto(
        [],
        baseBuilder.getExtension(Primitives.repeatedByteStringExtension)
            .toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Primitives.repeatedByteStringExtension)
            .toArray());

    baseBuilder.setExtension(
        Primitives.repeatedByteStringExtension,
        ListView.copyOf([ByteString.copyFrom([1]), ByteString.copyFrom([2])]));
    assertEqualsForProto(
        2,
        baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedByteStringExtension));

    assertEqualsForProto(
        [ByteString.copyFrom([1]), ByteString.copyFrom([2])],
        baseBuilder.getExtension(Primitives.repeatedByteStringExtension)
            .toArray());
    assertEqualsForProto(
        [ByteString.copyFrom([1]), ByteString.copyFrom([2])],
        baseBuilder.build()
            .getExtension(Primitives.repeatedByteStringExtension)
            .toArray());
  }

  testRepeatedByteStringExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.getExtensionAtIndex(
              Primitives.repeatedByteStringExtension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedByteStringExtension,
        ListView.copyOf([ByteString.copyFrom([1]), ByteString.copyFrom([2])]));

    assertEqualsForProto(
        ByteString.copyFrom([1]),
        baseBuilder.getExtensionAtIndex(
            Primitives.repeatedByteStringExtension, 0));
    assertEqualsForProto(
        ByteString.copyFrom([1]),
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedByteStringExtension, 0));
    assertEqualsForProto(
        ByteString.copyFrom([2]),
        baseBuilder.getExtensionAtIndex(
            Primitives.repeatedByteStringExtension, 1));
    assertEqualsForProto(
        ByteString.copyFrom([2]),
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedByteStringExtension, 1));
  }

  testRepeatedByteStringExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Primitives.repeatedByteStringExtension, 2,
              ByteString.copyFrom([1])));
    }

    baseBuilder.setExtension(
        Primitives.repeatedByteStringExtension,
        ListView.copyOf([ByteString.copyFrom([1]), ByteString.copyFrom([2])]));

    baseBuilder.setExtensionAtIndex(
        Primitives.repeatedByteStringExtension, 0, ByteString.copyFrom([3]));
    baseBuilder.setExtensionAtIndex(
        Primitives.repeatedByteStringExtension, 1, ByteString.copyFrom([4]));

    assertEqualsForProto(
        [ByteString.copyFrom([3]), ByteString.copyFrom([4])],
        baseBuilder.getExtension(Primitives.repeatedByteStringExtension)
            .toArray());
    assertEqualsForProto(
        [ByteString.copyFrom([3]), ByteString.copyFrom([4])],
        baseBuilder.build()
            .getExtension(Primitives.repeatedByteStringExtension)
            .toArray());
  }

  testRepeatedByteStringExtension_add() {
    const baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(
        Primitives.repeatedByteStringExtension,
        ListView.copyOf([ByteString.copyFrom([1]), ByteString.copyFrom([2])]));

    baseBuilder.addExtension(
        Primitives.repeatedByteStringExtension, ByteString.copyFrom([3]));
    baseBuilder.addExtension(
        Primitives.repeatedByteStringExtension, ByteString.copyFrom([4]));

    assertEqualsForProto(
        [
          ByteString.copyFrom([1]), ByteString.copyFrom([2]),
          ByteString.copyFrom([3]), ByteString.copyFrom([4])
        ],
        baseBuilder.getExtension(Primitives.repeatedByteStringExtension)
            .toArray());
    assertEqualsForProto(
        [
          ByteString.copyFrom([1]), ByteString.copyFrom([2]),
          ByteString.copyFrom([3]), ByteString.copyFrom([4])
        ],
        baseBuilder.build()
            .getExtension(Primitives.repeatedByteStringExtension)
            .toArray());
  }

  testRepeatedByteStringExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedByteStringExtension,
        ListView.copyOf([ByteString.copyFrom([1]), ByteString.copyFrom([2])]));

    baseBuilder.clearExtension(Primitives.repeatedByteStringExtension);

    assertEqualsForProto(
        0,
        baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedByteStringExtension));
  }

  testSingleDoubleExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleDoubleExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleDoubleExtension));
    assertEqualsForProto(
        0, baseBuilder.getExtension(Primitives.singleDoubleExtension));
    assertEqualsForProto(
        0, baseBuilder.build().getExtension(Primitives.singleDoubleExtension));

    baseBuilder.setExtension(Primitives.singleDoubleExtension, 1);
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Primitives.singleDoubleExtension));
    assertEqualsForProto(
        true,
        baseBuilder.build().hasExtension(Primitives.singleDoubleExtension));

    assertEqualsForProto(
        1, baseBuilder.getExtension(Primitives.singleDoubleExtension));
    assertEqualsForProto(
        1, baseBuilder.build().getExtension(Primitives.singleDoubleExtension));
  }

  testSingleDoubleExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleDoubleExtension, 1);

    baseBuilder.clearExtension(Primitives.singleDoubleExtension);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleDoubleExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleDoubleExtension));
  }

  testRepeatedDoubleExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedDoubleExtension));
    assertEqualsForProto(
        [],
        baseBuilder.getExtension(Primitives.repeatedDoubleExtension).toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Primitives.repeatedDoubleExtension)
            .toArray());

    baseBuilder.setExtension(
        Primitives.repeatedDoubleExtension, ListView.copyOf([1, 2]));
    assertEqualsForProto(
        2, baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedDoubleExtension));

    assertEqualsForProto(
        [1, 2],
        baseBuilder.getExtension(Primitives.repeatedDoubleExtension).toArray());
    assertEqualsForProto(
        [1, 2],
        baseBuilder.build()
            .getExtension(Primitives.repeatedDoubleExtension)
            .toArray());
  }

  testRepeatedDoubleExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.getExtensionAtIndex(
              Primitives.repeatedDoubleExtension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedDoubleExtension, ListView.copyOf([1, 2]));

    assertEqualsForProto(
        1,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedDoubleExtension, 0));
    assertEqualsForProto(
        1,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedDoubleExtension, 0));
    assertEqualsForProto(
        2,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedDoubleExtension, 1));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedDoubleExtension, 1));
  }

  testRepeatedDoubleExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Primitives.repeatedDoubleExtension, 2, 1));
    }

    baseBuilder.setExtension(
        Primitives.repeatedDoubleExtension, ListView.copyOf([1, 2]));

    baseBuilder.setExtensionAtIndex(Primitives.repeatedDoubleExtension, 0, 3);
    baseBuilder.setExtensionAtIndex(Primitives.repeatedDoubleExtension, 1, 4);

    assertEqualsForProto(
        [3, 4],
        baseBuilder.getExtension(Primitives.repeatedDoubleExtension).toArray());
    assertEqualsForProto(
        [3, 4],
        baseBuilder.build()
            .getExtension(Primitives.repeatedDoubleExtension)
            .toArray());
  }

  testRepeatedDoubleExtension_add() {
    const baseBuilder = Base.newBuilder();


    baseBuilder.setExtension(
        Primitives.repeatedDoubleExtension, ListView.copyOf([1, 2]));

    baseBuilder.addExtension(Primitives.repeatedDoubleExtension, 3);
    baseBuilder.addExtension(Primitives.repeatedDoubleExtension, 4);

    assertEqualsForProto(
        [1, 2, 3, 4],
        baseBuilder.getExtension(Primitives.repeatedDoubleExtension).toArray());
    assertEqualsForProto(
        [1, 2, 3, 4],
        baseBuilder.build()
            .getExtension(Primitives.repeatedDoubleExtension)
            .toArray());
  }

  testRepeatedDoubleExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedDoubleExtension, ListView.copyOf([1, 2]));

    baseBuilder.clearExtension(Primitives.repeatedDoubleExtension);

    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedDoubleExtension));
  }

  testSingleEnumExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleEnumExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleEnumExtension));
    assertEqualsForProto(
        TestEnum.DEFAULT,
        baseBuilder.getExtension(Primitives.singleEnumExtension));
    assertEqualsForProto(
        TestEnum.DEFAULT,
        baseBuilder.build().getExtension(Primitives.singleEnumExtension));

    baseBuilder.setExtension(Primitives.singleEnumExtension, TestEnum.GREEN);
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Primitives.singleEnumExtension));
    assertEqualsForProto(
        true, baseBuilder.build().hasExtension(Primitives.singleEnumExtension));

    assertEqualsForProto(
        TestEnum.GREEN,
        baseBuilder.getExtension(Primitives.singleEnumExtension));
    assertEqualsForProto(
        TestEnum.GREEN,
        baseBuilder.build().getExtension(Primitives.singleEnumExtension));
  }

  testSingleEnumExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleEnumExtension, TestEnum.GREEN);

    baseBuilder.clearExtension(Primitives.singleEnumExtension);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleEnumExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleEnumExtension));
  }

  testRepeatedEnumExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedEnumExtension));
    assertEqualsForProto(
        [],
        baseBuilder.getExtension(Primitives.repeatedEnumExtension).toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Primitives.repeatedEnumExtension)
            .toArray());

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension,
        ListView.copyOf([TestEnum.GREEN, TestEnum.RED]));
    assertEqualsForProto(
        2, baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedEnumExtension));

    assertEqualsForProto(
        [TestEnum.GREEN, TestEnum.RED],
        baseBuilder.getExtension(Primitives.repeatedEnumExtension).toArray());
    assertEqualsForProto(
        [TestEnum.GREEN, TestEnum.RED],
        baseBuilder.build()
            .getExtension(Primitives.repeatedEnumExtension)
            .toArray());
  }

  testRepeatedEnumExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.getExtensionAtIndex(
              Primitives.repeatedEnumExtension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension,
        ListView.copyOf([TestEnum.GREEN, TestEnum.RED]));

    assertEqualsForProto(
        TestEnum.GREEN,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedEnumExtension, 0));
    assertEqualsForProto(
        TestEnum.GREEN,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedEnumExtension, 0));
    assertEqualsForProto(
        TestEnum.RED,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedEnumExtension, 1));
    assertEqualsForProto(
        TestEnum.RED,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedEnumExtension, 1));
  }

  testRepeatedEnumExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Primitives.repeatedEnumExtension, 2, TestEnum.GREEN));
    }

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension,
        ListView.copyOf([TestEnum.GREEN, TestEnum.RED]));

    baseBuilder.setExtensionAtIndex(
        Primitives.repeatedEnumExtension, 0, TestEnum.RED);
    baseBuilder.setExtensionAtIndex(
        Primitives.repeatedEnumExtension, 1, TestEnum.BLUE);

    assertEqualsForProto(
        [TestEnum.RED, TestEnum.BLUE],
        baseBuilder.getExtension(Primitives.repeatedEnumExtension).toArray());
    assertEqualsForProto(
        [TestEnum.RED, TestEnum.BLUE],
        baseBuilder.build()
            .getExtension(Primitives.repeatedEnumExtension)
            .toArray());
  }

  testRepeatedEnumExtension_add() {
    const baseBuilder = Base.newBuilder();


    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension,
        ListView.copyOf([TestEnum.GREEN, TestEnum.RED]));

    baseBuilder.addExtension(Primitives.repeatedEnumExtension, TestEnum.BLUE);
    baseBuilder.addExtension(Primitives.repeatedEnumExtension, TestEnum.GREEN);

    assertEqualsForProto(
        [TestEnum.GREEN, TestEnum.RED, TestEnum.BLUE, TestEnum.GREEN],
        baseBuilder.getExtension(Primitives.repeatedEnumExtension).toArray());
    assertEqualsForProto(
        [TestEnum.GREEN, TestEnum.RED, TestEnum.BLUE, TestEnum.GREEN],
        baseBuilder.build()
            .getExtension(Primitives.repeatedEnumExtension)
            .toArray());
  }

  testRepeatedEnumExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension,
        ListView.copyOf([TestEnum.GREEN, TestEnum.RED]));

    baseBuilder.clearExtension(Primitives.repeatedEnumExtension);

    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedEnumExtension));
  }

  testSingleIntExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleInt32Extension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleInt32Extension));
    assertEqualsForProto(
        0, baseBuilder.getExtension(Primitives.singleInt32Extension));
    assertEqualsForProto(
        0, baseBuilder.build().getExtension(Primitives.singleInt32Extension));

    baseBuilder.setExtension(Primitives.singleInt32Extension, 1);
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Primitives.singleInt32Extension));
    assertEqualsForProto(
        true,
        baseBuilder.build().hasExtension(Primitives.singleInt32Extension));

    assertEqualsForProto(
        1, baseBuilder.getExtension(Primitives.singleInt32Extension));
    assertEqualsForProto(
        1, baseBuilder.build().getExtension(Primitives.singleInt32Extension));
  }

  testSingleIntExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleInt32Extension, 1);

    baseBuilder.clearExtension(Primitives.singleInt32Extension);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleInt32Extension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleInt32Extension));
  }

  testRepeatedIntExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedInt32Extension));
    assertEqualsForProto(
        [],
        baseBuilder.getExtension(Primitives.repeatedInt32Extension).toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt32Extension)
            .toArray());

    baseBuilder.setExtension(
        Primitives.repeatedInt32Extension, ListView.copyOf([1, 2]));
    assertEqualsForProto(
        2, baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedInt32Extension));

    assertEqualsForProto(
        [1, 2],
        baseBuilder.getExtension(Primitives.repeatedInt32Extension).toArray());
    assertEqualsForProto(
        [1, 2],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt32Extension)
            .toArray());
  }

  testRepeatedIntExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.getExtensionAtIndex(
              Primitives.repeatedInt32Extension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedInt32Extension, ListView.copyOf([1, 2]));

    assertEqualsForProto(
        1,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedInt32Extension, 0));
    assertEqualsForProto(
        1,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedInt32Extension, 0));
    assertEqualsForProto(
        2,
        baseBuilder.getExtensionAtIndex(Primitives.repeatedInt32Extension, 1));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedInt32Extension, 1));
  }

  testRepeatedIntExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Primitives.repeatedInt32Extension, 2, 1));
    }

    baseBuilder.setExtension(
        Primitives.repeatedInt32Extension, ListView.copyOf([1, 2]));

    baseBuilder.setExtensionAtIndex(Primitives.repeatedInt32Extension, 0, 3);
    baseBuilder.setExtensionAtIndex(Primitives.repeatedInt32Extension, 1, 4);

    assertEqualsForProto(
        [3, 4],
        baseBuilder.getExtension(Primitives.repeatedInt32Extension).toArray());
    assertEqualsForProto(
        [3, 4],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt32Extension)
            .toArray());
  }

  testRepeatedIntExtension_add() {
    const baseBuilder = Base.newBuilder();


    baseBuilder.setExtension(
        Primitives.repeatedInt32Extension, ListView.copyOf([1, 2]));

    baseBuilder.addExtension(Primitives.repeatedInt32Extension, 3);
    baseBuilder.addExtension(Primitives.repeatedInt32Extension, 4);

    assertEqualsForProto(
        [1, 2, 3, 4],
        baseBuilder.getExtension(Primitives.repeatedInt32Extension).toArray());
    assertEqualsForProto(
        [1, 2, 3, 4],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt32Extension)
            .toArray());
  }

  testRepeatedIntExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedInt32Extension, ListView.copyOf([1, 2]));

    baseBuilder.clearExtension(Primitives.repeatedInt32Extension);

    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedInt32Extension));
  }

  testSingleLongExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleInt64Extension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleInt64Extension));
    assertEqualsForProto(
        Long.fromNumber(0),
        baseBuilder.getExtension(Primitives.singleInt64Extension));
    assertEqualsForProto(
        Long.fromNumber(0),
        baseBuilder.build().getExtension(Primitives.singleInt64Extension));

    baseBuilder.setExtension(
        Primitives.singleInt64Extension, Long.fromNumber(1));
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Primitives.singleInt64Extension));
    assertEqualsForProto(
        true,
        baseBuilder.build().hasExtension(Primitives.singleInt64Extension));

    assertEqualsForProto(
        Long.fromNumber(1),
        baseBuilder.getExtension(Primitives.singleInt64Extension));
    assertEqualsForProto(
        Long.fromNumber(1),
        baseBuilder.build().getExtension(Primitives.singleInt64Extension));
  }

  testSingleLongExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.singleInt64Extension, Long.fromNumber(1));

    baseBuilder.clearExtension(Primitives.singleInt64Extension);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleInt64Extension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleInt64Extension));
  }

  testRepeatedLongExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedInt64Extension));
    assertEqualsForProto(
        [],
        baseBuilder.getExtension(Primitives.repeatedInt64Extension).toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt64Extension)
            .toArray());

    baseBuilder.setExtension(
        Primitives.repeatedInt64Extension,
        ListView.copyOf([Long.fromNumber(1), Long.fromNumber(2)]));
    assertEqualsForProto(
        2, baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedInt64Extension));

    assertEqualsForProto(
        [Long.fromNumber(1), Long.fromNumber(2)],
        baseBuilder.getExtension(Primitives.repeatedInt64Extension).toArray());
    assertEqualsForProto(
        [Long.fromNumber(1), Long.fromNumber(2)],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt64Extension)
            .toArray());
  }

  testRepeatedLongExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.getExtensionAtIndex(
              Primitives.repeatedInt64Extension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedInt64Extension,
        ListView.copyOf([Long.fromNumber(1), Long.fromNumber(2)]));

    assertEqualsForProto(
        Long.fromNumber(1),
        baseBuilder.getExtensionAtIndex(Primitives.repeatedInt64Extension, 0));
    assertEqualsForProto(
        Long.fromNumber(1),
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedInt64Extension, 0));
    assertEqualsForProto(
        Long.fromNumber(2),
        baseBuilder.getExtensionAtIndex(Primitives.repeatedInt64Extension, 1));
    assertEqualsForProto(
        Long.fromNumber(2),
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedInt64Extension, 1));
  }

  testRepeatedLongExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Primitives.repeatedInt64Extension, 2, Long.fromNumber(1)));
    }

    baseBuilder.setExtension(
        Primitives.repeatedInt64Extension,
        ListView.copyOf([Long.fromNumber(1), Long.fromNumber(2)]));

    baseBuilder.setExtensionAtIndex(
        Primitives.repeatedInt64Extension, 0, Long.fromNumber(3));
    baseBuilder.setExtensionAtIndex(
        Primitives.repeatedInt64Extension, 1, Long.fromNumber(4));

    assertEqualsForProto(
        [Long.fromNumber(3), Long.fromNumber(4)],
        baseBuilder.getExtension(Primitives.repeatedInt64Extension).toArray());
    assertEqualsForProto(
        [Long.fromNumber(3), Long.fromNumber(4)],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt64Extension)
            .toArray());
  }

  testRepeatedLongExtension_add() {
    const baseBuilder = Base.newBuilder();


    baseBuilder.setExtension(
        Primitives.repeatedInt64Extension,
        ListView.copyOf([Long.fromNumber(1), Long.fromNumber(2)]));

    baseBuilder.addExtension(
        Primitives.repeatedInt64Extension, Long.fromNumber(3));
    baseBuilder.addExtension(
        Primitives.repeatedInt64Extension, Long.fromNumber(4));

    assertEqualsForProto(
        [
          Long.fromNumber(1), Long.fromNumber(2), Long.fromNumber(3),
          Long.fromNumber(4)
        ],
        baseBuilder.getExtension(Primitives.repeatedInt64Extension).toArray());
    assertEqualsForProto(
        [
          Long.fromNumber(1), Long.fromNumber(2), Long.fromNumber(3),
          Long.fromNumber(4)
        ],
        baseBuilder.build()
            .getExtension(Primitives.repeatedInt64Extension)
            .toArray());
  }

  testRepeatedLongExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedInt64Extension,
        ListView.copyOf([Long.fromNumber(1), Long.fromNumber(2)]));

    baseBuilder.clearExtension(Primitives.repeatedInt64Extension);

    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedInt64Extension));
  }

  testSingleMessageExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Recursive.recursiveOptional));
    assertEqualsForProto(
        false, baseBuilder.build().hasExtension(Recursive.recursiveOptional));
    assertEqualsForProto(
        Base.newBuilder().build(),
        baseBuilder.getExtension(Recursive.recursiveOptional));
    assertEqualsForProto(
        Base.newBuilder().build(),
        baseBuilder.build().getExtension(Recursive.recursiveOptional));

    baseBuilder.setExtension(
        Recursive.recursiveOptional,
        Base.newBuilder().setOptionalInt(1).build());
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Recursive.recursiveOptional));
    assertEqualsForProto(
        true, baseBuilder.build().hasExtension(Recursive.recursiveOptional));

    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(),
        baseBuilder.getExtension(Recursive.recursiveOptional));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(),
        baseBuilder.build().getExtension(Recursive.recursiveOptional));
  }

  testSingleMessageExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Recursive.recursiveOptional,
        Base.newBuilder().setOptionalInt(1).build());

    baseBuilder.clearExtension(Recursive.recursiveOptional);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Recursive.recursiveOptional));
    assertEqualsForProto(
        false, baseBuilder.build().hasExtension(Recursive.recursiveOptional));
  }

  testSingleMessageExtension_unsetReferenceEquality() {
    const baseBuilder = Base.newBuilder();

    assertTrue(
        baseBuilder.getExtension(Recursive.recursiveOptional) ===
        baseBuilder.getExtension(Recursive.recursiveOptional));
    assertTrue(
        baseBuilder.getExtension(Recursive.recursiveOptional) ===
        Base.getDefaultInstance());
    assertTrue(
        baseBuilder.build().getExtension(Recursive.recursiveOptional) ===
        baseBuilder.build().getExtension(Recursive.recursiveOptional));
    assertTrue(
        baseBuilder.build().getExtension(Recursive.recursiveOptional) ===
        Base.getDefaultInstance());
  }

  testRepeatedMessageExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Recursive.recursiveRepeated));
    assertEqualsForProto(
        0, baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated));
    assertEqualsForProto(
        [], baseBuilder.getExtension(Recursive.recursiveRepeated).toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Recursive.recursiveRepeated)
            .toArray());

    baseBuilder.setExtension(Recursive.recursiveRepeated, ListView.copyOf([
      Base.newBuilder().setOptionalInt(1).build(),
      Base.newBuilder().setOptionalInt(2).build()
    ]));
    assertEqualsForProto(
        2, baseBuilder.getExtensionCount(Recursive.recursiveRepeated));
    assertEqualsForProto(
        2, baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated));


    const builderListView =
        baseBuilder.getExtension(Recursive.recursiveRepeated);
    const protoListView =
        baseBuilder.build().getExtension(Recursive.recursiveRepeated);

    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(), builderListView.get(0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(), protoListView.get(0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(2).build(), builderListView.get(1));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(2).build(), protoListView.get(1));
  }

  testRepeatedMessageExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () =>
              baseBuilder.getExtensionAtIndex(Recursive.recursiveRepeated, 0));
    }

    baseBuilder.setExtension(Recursive.recursiveRepeated, ListView.copyOf([
      Base.newBuilder().setOptionalInt(1).build(),
      Base.newBuilder().setOptionalInt(2).build()
    ]));

    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(),
        baseBuilder.getExtensionAtIndex(Recursive.recursiveRepeated, 0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(),
        baseBuilder.build().getExtensionAtIndex(
            Recursive.recursiveRepeated, 0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(2).build(),
        baseBuilder.getExtensionAtIndex(Recursive.recursiveRepeated, 1));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(2).build(),
        baseBuilder.build().getExtensionAtIndex(
            Recursive.recursiveRepeated, 1));
  }

  testRepeatedMessageExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Recursive.recursiveRepeated, 2,
              Base.newBuilder().setOptionalInt(1).build()));
    }

    baseBuilder.setExtension(Recursive.recursiveRepeated, ListView.copyOf([
      Base.newBuilder().setOptionalInt(1).build(),
      Base.newBuilder().setOptionalInt(2).build()
    ]));

    baseBuilder.setExtensionAtIndex(
        Recursive.recursiveRepeated, 0,
        Base.newBuilder().setOptionalInt(3).build());
    baseBuilder.setExtensionAtIndex(
        Recursive.recursiveRepeated, 1,
        Base.newBuilder().setOptionalInt(4).build());

    const builderListView =
        baseBuilder.getExtension(Recursive.recursiveRepeated);
    const protoListView =
        baseBuilder.build().getExtension(Recursive.recursiveRepeated);

    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(3).build(), builderListView.get(0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(3).build(), protoListView.get(0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(4).build(), builderListView.get(1));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(4).build(), protoListView.get(1));
  }

  testRepeatedMessageExtension_add() {
    const baseBuilder = Base.newBuilder();


    baseBuilder.setExtension(Recursive.recursiveRepeated, ListView.copyOf([
      Base.newBuilder().setOptionalInt(1).build(),
      Base.newBuilder().setOptionalInt(2).build()
    ]));

    baseBuilder.addExtension(
        Recursive.recursiveRepeated,
        Base.newBuilder().setOptionalInt(3).build());
    baseBuilder.addExtension(
        Recursive.recursiveRepeated,
        Base.newBuilder().setOptionalInt(4).build());

    const builderListView =
        baseBuilder.getExtension(Recursive.recursiveRepeated);
    const protoListView =
        baseBuilder.build().getExtension(Recursive.recursiveRepeated);

    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(), builderListView.get(0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(1).build(), protoListView.get(0));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(2).build(), builderListView.get(1));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(2).build(), protoListView.get(1));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(3).build(), builderListView.get(2));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(3).build(), protoListView.get(2));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(4).build(), builderListView.get(3));
    assertEqualsForProto(
        Base.newBuilder().setOptionalInt(4).build(), protoListView.get(3));
  }

  testRepeatedMessageExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Recursive.recursiveRepeated, ListView.copyOf([
      Base.newBuilder().setOptionalInt(1).build(),
      Base.newBuilder().setOptionalInt(2).build()
    ]));

    baseBuilder.clearExtension(Recursive.recursiveRepeated);

    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Recursive.recursiveRepeated));
    assertEqualsForProto(
        0, baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated));
  }

  testSingleStringExtension_get_hasExtension() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleStringExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleStringExtension));
    assertEqualsForProto(
        '', baseBuilder.getExtension(Primitives.singleStringExtension));
    assertEqualsForProto(
        '', baseBuilder.build().getExtension(Primitives.singleStringExtension));

    baseBuilder.setExtension(Primitives.singleStringExtension, '1');
    assertEqualsForProto(
        true, baseBuilder.hasExtension(Primitives.singleStringExtension));
    assertEqualsForProto(
        true,
        baseBuilder.build().hasExtension(Primitives.singleStringExtension));

    assertEqualsForProto(
        '1', baseBuilder.getExtension(Primitives.singleStringExtension));
    assertEqualsForProto(
        '1',
        baseBuilder.build().getExtension(Primitives.singleStringExtension));
  }

  testSingleStringExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleStringExtension, '1');

    baseBuilder.clearExtension(Primitives.singleStringExtension);

    assertEqualsForProto(
        false, baseBuilder.hasExtension(Primitives.singleStringExtension));
    assertEqualsForProto(
        false,
        baseBuilder.build().hasExtension(Primitives.singleStringExtension));
  }

  testRepeatedStringExtension_count_get() {
    const baseBuilder = Base.newBuilder();
    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedStringExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedStringExtension));
    assertEqualsForProto(
        [],
        baseBuilder.getExtension(Primitives.repeatedStringExtension).toArray());
    assertEqualsForProto(
        [],
        baseBuilder.build()
            .getExtension(Primitives.repeatedStringExtension)
            .toArray());

    baseBuilder.setExtension(
        Primitives.repeatedStringExtension, ListView.copyOf(['1', '2']));
    assertEqualsForProto(
        2, baseBuilder.getExtensionCount(Primitives.repeatedStringExtension));
    assertEqualsForProto(
        2,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedStringExtension));

    assertEqualsForProto(
        ['1', '2'],
        baseBuilder.getExtension(Primitives.repeatedStringExtension).toArray());
    assertEqualsForProto(
        ['1', '2'],
        baseBuilder.build()
            .getExtension(Primitives.repeatedStringExtension)
            .toArray());
  }

  testRepeatedStringExtension_getAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.getExtensionAtIndex(
              Primitives.repeatedStringExtension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedStringExtension, ListView.copyOf(['1', '2']));

    assertEqualsForProto(
        '1',
        baseBuilder.getExtensionAtIndex(Primitives.repeatedStringExtension, 0));
    assertEqualsForProto(
        '1',
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedStringExtension, 0));
    assertEqualsForProto(
        '2',
        baseBuilder.getExtensionAtIndex(Primitives.repeatedStringExtension, 1));
    assertEqualsForProto(
        '2',
        baseBuilder.build().getExtensionAtIndex(
            Primitives.repeatedStringExtension, 1));
  }

  testRepeatedStringExtension_setAtIndex() {
    const baseBuilder = Base.newBuilder();

    if (isCheckIndex()) {
      assertThrows(
          () => baseBuilder.setExtensionAtIndex(
              Primitives.repeatedStringExtension, 2, '1'));
    }

    baseBuilder.setExtension(
        Primitives.repeatedStringExtension, ListView.copyOf(['1', '2']));

    baseBuilder.setExtensionAtIndex(Primitives.repeatedStringExtension, 0, '3');
    baseBuilder.setExtensionAtIndex(Primitives.repeatedStringExtension, 1, '4');

    assertEqualsForProto(
        ['3', '4'],
        baseBuilder.getExtension(Primitives.repeatedStringExtension).toArray());
    assertEqualsForProto(
        ['3', '4'],
        baseBuilder.build()
            .getExtension(Primitives.repeatedStringExtension)
            .toArray());
  }

  testRepeatedStringExtension_add() {
    const baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(
        Primitives.repeatedStringExtension, ListView.copyOf(['1', '2']));

    baseBuilder.addExtension(Primitives.repeatedStringExtension, '3');
    baseBuilder.addExtension(Primitives.repeatedStringExtension, '4');

    assertEqualsForProto(
        ['1', '2', '3', '4'],
        baseBuilder.getExtension(Primitives.repeatedStringExtension).toArray());
    assertEqualsForProto(
        ['1', '2', '3', '4'],
        baseBuilder.build()
            .getExtension(Primitives.repeatedStringExtension)
            .toArray());
  }

  testRepeatedStringExtension_clear() {
    const baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedStringExtension, ListView.copyOf(['1', '2']));

    baseBuilder.clearExtension(Primitives.repeatedStringExtension);

    assertEqualsForProto(
        0, baseBuilder.getExtensionCount(Primitives.repeatedStringExtension));
    assertEqualsForProto(
        0,
        baseBuilder.build().getExtensionCount(
            Primitives.repeatedStringExtension));
  }
}

testSuite(new ExtensionsTest());
