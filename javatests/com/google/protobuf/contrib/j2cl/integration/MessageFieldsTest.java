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
import java.util.Arrays;
import java.util.List;
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
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("payload").build());
    assertThat(builder.hasOptionalMessage()).isTrue();
    assertThat(builder.getOptionalMessage().getPayload()).isEqualTo("payload");

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalMessage()).isTrue();
    assertThat(proto.getOptionalMessage().getPayload()).isEqualTo("payload");
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
}
