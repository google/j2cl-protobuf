goog.module('proto.im.internal.debug.DumpTest');
goog.setTestOnly('proto.im.internal.debug.DumpTest');

const ByteString = goog.require('proto.im.ByteString');
const Long = goog.require('goog.math.Long');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const debug = goog.require('proto.im.debug');
const testSuite = goog.require('goog.testing.testSuite');

class DumpTest {
  testEmptyProto() {
    if (COMPILED) {
      return;
    }
    assertObjectEquals(
        {
          '$name': 'TestProto',
          'repeatedBoolList': [],
          'repeatedIntList': [],
          'repeatedLongList': [],
          'repeatedInt52LongList': [],
          'repeatedFloatList': [],
          'repeatedDoubleList': [],
          'repeatedEnumList': [],
          'repeatedStringList': [],
          'repeatedBytesList': [],
          'repeatedMessageList': []
        },
        debug.dump(TestProto.getDefaultInstance()));
  }

  testFullProto() {
    if (COMPILED) {
      return;
    }

    const message =
        TestProto.newBuilder()
            .setOptionalBool(true)
            .setOptionalBoolWithDefault(false)
            .addRepeatedBool(true)
            .addRepeatedBool(false)
            .setOptionalInt(666)
            .setOptionalIntWithDefault(777)
            .addRepeatedInt(6)
            .addRepeatedInt(12)
            .addRepeatedInt(24)
            .setOptionalLong(Long.fromNumber(666))
            .setOptionalLongWithDefault(Long.fromString('88902389724'))
            .addRepeatedLong(Long.fromNumber(777))
            .addRepeatedLong(Long.fromString('8283'))
            .setOptionalInt52Long(Long.fromNumber(666))
            .setOptionalInt52LongWithDefault(Long.fromString('88902389724'))
            .addRepeatedInt52Long(Long.fromNumber(777))
            .addRepeatedInt52Long(Long.fromString('8283'))
            .setOptionalFloat(666.666)
            .setOptionalFloatWithDefault(777.666)
            .addRepeatedFloat(6.666)
            .addRepeatedFloat(12.12)
            .addRepeatedFloat(24.24)
            .setOptionalDouble(666.666)
            .setOptionalDoubleWithDefault(777.666)
            .addRepeatedDouble(6.666)
            .addRepeatedDouble(12.12)
            .addRepeatedDouble(24.24)
            .setOptionalEnum(TestProto.TestEnum.ONE)
            .setOptionalEnumWithDefault(TestProto.TestEnum.TWO)
            .addRepeatedEnum(TestProto.TestEnum.THREE)
            .addRepeatedEnum(TestProto.TestEnum.FOUR)
            .setOptionalString('I always get the shemp')
            .setOptionalStringWithDefault('May your heart be your guiding key')
            .addRepeatedString('My friends are my power')
            .addRepeatedString('Darknesss')
            .setOptionalBytes(ByteString.copyFrom([1]))
            .setOptionalBytesWithDefault(ByteString.copyFrom([2]))
            .addRepeatedBytes(ByteString.copyFrom([3]))
            .setOptionalMessage(TestProto.NestedMessage.getDefaultInstance())
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload(
                'I hope we find ingredients around here'))
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('Hearts'))
            .build();

    assertObjectEquals(
        {
          '$name': 'TestProto',
          'optionalBool': true,
          'optionalBoolWithDefault': false,
          'repeatedBoolList': [true, false],
          'optionalInt': 666,
          'optionalIntWithDefault': 777,
          'repeatedIntList': [6, 12, 24],
          'optionalLong': '666',
          'optionalLongWithDefault': '88902389724',
          'repeatedLongList': ['777', '8283'],
          'optionalInt52Long': '666',
          'optionalInt52LongWithDefault': '88902389724',
          'repeatedInt52LongList': ['777', '8283'],
          'optionalFloat': 666.666,
          'optionalFloatWithDefault': 777.666,
          'repeatedFloatList': [6.666, 12.12, 24.24],
          'optionalDouble': 666.666,
          'optionalDoubleWithDefault': 777.666,
          'repeatedDoubleList': [6.666, 12.12, 24.24],
          'optionalEnum': 1,
          'optionalEnumWithDefault': 2,
          'repeatedEnumList': [3, 4],
          'optionalString': 'I always get the shemp',
          'optionalStringWithDefault': 'May your heart be your guiding key',
          'repeatedStringList': ['My friends are my power', 'Darknesss'],
          'optionalBytes': [1],
          'optionalBytesWithDefault': [2],
          'repeatedBytesList': [[3]],
          'optionalMessage': {'$name': 'NestedMessage'},
          'repeatedMessageList': [
            {
              '$name': 'NestedMessage',
              'payload': 'I hope we find ingredients around here'
            },
            {'$name': 'NestedMessage', 'payload': 'Hearts'}
          ]
        },
        debug.dump(message));
  }
}

testSuite(new DumpTest());
