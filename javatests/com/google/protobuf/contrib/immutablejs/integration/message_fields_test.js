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

goog.module('proto.im.integration.MessageFieldsTest');
goog.setTestOnly();


const ListView = goog.require('proto.im.ListView');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const TestProto3 = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto3');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {isCheckIndex} = goog.require('proto.im.internal.internalChecks');

class MessageFieldsTest {
  testOptionalField_defaultInstance() {
    const proto = TestProto.newBuilder().build();
    assertEqualsForProto(false, proto.hasOptionalMessage());
    assertEqualsForProto(false, proto.getOptionalMessage().hasPayload());

    const proto3 = TestProto3.newBuilder().build();
    assertEqualsForProto(false, proto3.hasProto3Message());
    assertEqualsForProto(false, proto3.getProto3Message().hasPayload());
  }

  testOptionalField_defaultInstance_setValueMessage() {
    const builder = TestProto.newBuilder().setOptionalMessage(
        TestProto.NestedMessage.newBuilder().setPayload('payload').build());
    assertEqualsForProto(true, builder.hasOptionalMessage());
    assertEqualsForProto('payload', builder.getOptionalMessage().getPayload());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalMessage());
    assertEqualsForProto('payload', proto.getOptionalMessage().getPayload());

    const builderProto3 = TestProto3.newBuilder().setProto3Message(
        TestProto3.NestedMessage.newBuilder().setPayload('payload').build());
    assertEqualsForProto(true, builderProto3.hasProto3Message());
    assertEqualsForProto(
        'payload', builderProto3.getProto3Message().getPayload());

    const proto3 = builderProto3.build();
    assertEqualsForProto(true, proto3.hasProto3Message());
    assertEqualsForProto('payload', proto3.getProto3Message().getPayload());
  }

  testOptionalField_defaultInstance_setValueBuilder() {
    const builder = TestProto.newBuilder().setOptionalMessage(
        TestProto.NestedMessage.newBuilder().setPayload('payload'));
    assertEqualsForProto(true, builder.hasOptionalMessage());
    assertEqualsForProto('payload', builder.getOptionalMessage().getPayload());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalMessage());
    assertEqualsForProto('payload', proto.getOptionalMessage().getPayload());
  }

  testOptionalField_toBuilder() {
    const proto = TestProto.newBuilder()
                      .setOptionalMessage(TestProto.NestedMessage.newBuilder()
                                              .setPayload('payload')
                                              .build())
                      .build();

    const builder = proto.toBuilder();
    builder.setOptionalMessage(
        TestProto.NestedMessage.newBuilder().setPayload('builder1').build());

    const proto2 = builder.build();

    assertEqualsForProto(true, proto.hasOptionalMessage());
    assertEqualsForProto('payload', proto.getOptionalMessage().getPayload());

    assertEqualsForProto(true, builder.hasOptionalMessage());
    assertEqualsForProto('builder1', builder.getOptionalMessage().getPayload());

    assertEqualsForProto(true, proto2.hasOptionalMessage());
    assertEqualsForProto('builder1', proto2.getOptionalMessage().getPayload());
  }

  testOptionalField_clear() {
    const startProto =
        TestProto.newBuilder()
            .setOptionalMessage(TestProto.NestedMessage.newBuilder()
                                    .setPayload('payload')
                                    .build())
            .build();

    const builder = startProto.toBuilder();
    builder.clearOptionalMessage();
    assertEqualsForProto(false, builder.getOptionalMessage().hasPayload());
    assertEqualsForProto(false, builder.hasOptionalMessage());

    const proto = builder.build();
    assertEqualsForProto(false, proto.getOptionalMessage().hasPayload());
    assertEqualsForProto(false, proto.hasOptionalMessage());
  }

  testOptionalField_childMessage() {
    const childMessage = TestProto.NestedMessage.newBuilder()
                             .setPayload('child payload')
                             .build();
    const builder = TestProto.newBuilder().setOptionalMessage(childMessage);
    assertEqualsForProto(
        'child payload', builder.getOptionalMessage().getPayload());
    assertEqualsForProto(
        'child payload', builder.build().getOptionalMessage().getPayload());

    // change a child message should not change the original message.
    builder.setOptionalMessage(
        TestProto.NestedMessage.newBuilder().setPayload('another value'));

    assertEqualsForProto('child payload', childMessage.getPayload());
    assertEqualsForProto(
        'another value', builder.getOptionalMessage().getPayload());
    assertEqualsForProto(
        'another value', builder.build().getOptionalMessage().getPayload());
  }

  testOptionalField_builderPersistence() {
    const childMessage = TestProto.NestedMessage.newBuilder()
                             .setPayload('child payload')
                             .build();
    const builder = TestProto.newBuilder().setOptionalMessage(childMessage);
    assertEqualsForProto(
        'child payload', builder.getOptionalMessage().getPayload());
    assertEqualsForProto(
        'child payload', builder.build().getOptionalMessage().getPayload());
    // build a second time to make sure the builder still has the same state
    assertEqualsForProto(
        'child payload', builder.build().getOptionalMessage().getPayload());
  }

  testRepeatedField_defaultInstance() {
    const proto = TestProto.newBuilder().build();
    assertEqualsForProto(0, proto.getRepeatedMessageCount());
    assertEqualsForProto(0, proto.getRepeatedMessageList().size());
  }

  testRepeatedField_add() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('one').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('two').build());
    let nestedList = builder.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('two', nestedList.get(1).getPayload());


    const proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('two', nestedList.get(1).getPayload());
  }

  testRepeatedField_addAll() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('one').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('two').build())
            .build();

    const builder =
        startProto.toBuilder().addAllRepeatedMessage(ListView.copyOf([
          TestProto.NestedMessage.newBuilder().setPayload('three').build(),
          TestProto.NestedMessage.newBuilder().setPayload('four').build()
        ]));
    let nestedList = builder.getRepeatedMessageList();
    assertEqualsForProto(4, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('two', nestedList.get(1).getPayload());
    assertEqualsForProto('three', nestedList.get(2).getPayload());
    assertEqualsForProto('four', nestedList.get(3).getPayload());

    const proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEqualsForProto(4, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('two', nestedList.get(1).getPayload());
    assertEqualsForProto('three', nestedList.get(2).getPayload());
    assertEqualsForProto('four', nestedList.get(3).getPayload());
  }

  testRepeatedField_set() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('one').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('two').build())
            .build();

    const builder = startProto.toBuilder().setRepeatedMessage(
        1,
        TestProto.NestedMessage.newBuilder().setPayload('another two').build());
    let nestedList = builder.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('another two', nestedList.get(1).getPayload());

    const proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('another two', nestedList.get(1).getPayload());

    if (isCheckIndex()) {
      assertThrows(() => {
        builder.setRepeatedMessage(
            2, TestProto.NestedMessage.newBuilder().build());
      });
    }
  }

  testRepeatedField_getAndCount() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('one').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('two').build())
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder()
                                    .setPayload('three')
                                    .build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('four').build())
            .build();
    const builder = startProto.toBuilder();

    assertEqualsForProto('one', builder.getRepeatedMessage(0).getPayload());
    assertEqualsForProto('two', builder.getRepeatedMessage(1).getPayload());
    assertEqualsForProto('three', builder.getRepeatedMessage(2).getPayload());
    assertEqualsForProto('four', builder.getRepeatedMessage(3).getPayload());

    const proto = builder.build();

    assertEqualsForProto('one', proto.getRepeatedMessage(0).getPayload());
    assertEqualsForProto('two', proto.getRepeatedMessage(1).getPayload());
    assertEqualsForProto('three', proto.getRepeatedMessage(2).getPayload());
    assertEqualsForProto('four', proto.getRepeatedMessage(3).getPayload());

    if (isCheckIndex()) {
      assertThrows(() => builder.getRepeatedMessage(4));
      assertThrows(() => proto.getRepeatedMessage(4));
    }
  }

  testRepeatedField_clear() {
    const startProto =
        TestProto.newBuilder()
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('one').build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('two').build())
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder()
                                    .setPayload('three')
                                    .build())
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('four').build())
            .build();

    // test clear
    const builder = startProto.toBuilder().clearRepeatedMessage();
    assertEqualsForProto(0, builder.getRepeatedMessageCount());
    assertEqualsForProto(0, builder.getRepeatedMessageList().size());

    const proto = builder.build();
    assertEqualsForProto(0, proto.getRepeatedMessageCount());
    assertEqualsForProto(0, proto.getRepeatedMessageList().size());
  }

  testNewBuilderInitializedWithProto() {
    const startProto =
        TestProto.newBuilder()
            .setOptionalMessage(TestProto.NestedMessage.newBuilder()
                                    .setPayload('payload')
                                    .build())
            .build();

    const builder = TestProto.newBuilder(startProto);
    assertEqualsForProto(true, builder.hasOptionalMessage());
    assertEqualsForProto('payload', builder.getOptionalMessage().getPayload());

    const proto = builder.build();
    assertEqualsForProto(true, proto.hasOptionalMessage());
    assertEqualsForProto('payload', proto.getOptionalMessage().getPayload());

    // modify the builder and see that the original message does not get
    // modified
    builder.setOptionalMessage(TestProto.NestedMessage.newBuilder()
                                   .setPayload('different payload')
                                   .build());

    assertEqualsForProto(
        'different payload', builder.getOptionalMessage().getPayload());
    assertEqualsForProto(
        'payload', startProto.getOptionalMessage().getPayload());
  }

  testReferenceEquality_singleMessage() {
    const childProto =
        TestProto.NestedMessage.newBuilder().setPayload('payload').build();

    const builder = TestProto.newBuilder().setOptionalMessage(childProto);
    const proto = builder.build();

    assertTrue(proto.getOptionalMessage() === proto.getOptionalMessage());
    assertTrue(childProto === proto.getOptionalMessage());
    assertTrue(childProto === builder.getOptionalMessage());
  }

  testReferenceEquality_singleMessage_builder_set() {
    const childProto =
        TestProto.NestedMessage.newBuilder().setPayload('payload').build();

    const builder = TestProto.newBuilder().setOptionalMessage(childProto);
    const proto = builder.build();

    assertTrue(builder.getOptionalMessage() === builder.getOptionalMessage());
    assertTrue(childProto === builder.getOptionalMessage());
    assertTrue(childProto === proto.getOptionalMessage());

    const otherChildProto =
        TestProto.NestedMessage.newBuilder().setPayload('payload1').build();
    builder.setOptionalMessage(otherChildProto);

    assertTrue(builder.getOptionalMessage() === builder.getOptionalMessage());
    assertTrue(childProto === proto.getOptionalMessage());
    assertFalse(childProto === builder.getOptionalMessage());
    assertTrue(otherChildProto === builder.getOptionalMessage());
  }

  testReferenceEquality_singleMessage_cache_clear_clearField() {
    const childProto =
        TestProto.NestedMessage.newBuilder().setPayload('payload').build();

    const builder = TestProto.newBuilder().setOptionalMessage(childProto);

    assertTrue(builder.getOptionalMessage() === builder.getOptionalMessage());
    assertTrue(childProto === builder.getOptionalMessage());
    const buildMessage = builder.getOptionalMessage();

    builder.clearOptionalMessage();

    assertFalse(builder.getOptionalMessage() === builder.getOptionalMessage());
    assertFalse(buildMessage === builder.getOptionalMessage());
    assertFalse(childProto === builder.getOptionalMessage());
  }

  testReferenceEquality_repeatedMessage() {
    const nestedOne =
        TestProto.NestedMessage.newBuilder().setPayload('one').build();
    const nestedTwo =
        TestProto.NestedMessage.newBuilder().setPayload('two').build();

    const builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(
            nestedTwo);

    const proto = builder.build();

    assertTrue(nestedOne === builder.getRepeatedMessage(0));
    assertTrue(nestedTwo === builder.getRepeatedMessage(1));
    assertTrue(nestedOne === proto.getRepeatedMessage(0));
    assertTrue(nestedTwo === proto.getRepeatedMessage(1));
    assertTrue(proto.getRepeatedMessage(0) === proto.getRepeatedMessage(0));
    assertTrue(proto.getRepeatedMessage(1) === proto.getRepeatedMessage(1));
    assertTrue(builder.getRepeatedMessage(0) === builder.getRepeatedMessage(0));
    assertTrue(builder.getRepeatedMessage(1) === builder.getRepeatedMessage(1));
  }

  testReferenceEquality_repeatedMessage_add() {
    const nestedOne =
        TestProto.NestedMessage.newBuilder().setPayload('one').build();
    const nestedTwo =
        TestProto.NestedMessage.newBuilder().setPayload('two').build();
    const nestedThree =
        TestProto.NestedMessage.newBuilder().setPayload('three').build();

    const builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(
            nestedTwo);
    const proto = builder.build();

    builder.addRepeatedMessage(nestedThree);

    assertTrue(nestedOne === builder.getRepeatedMessage(0));
    assertTrue(nestedTwo === builder.getRepeatedMessage(1));
    assertTrue(nestedThree === builder.getRepeatedMessage(2));
    assertTrue(nestedOne === proto.getRepeatedMessage(0));
    assertTrue(nestedTwo === proto.getRepeatedMessage(1));
    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedMessage(2));
    }
  }

  testReferenceEquality_repeatedMessage_cache_clear_set() {
    const nestedOne =
        TestProto.NestedMessage.newBuilder().setPayload('one').build();
    const nestedTwo =
        TestProto.NestedMessage.newBuilder().setPayload('two').build();
    const nestedOtherOne =
        TestProto.NestedMessage.newBuilder().setPayload('otherOne').build();

    const builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(
            nestedTwo);
    const proto = builder.build();

    builder.setRepeatedMessage(0, nestedOtherOne);

    assertTrue(nestedOtherOne === builder.getRepeatedMessage(0));
    assertTrue(nestedTwo === builder.getRepeatedMessage(1));
    assertTrue(nestedOne === proto.getRepeatedMessage(0));
    assertTrue(nestedTwo === proto.getRepeatedMessage(1));
  }

  testReferenceEquality_repeatedMessage_setList() {
    const nestedOne =
        TestProto.NestedMessage.newBuilder().setPayload('one').build();
    const nestedTwo =
        TestProto.NestedMessage.newBuilder().setPayload('two').build();
    const nestedThree =
        TestProto.NestedMessage.newBuilder().setPayload('three').build();
    const nestedFour =
        TestProto.NestedMessage.newBuilder().setPayload('four').build();

    const listView = ListView.copyOf([nestedTwo, nestedThree, nestedFour]);

    const builder = TestProto.newBuilder().addRepeatedMessage(nestedOne);


    const proto = builder.build();

    builder.addAllRepeatedMessage(listView);

    builder.addRepeatedMessage(nestedThree);

    assertTrue(nestedOne === builder.getRepeatedMessage(0));
    assertTrue(nestedTwo === builder.getRepeatedMessage(1));
    assertTrue(nestedThree === builder.getRepeatedMessage(2));
    assertTrue(nestedFour === builder.getRepeatedMessage(3));

    assertTrue(nestedOne === proto.getRepeatedMessage(0));

    if (isCheckIndex()) {
      assertThrows(() => proto.getRepeatedMessage(2));
    }
  }

  testReferenceEquality_repeatedMessage_cache_clear_clearField() {
    const nestedOne =
        TestProto.NestedMessage.newBuilder().setPayload('one').build();
    const nestedTwo =
        TestProto.NestedMessage.newBuilder().setPayload('two').build();

    const builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(
            nestedTwo);

    const proto = builder.build();
    builder.clearRepeatedMessage();

    assertTrue(nestedOne === proto.getRepeatedMessage(0));
    assertTrue(nestedTwo === proto.getRepeatedMessage(1));
    assertEquals(0, builder.getRepeatedMessageCount());
  }

  testRepeatedField_addWithBuilder() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('one'))
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('two'));

    let nestedList = builder.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('two', nestedList.get(1).getPayload());

    const proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('one', nestedList.get(0).getPayload());
    assertEqualsForProto('two', nestedList.get(1).getPayload());
  }

  testRepeatedField_setWithBuilder() {
    const builder =
        TestProto.newBuilder()
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('one'))
            .addRepeatedMessage(
                TestProto.NestedMessage.newBuilder().setPayload('two'));

    builder.setRepeatedMessage(
        0, TestProto.NestedMessage.newBuilder().setPayload('three'));
    builder.setRepeatedMessage(
        1, TestProto.NestedMessage.newBuilder().setPayload('four'));

    let nestedList = builder.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('three', nestedList.get(0).getPayload());
    assertEqualsForProto('four', nestedList.get(1).getPayload());

    const proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEqualsForProto(2, nestedList.size());
    assertEqualsForProto('three', nestedList.get(0).getPayload());
    assertEqualsForProto('four', nestedList.get(1).getPayload());
  }

  testAcceptsSubtypesOfIterable() {
    const listView = /** @type {!ListView<!TestProto.NestedMessage>} */ (
        ListView.copyOf([]));
    // Using a subtype here used to fail compilation, this simply ensures
    // that users can subclass iterable.
    TestProto.newBuilder().addAllRepeatedMessage(listView);
  }
}


testSuite(new MessageFieldsTest());
