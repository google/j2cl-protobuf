goog.module('proto.im.testdata.AppsJspbInteropTest');
goog.setTestOnly('proto.im.testdata.AppsJspbInteropTest');

const ByteString = goog.require('proto.im.ByteString');
const ImmutableProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const ListView = goog.require('proto.im.ListView');
const Long = goog.require('goog.math.Long');
const MutableProto = goog.require('proto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');


const HALLO_IN_BASE64 = 'aGFsbG8=';

class AppsJspbInteropTest {
  testSingleBoolean_fromImmutable_true() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalBool(true).build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testSingleBoolean_toImmutable_true() {
    const mutableProto = new MutableProto().setOptionalBool(true);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testSingleBoolean_fromImmutable_false() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalBool(false).build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testSingleBoolean_toImmutable_false() {
    const mutableProto = new MutableProto().setOptionalBool(false);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleBoolean(immutableProto, mutableProto);
  }

  testRepeatedBoolean_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedBool(ListView.copyOf([true, false]))
            .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedBoolean(immutableProto, mutableProto);
  }

  testRepeatedBoolean_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedBoolList([true, false]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedBoolean(immutableProto, mutableProto);
  }

  testSingleByteString_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .setOptionalBytes(ByteString.fromBase64String(HALLO_IN_BASE64))
            .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleBytes(immutableProto, mutableProto);
  }

  testSingleByteString_toImmutable() {
    const mutableProto = new MutableProto().setOptionalBytes(HALLO_IN_BASE64);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleBytes(immutableProto, mutableProto);
  }

  testRepeatedByteString_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedBytes(
                ListView.copyOf([ByteString.fromBase64String(HALLO_IN_BASE64)]))
            .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedBytes(immutableProto, mutableProto);
  }

  testRepeatedByteString_toImmutable() {
    const mutableProto =
        new MutableProto().setRepeatedBytesList([HALLO_IN_BASE64]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedBytes(immutableProto, mutableProto);
  }

  testSingleDouble_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalDouble(12).build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleDouble(immutableProto, mutableProto);
  }

  testSingleDouble_toImmutable() {
    const mutableProto = new MutableProto().setOptionalDouble(12);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleDouble(immutableProto, mutableProto);
  }

  testRepeatedDouble_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedDouble(ListView.copyOf([12, 24]))
                               .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedDouble(immutableProto, mutableProto);
  }

  testRepeatedDouble_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedDoubleList([12, 24]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedDouble(immutableProto, mutableProto);
  }

  testSingleEnum_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .setOptionalEnum(ImmutableProto.TestEnum.ONE)
                               .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleEnum(immutableProto, mutableProto);
  }

  testSingleEnum_toImmutable() {
    const mutableProto =
        new MutableProto().setOptionalEnum(MutableProto.TestEnum.ONE);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleEnum(immutableProto, mutableProto);
  }

  testRepeatedEnum_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedEnum(ListView.copyOf(
                [ImmutableProto.TestEnum.ONE, ImmutableProto.TestEnum.TWO]))
            .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedEnum(immutableProto, mutableProto);
  }

  testRepeatedEnum_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedEnumList(
        [MutableProto.TestEnum.ONE, MutableProto.TestEnum.TWO]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedEnum(immutableProto, mutableProto);
  }

  testSingleFloat_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalFloat(12).build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleFloat(immutableProto, mutableProto);
  }

  testSingleFloat_toImmutable() {
    const mutableProto = new MutableProto().setOptionalFloat(12);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleFloat(immutableProto, mutableProto);
  }

  testRepeatedFloat_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedFloat(ListView.copyOf([12, 24]))
                               .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedFloat(immutableProto, mutableProto);
  }

  testRepeatedFloat_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedFloatList([12, 24]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedFloat(immutableProto, mutableProto);
  }

  testSingleInt_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalInt(12).build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleInt(immutableProto, mutableProto);
  }

  testSingleInt_toImmutable() {
    const mutableProto = new MutableProto().setOptionalInt(12);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleInt(immutableProto, mutableProto);
  }

  testRepeatedInt_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedInt(ListView.copyOf([12, 24]))
                               .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedInt(immutableProto, mutableProto);
  }

  testRepeatedInt_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedIntList([12, 24]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedInt(immutableProto, mutableProto);
  }

  testSingleInt52Long_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .setOptionalInt52Long(Long.fromInt(12))
                               .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleInt52Long(immutableProto, mutableProto);
  }

  testSingleInt52Long_toImmutable() {
    const mutableProto = new MutableProto().setOptionalInt52long(12);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleInt52Long(immutableProto, mutableProto);
  }

  testRepeatedInt52Long_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedInt52Long(ListView.copyOf(
                                   [Long.fromInt(12), Long.fromInt(24)]))
                               .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedInt52Long(immutableProto, mutableProto);
  }

  testRepeatedInt52Long_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedInt52longList([12, 24]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedInt52Long(immutableProto, mutableProto);
  }

  testSingleLong_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalLong(Long.fromInt(12)).build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleLong(immutableProto, mutableProto);
  }

  testSingleLong_toImmutable() {
    const mutableProto = new MutableProto().setOptionalLong('12');
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleLong(immutableProto, mutableProto);
  }

  testRepeatedLong_fromImmutable() {
    const immutableProto = ImmutableProto.newBuilder()
                               .addAllRepeatedLong(ListView.copyOf(
                                   [Long.fromInt(12), Long.fromInt(24)]))
                               .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedLong(immutableProto, mutableProto);
  }

  testRepeatedLong_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedLongList(['12', '24']);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedLong(immutableProto, mutableProto);
  }


  testSingleMessage_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .setOptionalMessage(ImmutableProto.NestedMessage.newBuilder()
                                    .setPayload('p1')
                                    .build())
            .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleMessage(immutableProto, mutableProto);
  }

  testSingleMessage_toImmutable() {
    const nested = new MutableProto.NestedMessage().setPayload('p1');
    const mutableProto = new MutableProto().setOptionalMessage(nested);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleMessage(immutableProto, mutableProto);
  }

  testRepeatedMessage_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedMessage(ListView.copyOf([
              ImmutableProto.NestedMessage.newBuilder().setPayload('p1').build()
            ]))
            .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedMessage(immutableProto, mutableProto);
  }

  testRepeatedMessage_toImmutable() {
    const nested = new MutableProto.NestedMessage().setPayload('p1');
    const mutableProto = new MutableProto().setRepeatedMessageList([nested]);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedMessage(immutableProto, mutableProto);
  }



  testSingleString_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder().setOptionalString('12').build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertSingleString(immutableProto, mutableProto);
  }

  testSingleString_toImmutable() {
    const mutableProto = new MutableProto().setOptionalString('12');
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertSingleString(immutableProto, mutableProto);
  }

  testRepeatedString_fromImmutable() {
    const immutableProto =
        ImmutableProto.newBuilder()
            .addAllRepeatedString(ListView.copyOf(['12', '24']))
            .build();
    const mutableProto = MutableProto.deserialize(immutableProto.serialize());
    assertRepeatedString(immutableProto, mutableProto);
  }

  testRepeatedString_toImmutable() {
    const mutableProto = new MutableProto().setRepeatedStringList(['12', '24']);
    const immutableProto = ImmutableProto.parse(mutableProto.serialize());
    assertRepeatedString(immutableProto, mutableProto);
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
      mutableProto.getOptionalBytes());
}

/**
 * @param {!ImmutableProto} immutableProto
 * @param {!MutableProto} mutableProto
 */
function assertRepeatedBytes(immutableProto, mutableProto) {
  const imarray = immutableProto.getRepeatedBytesList().toArray();
  const marray = mutableProto.getRepeatedBytesList();
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

testSuite(new AppsJspbInteropTest());
