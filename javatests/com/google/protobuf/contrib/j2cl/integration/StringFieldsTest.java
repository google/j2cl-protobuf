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
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import java.util.Arrays;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class StringFieldsTest {

  private static final String PROTO_DEFAULT_VALUE = "non-trivial default";

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertFalse(TestProto.newBuilder().build().hasOptionalString());
    assertEquals("", TestProto.newBuilder().build().getOptionalString());
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalString("two");
    assertTrue(builder.hasOptionalString());
    assertEquals("two", builder.getOptionalString());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalString());
    assertEquals("two", proto.getOptionalString());
  }

  @Test
  public void testOptionalFieldNoDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalString("");
    assertTrue(builder.hasOptionalString());
    assertEquals("", builder.getOptionalString());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalString());
    assertEquals("", proto.getOptionalString());
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalString("two").build();
    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalString();
    assertFalse(builder.hasOptionalString());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalString());
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertFalse(TestProto.newBuilder().build().hasOptionalStringWithDefault());
    assertEquals(
        PROTO_DEFAULT_VALUE, TestProto.newBuilder().build().getOptionalStringWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalStringWithDefault("two");
    assertTrue(builder.hasOptionalStringWithDefault());
    assertEquals("two", builder.getOptionalStringWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalStringWithDefault());
    assertEquals("two", proto.getOptionalStringWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalStringWithDefault(PROTO_DEFAULT_VALUE);
    assertTrue(builder.hasOptionalStringWithDefault());
    assertEquals(PROTO_DEFAULT_VALUE, builder.getOptionalStringWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalStringWithDefault());
    assertEquals(PROTO_DEFAULT_VALUE, proto.getOptionalStringWithDefault());
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedStringCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedStringList().size());

    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedString(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedString("two").addRepeatedString("five");
    assertThat(Arrays.asList("two", "five"))
        .containsExactlyElementsIn(builder.getRepeatedStringList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList("two", "five"))
        .containsExactlyElementsIn(proto.getRepeatedStringList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder().addRepeatedString("two").addRepeatedString("five").build();

    TestProto.Builder builder =
        startProto.toBuilder().addAllRepeatedString(Arrays.asList("one", "two", "three"));

    assertThat(Arrays.asList("two", "five", "one", "two", "three"))
        .containsExactlyElementsIn(builder.getRepeatedStringList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList("two", "five", "one", "two", "three"))
        .containsExactlyElementsIn(proto.getRepeatedStringList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedString("two")
            .addRepeatedString("five")
            .addRepeatedString("one")
            .addRepeatedString("two")
            .addRepeatedString("three")
            .build();

    TestProto.Builder builder = startProto.toBuilder().setRepeatedString(2, "six");
    assertThat(Arrays.asList("two", "five", "six", "two", "three"))
        .containsExactlyElementsIn(builder.getRepeatedStringList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList("two", "five", "six", "two", "three"))
        .containsExactlyElementsIn(proto.getRepeatedStringList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedString("two")
            .addRepeatedString("five")
            .addRepeatedString("one")
            .addRepeatedString("two")
            .addRepeatedString("three")
            .build();
    TestProto.Builder builder = startProto.toBuilder();
    assertEquals(5, builder.getRepeatedStringCount());

    assertEquals("two", builder.getRepeatedString(0));
    assertEquals("five", builder.getRepeatedString(1));
    assertEquals("one", builder.getRepeatedString(2));
    assertEquals("two", builder.getRepeatedString(3));
    assertEquals("three", builder.getRepeatedString(4));

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedString(5));
    } else {
      assertNull(builder.getRepeatedString(5));
    }

    TestProto proto = builder.build();
    assertEquals(5, proto.getRepeatedStringCount());
    assertEquals("two", proto.getRepeatedString(0));
    assertEquals("five", proto.getRepeatedString(1));
    assertEquals("one", proto.getRepeatedString(2));
    assertEquals("two", proto.getRepeatedString(3));
    assertEquals("three", proto.getRepeatedString(4));

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedString(5));
    } else {
      assertNull(proto.getRepeatedString(5));
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedString("two")
            .addRepeatedString("five")
            .addRepeatedString("one")
            .addRepeatedString("two")
            .addRepeatedString("three")
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedString();
    assertEquals(0, builder.getRepeatedStringCount());
    assertEquals(0, builder.getRepeatedStringList().size());

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedStringCount());
    assertEquals(0, proto.getRepeatedStringList().size());
  }
}
