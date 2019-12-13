/**
 * @fileoverview Test for hashing.js.
 */
goog.module('proto.im.internal.HashingTest');
goog.setTestOnly();

const Hashing = goog.require('proto.im.internal.Hashing');
const testSuite = goog.require('goog.testing.testSuite');


class HashingTest {
  testBoolean() {
    assertEquals(Hashing.hash(true), Hashing.hash(true));
    assertEquals(Hashing.hash(false), Hashing.hash(false));
    assertNotEquals(0, Hashing.hash(true));
    assertNotEquals(Hashing.hash(true), Hashing.hash(false));
  }

  testNumber() {
    assertEquals(Hashing.hash(4), Hashing.hash(4));
    assertEquals(Hashing.hash(-4), Hashing.hash(-4));
    assertNotEquals(Hashing.hash(4), Hashing.hash(5));
    assertNotEquals(0, Hashing.hash(5));

    // test coercion back to 32 bits
    const bigNumber = 99999999999999999999999;
    assertTrue(Hashing.hash(bigNumber) < Math.pow(2, 31) + 1);
    assertTrue(Hashing.hash(bigNumber) > -Math.pow(2, 31) - 1);
  }

  testString() {
    assertEquals(Hashing.hash('foo'), Hashing.hash('foo'));
    assertEquals(Hashing.hash('bar'), Hashing.hash('bar'));
    assertNotEquals(Hashing.hash('foo'), Hashing.hash('bar'));
  }

  testObject() {
    assertEquals(Hashing.hash({1: 'foo'}), Hashing.hash({1: 'foo'}));
    assertEquals(
        Hashing.hash({1: 'foo', 2: true}), Hashing.hash({1: 'foo', 2: true}));
    assertEquals(
        Hashing.hash({1: 'foo', 2: true}), Hashing.hash({2: true, 1: 'foo'}));

    assertNotEquals(
        Hashing.hash({1: 'foo', 2: false}), Hashing.hash({2: true, 1: 'foo'}));

    // should ignore non integer keys
    assertEquals(
        Hashing.hash({1: 'foo', bar: true}),
        Hashing.hash({1: 'foo', baz: 'foo'}));
  }

  testArray() {
    assertEquals(Hashing.hash(['foo']), Hashing.hash(['foo']));
    assertEquals(Hashing.hash(['foo', true]), Hashing.hash(['foo', true]));
    assertNotEquals(Hashing.hash(['foo', true]), Hashing.hash([true, 'bar']));
  }

  testPivot() {
    // make sure that we produce the same hash for objects that have the same
    // values in the extension object
    assertEquals(
        Hashing.hash(['foo', {4: 'bar'}]),
        Hashing.hash(['foo', null, null, null, 'bar']));

    // make sure nulls do not affect the outcome
    assertEquals(
        Hashing.hash(['foo', {4: null}]),
        Hashing.hash(['foo', null, null, null, null]));

    assertNotEquals(
        Hashing.hash(['foo', {4: 'bar'}]),
        Hashing.hash(['foo', null, null, null, 'baz']));
  }

  testEnsureNotOverflowInArray() {
    const hashValue = Hashing.hash([Math.pow(2, 31) - 1, 20]);
    assertTrue(hashValue <= Math.pow(2, 31) - 1);
    assertTrue(hashValue >= -Math.pow(2, 31));
  }

  testEnsureNotOverflowInObject() {
    const hashValue = Hashing.hash({1: Math.pow(2, 31) - 1, 2: 20});
    assertTrue(hashValue <= Math.pow(2, 31) - 1);
    assertTrue(hashValue >= -Math.pow(2, 31));
  }
}

testSuite(new HashingTest());
