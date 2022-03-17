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

goog.module('proto.im.testdata.AppsJspbInteropTest');
goog.setTestOnly('proto.im.testdata.AppsJspbInteropTest');

const ByteString = goog.require('proto.im.ByteString');
const ImmutableMessage = goog.require('proto.im.Message');
const ImmutablePrimitives = goog.require('improto.protobuf.contrib.immutablejs.protos.Primitives');
const ImmutableProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const ImmutableProtoWithExtension = goog.require('improto.protobuf.contrib.immutablejs.protos.Base');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const MutablePrimitives = goog.require('proto.protobuf.contrib.immutablejs.protos.Primitives');
const MutableProto = goog.require('proto.protobuf.contrib.immutablejs.protos.TestProto');
const MutableProtoWithExtension = goog.require('proto.protobuf.contrib.immutablejs.protos.Base');
const testSuite = goog.require('goog.testing.testSuite');
const {Message: MutableMessage} = goog.require('jspb');
const {asFrozenJspb, asImmutable} = goog.require('proto.im.Compat');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {copyFrozen} = goog.require('jspb.Message.Freezer');


const HALLO_IN_BASE64 = 'aGFsbG8=';
const HALLO_IN_BYTESTRING = ByteString.fromBase64String(HALLO_IN_BASE64);

/** @abstract */
class AppsJspbInteropTest {
  /**
   * @param {!ImmutableMessage} immutableInstance
   * @param {function(new:T,...):undefined} jspbCtor
   * @param {function(string):T} jspbParser
   * @return {T}
   * @template T type of JSPB message.
   * @abstract
   */
  fromImmutable(immutableInstance, jspbCtor, jspbParser) {}

  /**
   * @param {!MutableMessage} jspbInstance
   * @param {function(new:T,...):undefined} immutableProtoCtor
   * @param {function(string):T} immutableProtoParser
   * @return {T}
   * @template T type of immutable js proto message.
   * @abstract
   */
  toImmutable(jspbInstance, immutableProtoCtor, immutableProtoParser) {}

  testSingleBoolean_fromImmutable_true() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalBool(true).build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testSingleBoolean_toImmutable_true() {
    const mutableProto = new MutableProto().setOptionalBool(true);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testSingleBoolean_fromImmutable_false() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalBool(false).build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testSingleBoolean_toImmutable_false() {
    const mutableProto = new MutableProto().setOptionalBool(false);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testRepeatedBoolean_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedBool(ListView.copyOf([true, false]))
            .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedBoolean(immutableProto, mutableProto);
  }

  testRepeatedBoolean_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedBoolList([true, false]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedBoolean(immutableProto, mutableProto);
  }

  testSingleByteString_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .setOptionalBytes(HALLO_IN_BYTESTRING)
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleBytes(immutableProto, mutableProto);
  }

  testSingleByteString_toImmutable() {
    let mutableProto = new MutableProto().setOptionalBytes(HALLO_IN_BASE64);
    let immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleBytes(immutableProto, mutableProto);

    mutableProto =
        new MutableProto().setOptionalBytes(HALLO_IN_BYTESTRING.toUint8Array());
    immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleBytes(immutableProto, mutableProto);
  }

  testRepeatedByteString_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedBytes(ListView.copyOf([HALLO_IN_BYTESTRING]))
            .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedBytes(immutableProto, mutableProto);
  }

  testRepeatedByteString_toImmutable() {
    const mutableProto =
        new MutableProto().setRepeatedBytesList([HALLO_IN_BASE64]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedBytes(immutableProto, mutableProto);
  }

  testSingleDouble_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalDouble(12).build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleDouble(immutableProto, mutableProto);
  }

  testSingleDouble_toImmutable() {
    const mutableProto = new MutableProto().setOptionalDouble(12);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleDouble(immutableProto, mutableProto);
  }

  testRepeatedDouble_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedDouble(ListView.copyOf([12, 24]))
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedDouble(immutableProto, mutableProto);
  }

  testRepeatedDouble_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedDoubleList([12, 24]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedDouble(immutableProto, mutableProto);
  }

  testSingleEnum_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .setOptionalEnum(ImmutableProto.TestEnum.ONE)
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleEnum(immutableProto, mutableProto);
  }

  testSingleEnum_toImmutable() {
    const mutableProto =
        new MutableProto().setOptionalEnum(MutableProto.TestEnum.ONE);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleEnum(immutableProto, mutableProto);
  }

  testRepeatedEnum_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedEnum(ListView.copyOf(
                [ImmutableProto.TestEnum.ONE, ImmutableProto.TestEnum.TWO]))
            .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedEnum(immutableProto, mutableProto);
  }

  testRepeatedEnum_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedEnumList(
        [MutableProto.TestEnum.ONE, MutableProto.TestEnum.TWO]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedEnum(immutableProto, mutableProto);
  }

  testSingleFloat_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalFloat(12).build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleFloat(immutableProto, mutableProto);
  }

  testSingleFloat_toImmutable() {
    const mutableProto = new MutableProto().setOptionalFloat(12);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleFloat(immutableProto, mutableProto);
  }

  testRepeatedFloat_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedFloat(ListView.copyOf([12, 24]))
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedFloat(immutableProto, mutableProto);
  }

  testRepeatedFloat_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedFloatList([12, 24]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedFloat(immutableProto, mutableProto);
  }

  testSingleInt_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalInt(12).build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleInt(immutableProto, mutableProto);
  }

  testSingleInt_toImmutable() {
    const mutableProto = new MutableProto().setOptionalInt(12);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleInt(immutableProto, mutableProto);
  }

  testRepeatedInt_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedInt(ListView.copyOf([12, 24]))
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedInt(immutableProto, mutableProto);
  }

  testRepeatedInt_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedIntList([12, 24]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedInt(immutableProto, mutableProto);
  }

  testSingleInt52Long_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .setOptionalInt52Long(Long.fromInt(12))
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleInt52Long(immutableProto, mutableProto);
  }

  testSingleInt52Long_toImmutable() {
    const mutableProto = new MutableProto().setOptionalInt52long(12);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleInt52Long(immutableProto, mutableProto);
  }

  testRepeatedInt52Long_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedInt52Long(ListView.copyOf(
                                   [Long.fromInt(12), Long.fromInt(24)]))
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedInt52Long(immutableProto, mutableProto);
  }

  testRepeatedInt52Long_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedInt52longList([12, 24]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedInt52Long(immutableProto, mutableProto);
  }

  testSingleLong_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalLong(Long.fromInt(12)).build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleLong(immutableProto, mutableProto);
  }

  testSingleLong_toImmutable() {
    const mutableProto = new MutableProto().setOptionalLong('12');
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleLong(immutableProto, mutableProto);
  }

  testRepeatedLong_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedLong(ListView.copyOf(
                                   [Long.fromInt(12), Long.fromInt(24)]))
                               .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedLong(immutableProto, mutableProto);
  }

  testRepeatedLong_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedLongList(['12', '24']);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedLong(immutableProto, mutableProto);
  }


  testSingleMessage_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .setOptionalMessage(ImmutableProto.NestedMessage.newBuilder()
                                    .setPayload('p1')
                                    .build())
            .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleMessage(immutableProto, mutableProto);
  }

  testSingleMessage_toImmutable() {
    const nested = new MutableProto.NestedMessage().setPayload('p1');
    const mutableProto = new MutableProto().setOptionalMessage(nested);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleMessage(immutableProto, mutableProto);
  }

  testRepeatedMessage_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedMessage(ListView.copyOf([
              ImmutableProto.NestedMessage.newBuilder().setPayload('p1').build()
            ]))
            .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedMessage(immutableProto, mutableProto);
  }

  testRepeatedMessage_toImmutable() {
    const nested = new MutableProto.NestedMessage().setPayload('p1');
    const mutableProto = new MutableProto().setRepeatedMessageList([nested]);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedMessage(immutableProto, mutableProto);
  }

  testSingleString_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalString('12').build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertSingleString(immutableProto, mutableProto);
  }

  testSingleString_toImmutable() {
    const mutableProto = new MutableProto().setOptionalString('12');
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertSingleString(immutableProto, mutableProto);
  }

  testRepeatedString_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedString(ListView.copyOf(['12', '24']))
            .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProto, MutableProto.deserialize);
    assertRepeatedString(immutableProto, mutableProto);
  }

  testRepeatedString_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedStringList(['12', '24']);
    const immutableProto =
        this.toImmutable(mutableProto, ImmutableProto, ImmutableProto.parse);
    assertRepeatedString(immutableProto, mutableProto);
  }

  testExtension_fromImmutable() {
    const immutableProto =
        ImmutableProtoWithExtension.newBuilder()
            .setExtension(ImmutablePrimitives.singleStringExtension, '42')
            .build();
    const mutableProto = this.fromImmutable(
        immutableProto, MutableProtoWithExtension,
        MutableProtoWithExtension.deserialize);
    assertExtensionString(immutableProto, mutableProto);
  }

  testExtension_toImmutable() {
    const mutableProto = new MutableProtoWithExtension().setExtension(
        MutablePrimitives.singleStringExtension, '42');
    const immutableProto = this.toImmutable(
        mutableProto, ImmutableProtoWithExtension,
        ImmutableProtoWithExtension.parse);
    assertExtensionString(immutableProto, mutableProto);
  }

  testSerialization_specialValues() {
    // JSPB doesn't necessarily ensure in memory format matches wire (for
    // example for special number values).

    let serializedImmutable =
        this.toImmutable(
                new MutableProto().setOptionalDouble(NaN),
                ImmutableProto, ImmutableProto.parse)
            .serialize();
    assertEqualsForProto('NaN', JSON.parse(serializedImmutable)[12]);

    serializedImmutable = this.toImmutable(
                                  new MutableProto().setOptionalBytes(
                                      HALLO_IN_BYTESTRING.toUint8Array()),
                                  ImmutableProto, ImmutableProto.parse)
                              .serialize();
    assertEqualsForProto(HALLO_IN_BASE64, JSON.parse(serializedImmutable)[27]);
  }
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleBoolean(immutableProto, mutableProto) {
  // mutable version returns 1/0
  assertEqualsForProto(
      immutableProto.getOptionalBool(), !!mutableProto.getOptionalBool());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedBoolean(immutableProto, mutableProto) {
  // mutable version returns 1/0
  const imarray = immutableProto.getRepeatedBoolList().toArray();
  const marray = mutableProto.getRepeatedBoolList();
  assertEqualsForProto(imarray.length, marray.length);
  assertEqualsForProto(imarray[0], !!marray[0]);
  assertEqualsForProto(imarray[1], !!marray[1]);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleBytes(immutableProto, mutableProto) {
  assertEqualsForProto(
      HALLO_IN_BASE64, immutableProto.getOptionalBytes().toBase64String());
  assertEqualsForProto(
      immutableProto.getOptionalBytes().toBase64String(),
      // Return type of AppJSPB getOptionalBytes is incorrect and might return
      // UInt8Array; make sure we have the converted result (b/154961283).
      mutableProto.getOptionalBytes_asB64());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedBytes(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedBytesList().toArray();
  // Return type of AppJSPB getRepeatedBytesList is incorrect and might return
  // Array<UInt8Array>; make sure we have the converted result (b/154961283).
  const marray = mutableProto.getRepeatedBytesList_asB64();
  assertEqualsForProto(1, marray.length);
  assertEqualsForProto(imarray.length, marray.length);
  assertEqualsForProto(imarray[0].toBase64String(), marray[0]);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleDouble(immutableProto, mutableProto) {
  assertEqualsForProto(12, immutableProto.getOptionalDouble());
  assertEqualsForProto(
      immutableProto.getOptionalDouble(), mutableProto.getOptionalDouble());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedDouble(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedDoubleList().toArray();
  const marray = mutableProto.getRepeatedDoubleList();
  assertEqualsForProto(2, marray.length);
  assertEqualsForProto(imarray, marray);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleEnum(immutableProto, mutableProto) {
  assertEqualsForProto(
      ImmutableProto.TestEnum.ONE, immutableProto.getOptionalEnum());
  assertEqualsForProto(
      immutableProto.getOptionalEnum(), mutableProto.getOptionalEnum());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedEnum(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedEnumList().toArray();
  const marray = mutableProto.getRepeatedEnumList();
  assertEqualsForProto(2, marray.length);
  assertEqualsForProto(
      [ImmutableProto.TestEnum.ONE, ImmutableProto.TestEnum.TWO], imarray);
  assertEqualsForProto(imarray, marray);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleFloat(immutableProto, mutableProto) {
  assertEqualsForProto(12, immutableProto.getOptionalFloat());
  assertEqualsForProto(
      immutableProto.getOptionalFloat(), mutableProto.getOptionalFloat());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedFloat(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedFloatList().toArray();
  const marray = mutableProto.getRepeatedFloatList();
  assertEqualsForProto(2, marray.length);
  assertEqualsForProto(imarray, marray);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleInt(immutableProto, mutableProto) {
  assertEqualsForProto(12, immutableProto.getOptionalInt());
  assertEqualsForProto(
      immutableProto.getOptionalInt(), mutableProto.getOptionalInt());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedInt(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedIntList().toArray();
  const marray = mutableProto.getRepeatedIntList();
  assertEqualsForProto(2, marray.length);
  assertEqualsForProto(imarray, marray);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleInt52Long(immutableProto, mutableProto) {
  assertEqualsForProto(Long.fromInt(12), immutableProto.getOptionalInt52Long());
  assertEqualsForProto(
      immutableProto.getOptionalInt52Long().toNumber(),
      mutableProto.getOptionalInt52long());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedInt52Long(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedInt52LongList().toArray();
  const marray = mutableProto.getRepeatedInt52longList();
  assertEqualsForProto(2, marray.length);
  assertEqualsForProto(imarray[0].toNumber(), marray[0]);
  assertEqualsForProto(imarray[1].toNumber(), marray[1]);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleLong(immutableProto, mutableProto) {
  assertEqualsForProto(Long.fromInt(12), immutableProto.getOptionalLong());
  assertEqualsForProto(
      immutableProto.getOptionalLong().toString(),
      mutableProto.getOptionalLong());
}


/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedLong(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedLongList().toArray();
  const marray = mutableProto.getRepeatedLongList();
  assertEqualsForProto(2, marray.length);
  assertEqualsForProto(imarray[0].toString(), marray[0]);
  assertEqualsForProto(imarray[1].toString(), marray[1]);
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleMessage(immutableProto, mutableProto) {
  assertEqualsForProto('p1', immutableProto.getOptionalMessage().getPayload());
  assertEqualsForProto(
      immutableProto.getOptionalMessage().getPayload(),
      mutableProto.getOptionalMessage().getPayload());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedMessage(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedMessageList().toArray();
  const marray = mutableProto.getRepeatedMessageList();
  assertEqualsForProto(1, imarray.length);
  assertEqualsForProto('p1', imarray[0].getPayload());
  assertEqualsForProto(imarray[0].getPayload(), marray[0].getPayload());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertSingleString(immutableProto, mutableProto) {
  assertEqualsForProto('12', immutableProto.getOptionalString());
  assertEqualsForProto(
      immutableProto.getOptionalString(), mutableProto.getOptionalString());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedString(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedStringList().toArray();
  const marray = mutableProto.getRepeatedStringList();
  assertEqualsForProto(2, marray.length);
  assertEqualsForProto(imarray, marray);
}

/**
 * @param {!ImmutableProtoWithExtension} immutableProto
 * @param {!MutableProtoWithExtension} mutableProto
 */
function assertExtensionString(immutableProto, mutableProto) {
  assertEqualsForProto(
      '42',
      immutableProto.getExtension(ImmutablePrimitives.singleStringExtension));
  assertEqualsForProto(
      immutableProto.getExtension(ImmutablePrimitives.singleStringExtension),
      mutableProto.getExtension(MutablePrimitives.singleStringExtension));
}

class SerializerTest extends AppsJspbInteropTest {

  /**
   * @param {!ImmutableMessage} immutableInstance
   * @param {function(new:T,...):undefined} jspbCtor
   * @param {function(string):T} jspbParser
   * @return {T}
   * @template T type of JSPB message.
   * @override
   */
  fromImmutable(immutableInstance, jspbCtor, jspbParser) {
    return jspbParser(immutableInstance.serialize());
  }

  /**
   * @param {!MutableMessage} jspbInstance
   * @param {function(new:T,...):undefined} immutableProtoCtor
   * @param {function(string):T} immutableProtoParser
   * @return {T}
   * @template T type of immutable js proto message.
   * @override
   */
  toImmutable(jspbInstance, immutableProtoCtor, immutableProtoParser) {
    return immutableProtoParser(jspbInstance.serialize());
  }
}

class FrozenInteropTest extends AppsJspbInteropTest {

  /**
   * @param {!ImmutableMessage} immutableInstance
   * @param {function(new:T,...):undefined} jspbCtor
   * @param {function(string):T} jspbParser
   * @return {T}
   * @template T type of JSPB message.
   * @override
   */
  fromImmutable(immutableInstance, jspbCtor, jspbParser) {
    return asFrozenJspb(immutableInstance, jspbCtor);
  }

  /**
   * @param {!MutableMessage} jspbInstance
   * @param {function(new:T,...):undefined} immutableProtoCtor
   * @param {function(string):T} immutableProtoParser
   * @return {T}
   * @template T type of immutable js proto message.
   * @override
   */
  toImmutable(jspbInstance, immutableProtoCtor, immutableProtoParser) {
    return asImmutable(copyFrozen(jspbInstance), immutableProtoCtor);
  }
}

testSuite({
  testSerialize: new SerializerTest,
  testFrozenInterop: new FrozenInteropTest
});
