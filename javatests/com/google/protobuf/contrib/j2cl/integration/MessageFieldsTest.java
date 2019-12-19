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
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

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
    assertFalse(TestProto.newBuilder().hasOptionalMessage());
    assertFalse(TestProto.newBuilder().build().hasOptionalMessage());
    assertFalse(TestProto.newBuilder().getOptionalMessage().hasPayload());
    assertFalse(TestProto.newBuilder().build().getOptionalMessage().hasPayload());
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("payload").build());
    assertTrue(builder.hasOptionalMessage());
    assertEquals("payload", builder.getOptionalMessage().getPayload());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalMessage());
    assertEquals("payload", proto.getOptionalMessage().getPayload());
  }

  @Test
  public void testOptionalField_toBuilder() {
    TestProto startProto =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("payload").build())
            .build();

    TestProto.Builder builder = startProto.toBuilder();
    assertTrue(builder.hasOptionalMessage());
    assertEquals("payload", builder.getOptionalMessage().getPayload());

    builder.setOptionalMessage(NestedMessage.newBuilder().setPayload("payload_new").build());

    assertTrue(builder.hasOptionalMessage());
    assertEquals("payload_new", builder.getOptionalMessage().getPayload());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalMessage());
    assertEquals("payload_new", proto.getOptionalMessage().getPayload());

    assertTrue(startProto.hasOptionalMessage());
    assertEquals("payload", startProto.getOptionalMessage().getPayload());
  }

  @Test
  public void testOptionalField_clear() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("payload").build());

    builder.clearOptionalMessage();
    assertFalse(builder.hasOptionalMessage());
    assertEquals("", builder.getOptionalMessage().getPayload());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalMessage());
    assertEquals("", proto.getOptionalMessage().getPayload());
  }

  @Test
  public void testRepeatedField_defaultValue() {
    TestProto proto = TestProto.newBuilder().build();
    assertEquals(0, proto.getRepeatedMessageCount());
    assertThat(proto.getRepeatedMessageList()).isEmpty();
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedMessage(NestedMessage.newBuilder().setPayload("one").build())
            .addRepeatedMessage(NestedMessage.newBuilder().setPayload("two").build());
    List<NestedMessage> nestedList = builder.getRepeatedMessageList();
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("two", nestedList.get(1).getPayload());
    assertEquals("one", builder.getRepeatedMessage(0).getPayload());
    assertEquals("two", builder.getRepeatedMessage(1).getPayload());

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("two", nestedList.get(1).getPayload());
    assertEquals("one", proto.getRepeatedMessage(0).getPayload());
    assertEquals("two", proto.getRepeatedMessage(1).getPayload());
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
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("two", nestedList.get(1).getPayload());
    assertEquals("one", builder.getRepeatedMessage(0).getPayload());
    assertEquals("two", builder.getRepeatedMessage(1).getPayload());

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("two", nestedList.get(1).getPayload());

    assertEquals("one", proto.getRepeatedMessage(0).getPayload());
    assertEquals("two", proto.getRepeatedMessage(1).getPayload());
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
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("another two", nestedList.get(1).getPayload());

    assertEquals("one", builder.getRepeatedMessage(0).getPayload());
    assertEquals("another two", builder.getRepeatedMessage(1).getPayload());

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("another two", nestedList.get(1).getPayload());

    assertEquals("one", proto.getRepeatedMessage(0).getPayload());
    assertEquals("another two", proto.getRepeatedMessage(1).getPayload());
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
    assertEquals(0, builder.getRepeatedMessageCount());
    assertThat(builder.getRepeatedMessageList()).isEmpty();

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedMessageCount());
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
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("two", nestedList.get(1).getPayload());
    assertEquals("one", proto.getRepeatedMessage(0).getPayload());
    assertEquals("two", proto.getRepeatedMessage(1).getPayload());
  }

  @Test
  public void testOptionalField_setBuilder() {
    TestProto startProto =
        TestProto.newBuilder()
            .setOptionalMessage(NestedMessage.newBuilder().setPayload("one"))
            .build();

    assertEquals("one", startProto.getOptionalMessage().getPayload());
  }

  @Test
  public void testRepeatedField_addWithBuilder() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload("one"))
            .addRepeatedMessage(TestProto.NestedMessage.newBuilder().setPayload("two"));

    List<NestedMessage> nestedList = builder.getRepeatedMessageList();
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("two", nestedList.get(1).getPayload());

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEquals(2, nestedList.size());
    assertEquals("one", nestedList.get(0).getPayload());
    assertEquals("two", nestedList.get(1).getPayload());
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
    assertEquals(2, nestedList.size());
    assertEquals("three", nestedList.get(0).getPayload());
    assertEquals("four", nestedList.get(1).getPayload());

    TestProto proto = builder.build();
    nestedList = proto.getRepeatedMessageList();
    assertEquals(2, nestedList.size());
    assertEquals("three", nestedList.get(0).getPayload());
    assertEquals("four", nestedList.get(1).getPayload());
  }
}
