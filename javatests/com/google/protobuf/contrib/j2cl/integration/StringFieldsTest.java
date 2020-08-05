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
import java.util.Arrays;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class StringFieldsTest {

  private static final String PROTO_DEFAULT_VALUE = "non-trivial default";

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().hasOptionalString()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalString()).isEqualTo("");
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalString("two");
    assertThat(builder.hasOptionalString()).isTrue();
    assertThat(builder.getOptionalString()).isEqualTo("two");

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalString()).isTrue();
    assertThat(proto.getOptionalString()).isEqualTo("two");
  }

  @Test
  public void testOptionalFieldNoDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalString("");
    assertThat(builder.hasOptionalString()).isTrue();
    assertThat(builder.getOptionalString()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalString()).isTrue();
    assertThat(proto.getOptionalString()).isEmpty();
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalString("two").build();
    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalString();
    assertThat(builder.hasOptionalString()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalString()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().hasOptionalStringWithDefault()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalStringWithDefault())
        .isEqualTo(PROTO_DEFAULT_VALUE);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalStringWithDefault("two");
    assertThat(builder.hasOptionalStringWithDefault()).isTrue();
    assertThat(builder.getOptionalStringWithDefault()).isEqualTo("two");

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalStringWithDefault()).isTrue();
    assertThat(proto.getOptionalStringWithDefault()).isEqualTo("two");
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalStringWithDefault(PROTO_DEFAULT_VALUE);
    assertThat(builder.hasOptionalStringWithDefault()).isTrue();
    assertThat(builder.getOptionalStringWithDefault()).isEqualTo(PROTO_DEFAULT_VALUE);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalStringWithDefault()).isTrue();
    assertThat(proto.getOptionalStringWithDefault()).isEqualTo(PROTO_DEFAULT_VALUE);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedStringCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedStringCount()).isEqualTo(0);

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
    assertThat(builder.getRepeatedStringCount()).isEqualTo(5);

    assertThat(builder.getRepeatedString(0)).isEqualTo("two");
    assertThat(builder.getRepeatedString(1)).isEqualTo("five");
    assertThat(builder.getRepeatedString(2)).isEqualTo("one");
    assertThat(builder.getRepeatedString(3)).isEqualTo("two");
    assertThat(builder.getRepeatedString(4)).isEqualTo("three");

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedString(5));
    } else {
      assertThat(builder.getRepeatedString(5)).isNull();
    }

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedStringCount()).isEqualTo(5);
    assertThat(proto.getRepeatedString(0)).isEqualTo("two");
    assertThat(proto.getRepeatedString(1)).isEqualTo("five");
    assertThat(proto.getRepeatedString(2)).isEqualTo("one");
    assertThat(proto.getRepeatedString(3)).isEqualTo("two");
    assertThat(proto.getRepeatedString(4)).isEqualTo("three");

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedString(5));
    } else {
      assertThat(proto.getRepeatedString(5)).isNull();
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
    assertThat(builder.getRepeatedStringCount()).isEqualTo(0);
    assertThat(builder.getRepeatedStringList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedStringCount()).isEqualTo(0);
    assertThat(proto.getRepeatedStringCount()).isEqualTo(0);
  }
}
