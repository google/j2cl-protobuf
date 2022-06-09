/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertThrows;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto.NestedMessage;
import com.google.protobuf.contrib.j2cl.protos.Proto3Accessors.TestProto3;
import java.util.Arrays;
import java.util.List;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class MessageFieldsTest {

  @Test
  public void testOptionalField_defaultInstance() {
    assertThat(TestProto.newBuilder().hasOptionalMessage()).isFalse();
    assertThat(TestProto.getDefaultInstance().hasOptionalMessage()).isFalse();
    assertThat(TestProto.newBuilder().getOptionalMessage().hasPayload()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalMessage().hasPayload()).isFalse();
  }

  @Test
  public void testProto3MessageField_defaultInstance() {
    assertThat(TestProto3.newBuilder().hasProto3Message()).isFalse();
    assertThat(TestProto3.getDefaultInstance().hasProto3Message()).isFalse();
    assertThat(TestProto3.newBuilder().getProto3Message().hasPayload()).isFalse();
    assertThat(TestProto3.getDefaultInstance().getProto3Message().hasPayload()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("payload").build());
    assertThat(builder.hasOptionalMessage()).isTrue();
    assertThat(builder.getOptionalMessage().getPayload()).isEqualTo("payload");

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalMessage()).isTrue();
    assertThat(proto.getOptionalMessage().getPayload()).isEqualTo("payload");

    TestProto3.Builder proto3Builder =
        TestProto3.newBuilder()
            .setProto3Message(TestProto3.NestedMessage.newBuilder().setPayload("payload").build());
    assertThat(proto3Builder.hasProto3Message()).isTrue();
    assertThat(proto3Builder.getProto3Message().getPayload()).isEqualTo("payload");

    TestProto3 proto3 = proto3Builder.build();
    assertThat(proto3.hasProto3Message()).isTrue();
    assertThat(proto3.getProto3Message().getPayload()).isEqualTo("payload");
  }

  @Test
  public void testOptionalField_toBuilder() {
    TestProto startProto =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("payload").build())
            .build();

    TestProto.Builder builder = startProto.toBuilder();
    assertThat(builder.hasOptionalMessage()).isTrue();
    assertThat(builder.getOptionalMessage().getPayload()).isEqualTo("payload");

    builder.setOptionalMessage(NestedMessage.newBuilder().setPayload("payload_new").build());

    assertThat(builder.hasOptionalMessage()).isTrue();
    assertThat(builder.getOptionalMessage().getPayload()).isEqualTo("payload_new");

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalMessage()).isTrue();
    assertThat(proto.getOptionalMessage().getPayload()).isEqualTo("payload_new");

    assertThat(startProto.hasOptionalMessage()).isTrue();
    assertThat(startProto.getOptionalMessage().getPayload()).isEqualTo("payload");
  }

  @Test
  public void testOptionalField_clear() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("payload").build());

    builder.clearOptionalMessage();
    assertThat(builder.hasOptionalMessage()).isFalse();
    assertThat(builder.getOptionalMessage().getPayload()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalMessage()).isFalse();
    assertThat(proto.getOptionalMessage().getPayload()).isEmpty();
  }

  @Test
  public void testRepeatedField_defaultValue() {
    TestProto proto = TestProto.newBuilder().build();
    assertThat(proto.getRepeatedMessageCount()).isEqualTo(0);
    assertThat(proto.getRepeatedMessageList()).isEmpty();
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedMessage(NestedMessage.newBuilder().setPayload("one").build())
            .addRepeatedMessage(NestedMessage.newBuilder().setPayload("two").build());
    List<NestedMessage> nestedList = builder.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("two");
    assertThat(builder.getRepeatedMessage(0).getPayload()).isEqualTo("one");
    assertThat(builder.getRepeatedMessage(1).getPayload()).isEqualTo("two");

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("two");
    assertThat(proto.getRepeatedMessage(0).getPayload()).isEqualTo("one");
    assertThat(proto.getRepeatedMessage(1).getPayload()).isEqualTo("two");
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addAllRepeatedMessage(
                Arrays.asList(
                    NestedMessage.newBuilder().setPayload("one").build(),
                    NestedMessage.newBuilder().setPayload("two").build()));
    List<NestedMessage> nestedList = builder.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("two");
    assertThat(builder.getRepeatedMessage(0).getPayload()).isEqualTo("one");
    assertThat(builder.getRepeatedMessage(1).getPayload()).isEqualTo("two");

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("two");

    assertThat(proto.getRepeatedMessage(0).getPayload()).isEqualTo("one");
    assertThat(proto.getRepeatedMessage(1).getPayload()).isEqualTo("two");
  }

  @Test
  public void testRepeatedField_setValue() {
    TestProto startProto =
        TestProto.newBuilder()
            .addAllRepeatedMessage(
                Arrays.asList(
                    NestedMessage.newBuilder().setPayload("one").build(),
                    NestedMessage.newBuilder().setPayload("two").build()))
            .build();

    TestProto.Builder builder =
        startProto
            .toBuilder()
            .setRepeatedMessage(1, NestedMessage.newBuilder().setPayload("another two").build());
    List<NestedMessage> nestedList = builder.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("another two");

    assertThat(builder.getRepeatedMessage(0).getPayload()).isEqualTo("one");
    assertThat(builder.getRepeatedMessage(1).getPayload()).isEqualTo("another two");

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("another two");

    assertThat(proto.getRepeatedMessage(0).getPayload()).isEqualTo("one");
    assertThat(proto.getRepeatedMessage(1).getPayload()).isEqualTo("another two");
  }

  @Test
  public void testRepeatedField_outOfBounds() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addAllRepeatedMessage(
                Arrays.asList(
                    NestedMessage.newBuilder().setPayload("one").build(),
                    NestedMessage.newBuilder().setPayload("two").build()));

    TestProto proto = builder.build();

    if (InternalChecks.isCheckIndex()) {
      assertThrows(
          Exception.class, () -> builder.setRepeatedMessage(2, NestedMessage.getDefaultInstance()));
      assertThrows(Exception.class, () -> builder.getRepeatedMessage(2));
      assertThrows(Exception.class, () -> proto.getRepeatedMessage(2));
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addAllRepeatedMessage(
                Arrays.asList(
                    NestedMessage.newBuilder().setPayload("one").build(),
                    NestedMessage.newBuilder().setPayload("two").build()))
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedMessage();
    assertThat(builder.getRepeatedMessageCount()).isEqualTo(0);
    assertThat(builder.getRepeatedMessageList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedMessageCount()).isEqualTo(0);
    assertThat(proto.getRepeatedMessageList()).isEmpty();
  }

  @Test
  public void testRepeatedField_newBuilder() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedMessage(NestedMessage.newBuilder().setPayload("one").build())
            .addRepeatedMessage(NestedMessage.newBuilder().setPayload("two").build())
            .build();

    TestProto proto = TestProto.newBuilder(startProto).build();

    List<NestedMessage> nestedList = proto.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("two");
    assertThat(proto.getRepeatedMessage(0).getPayload()).isEqualTo("one");
    assertThat(proto.getRepeatedMessage(1).getPayload()).isEqualTo("two");
  }

  @Test
  public void testOptionalField_setBuilder() {
    TestProto startProto =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("one"))
            .build();

    assertThat(startProto.getOptionalMessage().getPayload()).isEqualTo("one");
  }

  @Test
  public void testRepeatedField_addWithBuilder() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload("one"))
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload("two"));

    List<NestedMessage> nestedList = builder.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("two");

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("one");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("two");
  }

  @Test
  public void testRepeatedField_setWithBuilder() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload("one"))
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload("two"));

    builder.setRepeatedMessage(0, TestProto.NestedMessage.newBuilder().setPayload("three"));
    builder.setRepeatedMessage(1, TestProto.NestedMessage.newBuilder().setPayload("four"));

    List<NestedMessage> nestedList = builder.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("three");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("four");

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertThat(nestedList).hasSize(2);
    assertThat(nestedList.get(0).getPayload()).isEqualTo("three");
    assertThat(nestedList.get(1).getPayload()).isEqualTo("four");
  }

  @Test
  public void testRepeatedField_getReturnsImmutableList() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload("one"));
    List<NestedMessage> nestedList = builder.getRepeatedMessageList();

    assertThrows(
        Exception.class,
        () -> nestedList.add(TestProto.NestedMessage.newBuilder().setPayload("one").build()));
    assertThrows(Exception.class, () -> nestedList.remove(0));
  }

  @Ignore("b/235434054") // TODO(b/235434054): Enable after the bug is fixed.
  @Test
  public void testReferenceEquality_singleMessage() {
    var builder = TestProto.newBuilder();
    assertThat(builder.getOptionalMessage()).isSameInstanceAs(builder.getOptionalMessage());

    var proto = TestProto.newBuilder().build();
    assertThat(proto.getOptionalMessage()).isSameInstanceAs(proto.getOptionalMessage());
  }

  @Test
  public void testReferenceEquality_singleMessage_builder_set() {
    var childProto = TestProto.NestedMessage.newBuilder().setPayload("payload").build();

    var builder = TestProto.newBuilder().setOptionalMessage(childProto);
    var proto = builder.build();

    assertThat(builder.getOptionalMessage()).isSameInstanceAs(builder.getOptionalMessage());
    assertThat(builder.getOptionalMessage()).isSameInstanceAs(childProto);
    assertThat(proto.getOptionalMessage()).isSameInstanceAs(childProto);

    var otherChildProto = TestProto.NestedMessage.newBuilder().setPayload("payload1").build();
    builder.setOptionalMessage(otherChildProto);

    assertThat(builder.getOptionalMessage()).isSameInstanceAs(builder.getOptionalMessage());
    assertThat(proto.getOptionalMessage()).isSameInstanceAs(childProto);
    assertThat(builder.getOptionalMessage()).isNotSameInstanceAs(childProto);
    assertThat(builder.getOptionalMessage()).isSameInstanceAs(otherChildProto);
  }

  @Test
  public void testReferenceEquality_singleMessage_cache_clear_clearField() {
    var childProto = TestProto.NestedMessage.newBuilder().setPayload("payload").build();

    var builder = TestProto.newBuilder().setOptionalMessage(childProto);

    assertThat(builder.getOptionalMessage()).isSameInstanceAs(builder.getOptionalMessage());
    assertThat(builder.getOptionalMessage()).isSameInstanceAs(childProto);
    var buildMessage = builder.getOptionalMessage();

    builder.clearOptionalMessage();

    // TODO(b/235434054): Enable after the bug is fixed.
    // assertThat(builder.getOptionalMessage()).isSameInstanceAs(builder.getOptionalMessage());
    assertThat(builder.getOptionalMessage()).isNotSameInstanceAs(buildMessage);
    assertThat(builder.getOptionalMessage()).isNotSameInstanceAs(childProto);
  }

  @Test
  public void testReferenceEquality_repeatedMessage() {
    var nestedOne = TestProto.NestedMessage.newBuilder().setPayload("one").build();
    var nestedTwo = TestProto.NestedMessage.newBuilder().setPayload("two").build();

    var builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(nestedTwo);

    var proto = builder.build();

    assertThat(builder.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
    assertThat(builder.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
    assertThat(proto.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
    assertThat(proto.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
    assertThat(proto.getRepeatedMessage(0)).isSameInstanceAs(proto.getRepeatedMessage(0));
    assertThat(proto.getRepeatedMessage(1)).isSameInstanceAs(proto.getRepeatedMessage(1));
    assertThat(builder.getRepeatedMessage(0)).isSameInstanceAs(builder.getRepeatedMessage(0));
    assertThat(builder.getRepeatedMessage(1)).isSameInstanceAs(builder.getRepeatedMessage(1));
  }

  @Test
  public void testReferenceEquality_repeatedMessage_add() {
    var nestedOne = TestProto.NestedMessage.newBuilder().setPayload("one").build();
    var nestedTwo = TestProto.NestedMessage.newBuilder().setPayload("two").build();
    var nestedThree = TestProto.NestedMessage.newBuilder().setPayload("three").build();

    var builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(nestedTwo);
    var proto = builder.build();

    builder.addRepeatedMessage(nestedThree);

    assertThat(builder.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
    assertThat(builder.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
    assertThat(builder.getRepeatedMessage(2)).isSameInstanceAs(nestedThree);
    assertThat(proto.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
    assertThat(proto.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
  }

  @Test
  public void testReferenceEquality_repeatedMessage_cache_clear_set() {
    var nestedOne = TestProto.NestedMessage.newBuilder().setPayload("one").build();
    var nestedTwo = TestProto.NestedMessage.newBuilder().setPayload("two").build();
    var nestedOtherOne = TestProto.NestedMessage.newBuilder().setPayload("otherOne").build();

    var builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(nestedTwo);
    var proto = builder.build();

    builder.setRepeatedMessage(0, nestedOtherOne);

    assertThat(builder.getRepeatedMessage(0)).isSameInstanceAs(nestedOtherOne);
    assertThat(builder.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
    assertThat(proto.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
    assertThat(proto.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
  }

  @Test
  public void testReferenceEquality_repeatedMessage_setList() {
    var nestedOne = TestProto.NestedMessage.newBuilder().setPayload("one").build();
    var nestedTwo = TestProto.NestedMessage.newBuilder().setPayload("two").build();
    var nestedThree = TestProto.NestedMessage.newBuilder().setPayload("three").build();
    var nestedFour = TestProto.NestedMessage.newBuilder().setPayload("four").build();

    var listView = Arrays.asList(nestedTwo, nestedThree, nestedFour);

    var builder = TestProto.newBuilder().addRepeatedMessage(nestedOne);

    var proto = builder.build();

    builder.addAllRepeatedMessage(listView);

    builder.addRepeatedMessage(nestedThree);

    assertThat(builder.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
    assertThat(builder.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
    assertThat(builder.getRepeatedMessage(2)).isSameInstanceAs(nestedThree);
    assertThat(builder.getRepeatedMessage(3)).isSameInstanceAs(nestedFour);

    assertThat(proto.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
  }

  @Test
  public void testReferenceEquality_repeatedMessage_cache_clear_clearField() {
    var nestedOne = TestProto.NestedMessage.newBuilder().setPayload("one").build();
    var nestedTwo = TestProto.NestedMessage.newBuilder().setPayload("two").build();

    var builder =
        TestProto.newBuilder().addRepeatedMessage(nestedOne).addRepeatedMessage(nestedTwo);

    var proto = builder.build();
    builder.clearRepeatedMessage();

    assertThat(proto.getRepeatedMessage(0)).isSameInstanceAs(nestedOne);
    assertThat(proto.getRepeatedMessage(1)).isSameInstanceAs(nestedTwo);
    assertThat(builder.getRepeatedMessageCount()).isEqualTo(0);
  }
}
