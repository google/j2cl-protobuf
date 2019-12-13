goog.module('proto.im.integration.ByteStringFieldsTest');
goog.setTestOnly();

const ByteString = goog.require('proto.im.ByteString');
const base64 = goog.require('goog.crypt.base64');
const testSuite = goog.require('goog.testing.testSuite');
const {isCheckType} = goog.require('proto.im.internal.internalChecks');


const TEST_BYTES = [1, 2, 3, 4];
const TEST_STRING = ByteString.copyFrom(TEST_BYTES);

class ByteStringTest {
  testEquality() {
    assertTrue(ByteString.EMPTY.equals(ByteString.copyFrom([])));
    assertTrue(TEST_STRING.equals(ByteString.copyFrom(TEST_BYTES.slice())));
    assertFalse(TEST_STRING.equals(ByteString.copyFrom([1, 2, 3, 5])));
  }

  testHashCode() {
    assertEquals(
        ByteString.EMPTY.hashCode(), ByteString.copyFrom([]).hashCode());
    assertEquals(
        TEST_STRING.hashCode(),
        ByteString.copyFrom(TEST_BYTES.slice()).hashCode());
  }

  testFromBase64_null() {
    if (isCheckType()) {
      assertThrows(
          () => ByteString.fromBase64String(
              /** @type {string} */ (/** @type {*} */ (null))));
    }
  }

  testFromBase64_regularValue() {
    const halloInBase64 = 'aGFsbG8=';  // hallo in base64
    const halloByteString = ByteString.fromBase64String(halloInBase64);
    const halloByteStringSecondInstance =
        ByteString.fromBase64String(halloInBase64);

    assertTrue(halloByteString.equals(halloByteStringSecondInstance));
    assertEquals(
        halloByteString.hashCode(), halloByteStringSecondInstance.hashCode());

    const newByteArray = halloByteString.toByteArray().slice();
    // change one byte in the array
    newByteArray[0] += 1;
    const differentByteString = ByteString.copyFrom(newByteArray);
    assertTrue(halloByteString.hashCode() != differentByteString.hashCode());
    assertFalse(halloByteString.equals(differentByteString));
  }

  testToBase64() {
    const halloInBase64 = 'aGFsbG8=';  // hallo in base64
    const halloByteString = ByteString.fromBase64String(halloInBase64);
    assertEquals(halloInBase64, halloByteString.toBase64String());
  }

  testIsEmpty() {
    assertTrue(ByteString.EMPTY.isEmpty());
    assertTrue(
        ByteString.fromBase64String(base64.encodeByteArray([])).isEmpty());
    assertTrue(ByteString.copyFrom([]).isEmpty());

    assertFalse(
        ByteString.fromBase64String(base64.encodeByteArray([1])).isEmpty());
    assertFalse(ByteString.copyFrom([1]).isEmpty());
  }
}

testSuite(new ByteStringTest());
