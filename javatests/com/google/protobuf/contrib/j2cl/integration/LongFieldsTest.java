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
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class LongFieldsTest {

  private static final long DEFAULT_PROTO_VALUE = 3000000000L;

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().hasOptionalLong()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalLong()).isEqualTo(0L);
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalLong(8964L);
    assertThat(builder.hasOptionalLong()).isTrue();
    assertThat(builder.getOptionalLong()).isEqualTo(8964L);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalLong()).isTrue();
    assertThat(proto.getOptionalLong()).isEqualTo(8964L);
  }

  @Test
  public void testOptionalFieldNoDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalLong(0L);
    assertThat(builder.hasOptionalLong()).isTrue();
    assertThat(builder.getOptionalLong()).isEqualTo(0L);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalLong()).isTrue();
    assertThat(proto.getOptionalLong()).isEqualTo(0L);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalLong(0L).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalLong();
    assertThat(builder.hasOptionalLong()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalLong()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().hasOptionalLongWithDefault()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalLongWithDefault())
        .isEqualTo(DEFAULT_PROTO_VALUE);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalLongWithDefault(-4000000000L);
    assertThat(builder.hasOptionalLongWithDefault()).isTrue();
    assertThat(builder.getOptionalLongWithDefault()).isEqualTo(-4000000000L);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalLongWithDefault()).isTrue();
    assertThat(proto.getOptionalLongWithDefault()).isEqualTo(-4000000000L);
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalLongWithDefault(DEFAULT_PROTO_VALUE);
    assertThat(builder.hasOptionalLongWithDefault()).isTrue();
    assertThat(builder.getOptionalLongWithDefault()).isEqualTo(DEFAULT_PROTO_VALUE);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalLongWithDefault()).isTrue();
    assertThat(proto.getOptionalLongWithDefault()).isEqualTo(DEFAULT_PROTO_VALUE);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedLongCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedLongCount()).isEqualTo(0);
    assertThrows(
        Exception.class,
        () -> {
          @SuppressWarnings("UnusedVariable")
          Long willFailToBox = TestProto.newBuilder().build().getRepeatedLong(0);
        });
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedLong(13L).addRepeatedLong(24000000000L);
    assertThat(Arrays.asList(13L, 24000000000L))
        .containsExactlyElementsIn(builder.getRepeatedLongList())
        .inOrder();

    TestProto proto = builder.build();

    assertThat(Arrays.asList(13L, 24000000000L))
        .containsExactlyElementsIn(proto.getRepeatedLongList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder().addRepeatedLong(13L).addRepeatedLong(24000000000L).build();

    TestProto.Builder builder =
        startProto.toBuilder().addAllRepeatedLong(Arrays.asList(-1L, -2L, -3L));

    assertThat(Arrays.asList(13L, 24000000000L, -1L, -2L, -3L))
        .containsExactlyElementsIn(builder.getRepeatedLongList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13L, 24000000000L, -1L, -2L, -3L))
        .containsExactlyElementsIn(proto.getRepeatedLongList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedLong(13L)
            .addRepeatedLong(24000000000L)
            .addRepeatedLong(-1L)
            .addRepeatedLong(-2L)
            .addRepeatedLong(-3L)
            .build();

    TestProto.Builder builder = startProto.toBuilder().setRepeatedLong(2, 333L);
    assertThat(Arrays.asList(13L, 24000000000L, 333L, -2L, -3L))
        .containsExactlyElementsIn(builder.getRepeatedLongList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13L, 24000000000L, 333L, -2L, -3L))
        .containsExactlyElementsIn(proto.getRepeatedLongList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedLong(13L)
            .addRepeatedLong(24000000000L)
            .addRepeatedLong(-1L)
            .addRepeatedLong(-2L)
            .addRepeatedLong(-3L);

    assertThat(builder.getRepeatedLongCount()).isEqualTo(5);
    assertThat(builder.getRepeatedLong(0)).isEqualTo(13L);
    assertThat(builder.getRepeatedLong(1)).isEqualTo(24000000000L);
    assertThat(builder.getRepeatedLong(2)).isEqualTo(-1L);
    assertThat(builder.getRepeatedLong(3)).isEqualTo(-2L);
    assertThat(builder.getRepeatedLong(4)).isEqualTo(-3L);
    assertThrows(
        Exception.class,
        () -> {
          @SuppressWarnings("UnusedVariable")
          Long willFailToBox = builder.getRepeatedLong(5);
        });

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedLongCount()).isEqualTo(5);
    assertThat(proto.getRepeatedLong(0)).isEqualTo(13L);
    assertThat(proto.getRepeatedLong(1)).isEqualTo(24000000000L);
    assertThat(proto.getRepeatedLong(2)).isEqualTo(-1L);
    assertThat(proto.getRepeatedLong(3)).isEqualTo(-2L);
    assertThat(proto.getRepeatedLong(4)).isEqualTo(-3L);
    assertThrows(
        Exception.class,
        () -> {
          @SuppressWarnings("UnusedVariable")
          Long willFailToBox = proto.getRepeatedLong(5);
        });
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedLong(13L)
            .addRepeatedLong(24000000000L)
            .addRepeatedLong(-1L)
            .addRepeatedLong(-2L)
            .addRepeatedLong(-3L)
            .build();
    TestProto.Builder builder = startProto.toBuilder().clearRepeatedLong();
    assertThat(builder.getRepeatedLongCount()).isEqualTo(0);
    assertThat(builder.getRepeatedLongList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedLongCount()).isEqualTo(0);
    assertThat(proto.getRepeatedLongCount()).isEqualTo(0);
  }

  @Test
  public void testRepeatedField_getReturnsImmutableList() {
    TestProto.Builder builder = TestProto.newBuilder().addRepeatedLong(1);
    List<Long> repeatedFieldList = builder.getRepeatedLongList();

    assertThrows(Exception.class, () -> repeatedFieldList.add(2L));
    assertThrows(Exception.class, () -> repeatedFieldList.remove(0));
  }
}
