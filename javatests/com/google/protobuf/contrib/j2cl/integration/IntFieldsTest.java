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
import com.google.protobuf.contrib.j2cl.protos.Proto3Optional.TestProto3;
import java.util.Arrays;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class IntFieldsTest {

  private static final int PROTO_DEFAULT_VALUE = 135;

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getOptionalInt()).isEqualTo(0);
    assertThat(TestProto.getDefaultInstance().hasOptionalInt()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalInt(8964);
    assertThat(builder.hasOptionalInt()).isTrue();
    assertThat(builder.getOptionalInt()).isEqualTo(8964);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalInt()).isTrue();
    assertThat(proto.getOptionalInt()).isEqualTo(8964);
  }

  @Test
  public void testOptionalFieldNoDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalInt(0);
    assertThat(builder.hasOptionalInt()).isTrue();
    assertThat(builder.getOptionalInt()).isEqualTo(0);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalInt()).isTrue();
    assertThat(proto.getOptionalInt()).isEqualTo(0);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalInt(8964).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalInt();
    assertThat(builder.hasOptionalInt()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalInt()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    assertThat(TestProto.getDefaultInstance().getOptionalIntWithDefault())
        .isEqualTo(PROTO_DEFAULT_VALUE);
    assertThat(TestProto.getDefaultInstance().hasOptionalIntWithDefault()).isFalse();

    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalIntWithDefault(PROTO_DEFAULT_VALUE);
    assertThat(builder.hasOptionalIntWithDefault()).isTrue();
    assertThat(builder.getOptionalIntWithDefault()).isEqualTo(PROTO_DEFAULT_VALUE);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalIntWithDefault()).isTrue();
    assertThat(proto.getOptionalIntWithDefault()).isEqualTo(PROTO_DEFAULT_VALUE);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalIntWithDefault(246);
    assertThat(builder.hasOptionalIntWithDefault()).isTrue();
    assertThat(builder.getOptionalIntWithDefault()).isEqualTo(246);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalIntWithDefault()).isTrue();
    assertThat(proto.getOptionalIntWithDefault()).isEqualTo(246);
  }

  @Test
  public void testOptionalField_proto3() {
    assertThat(TestProto3.getDefaultInstance().hasOptionalInt()).isFalse();
    assertThat(TestProto3.newBuilder().hasOptionalInt()).isFalse();

    TestProto3.Builder builder = TestProto3.newBuilder().setOptionalInt(42);
    assertThat(builder.hasOptionalInt()).isTrue();
    assertThat(builder.getOptionalInt()).isEqualTo(42);
    assertThat(builder.build().hasOptionalInt()).isTrue();
    assertThat(builder.build().getOptionalInt()).isEqualTo(42);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedIntCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedIntCount()).isEqualTo(0);

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedInt(0));
    }
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder = TestProto.newBuilder().addRepeatedInt(13).addRepeatedInt(24);
    assertThat(builder.getRepeatedIntCount()).isEqualTo(2);
    assertThat(Arrays.<Integer>asList(13, 24))
        .containsExactlyElementsIn(builder.getRepeatedIntList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedIntCount()).isEqualTo(2);
    assertThat(Arrays.<Integer>asList(13, 24))
        .containsExactlyElementsIn(proto.getRepeatedIntList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto = TestProto.newBuilder().addRepeatedInt(13).addRepeatedInt(24).build();
    TestProto.Builder builder = startProto.toBuilder().addAllRepeatedInt(Arrays.asList(-1, -2, -3));

    assertThat(Arrays.asList(13, 24, -1, -2, -3))
        .containsExactlyElementsIn(builder.getRepeatedIntList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13, 24, -1, -2, -3))
        .containsExactlyElementsIn(proto.getRepeatedIntList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedInt(13)
            .addRepeatedInt(24)
            .addRepeatedInt(-1)
            .addRepeatedInt(-2)
            .addRepeatedInt(-3)
            .build();
    TestProto.Builder builder = startProto.toBuilder().setRepeatedInt(2, 333);
    assertThat(Arrays.asList(13, 24, 333, -2, -3))
        .containsExactlyElementsIn(builder.getRepeatedIntList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13, 24, 333, -2, -3))
        .containsExactlyElementsIn(proto.getRepeatedIntList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedInt(13)
            .addRepeatedInt(24)
            .addRepeatedInt(-1)
            .addRepeatedInt(-2)
            .addRepeatedInt(-3);

    assertThat(builder.getRepeatedIntCount()).isEqualTo(5);
    assertThat(builder.getRepeatedInt(0)).isEqualTo(13);
    assertThat(builder.getRepeatedInt(1)).isEqualTo(24);
    assertThat(builder.getRepeatedInt(2)).isEqualTo(-1);
    assertThat(builder.getRepeatedInt(3)).isEqualTo(-2);
    assertThat(builder.getRepeatedInt(4)).isEqualTo(-3);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedInt(5));
    }

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedIntCount()).isEqualTo(5);
    assertThat(proto.getRepeatedInt(0)).isEqualTo(13);
    assertThat(proto.getRepeatedInt(1)).isEqualTo(24);
    assertThat(proto.getRepeatedInt(2)).isEqualTo(-1);
    assertThat(proto.getRepeatedInt(3)).isEqualTo(-2);
    assertThat(proto.getRepeatedInt(4)).isEqualTo(-3);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedInt(5));
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedInt(13)
            .addRepeatedInt(24)
            .addRepeatedInt(-1)
            .addRepeatedInt(-2)
            .addRepeatedInt(-3)
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedInt();
    assertThat(builder.getRepeatedIntCount()).isEqualTo(0);
    assertThat(builder.getRepeatedIntList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedIntCount()).isEqualTo(0);
    assertThat(proto.getRepeatedIntCount()).isEqualTo(0);
  }

  @Test
  public void testRepeatedField_getReturnsImmutableList() {
    TestProto.Builder builder = TestProto.newBuilder().addRepeatedInt(1);
    List<Integer> repeatedFieldList = builder.getRepeatedIntList();

    assertThrows(Exception.class, () -> repeatedFieldList.add(2));
    assertThrows(Exception.class, () -> repeatedFieldList.remove(0));
  }
}
