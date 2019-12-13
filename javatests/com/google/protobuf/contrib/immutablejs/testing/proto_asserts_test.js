/**
 * @fileoverview Description of this file.
 */
goog.module('proto.im.proto_asserts_test');
goog.setTestOnly();

const ByteString = goog.require('proto.im.ByteString');
const Long = goog.require('goog.math.Long');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');

class ProtoAssertsTest {
  testBoolean() {
    assertEqualsForProto(true, true);
    assertEqualsForProto(false, false);
    assertThrowsJsUnitException(() => assertEqualsForProto(true, false));
    assertThrowsJsUnitException(() => assertEqualsForProto(false, true));
    assertThrowsJsUnitException(() => assertEqualsForProto(false, 0));
    assertThrowsJsUnitException(() => assertEqualsForProto(true, 1));
  }

  testNumbers() {
    assertEqualsForProto(1, 1);
    assertEqualsForProto(NaN, NaN);
    assertThrowsJsUnitException(() => assertEqualsForProto(1, 0));
    assertThrowsJsUnitException(() => assertEqualsForProto(NaN, 0));
  }

  testStrings() {
    assertEqualsForProto('1', '1');
    assertThrowsJsUnitException(() => assertEqualsForProto('1', '0'));
  }

  testLong() {
    assertEqualsForProto(Long.fromInt(1), Long.fromInt(1));
    assertEqualsForProto(
        Long.fromNumber(3000000000), Long.fromNumber(3000000000));
    assertThrowsJsUnitException(
        () => assertEqualsForProto(Long.fromInt(1), Long.fromInt(2)));
  }

  testByteString() {
    assertEqualsForProto(ByteString.copyFrom([1]), ByteString.copyFrom([1]));
    assertEqualsForProto(ByteString.copyFrom([10]), ByteString.copyFrom([10]));
    assertThrowsJsUnitException(
        () => assertEqualsForProto(
            ByteString.copyFrom([0]), ByteString.copyFrom([10])));
  }

  testArrays() {
    assertEqualsForProto(['1'], ['1']);
    assertEqualsForProto(Long.fromInt(1), Long.fromInt(1));
    assertThrowsJsUnitException(() => assertEqualsForProto(['1'], ['0']));
    assertThrowsJsUnitException(
        () => assertEqualsForProto(Long.fromInt(1), Long.fromInt(2)));
  }
}

testSuite(new ProtoAssertsTest());
