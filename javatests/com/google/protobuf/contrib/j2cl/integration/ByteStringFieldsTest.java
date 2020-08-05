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

import com.google.protobuf.ByteString;
import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import java.util.Arrays;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class ByteStringFieldsTest {

  private static final ByteString TEST_STRING = ByteString.copyFrom(new byte[] {1, 2, 3, 4});
  private static final ByteString DEFAULT_VALUE = ByteString.copyFromUtf8("a bytey default");

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getOptionalBytes()).isEqualTo(ByteString.EMPTY);
    assertThat(TestProto.getDefaultInstance().hasOptionalBytes()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_setTestBytes() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytes(TEST_STRING);
    assertThat(builder.hasOptionalBytes()).isTrue();
    assertThat(TEST_STRING.equals(builder.getOptionalBytes())).isTrue();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBytes()).isTrue();
    assertThat(TEST_STRING.equals(proto.getOptionalBytes())).isTrue();
  }

  @Test
  public void testOptionalFieldNoDefault_setEmptyBytes() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytes(ByteString.EMPTY);
    assertThat(builder.hasOptionalBytes()).isTrue();
    assertThat(builder.getOptionalBytes()).isEqualTo(ByteString.EMPTY);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBytes()).isTrue();
    assertThat(proto.getOptionalBytes()).isEqualTo(ByteString.EMPTY);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalBytes(TEST_STRING).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalBytes();
    assertThat(builder.hasOptionalBytes()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBytes()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getOptionalBytesWithDefault())
        .isEqualTo(DEFAULT_VALUE);

    assertThat(TestProto.getDefaultInstance().hasOptionalBytesWithDefault()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_setDefault() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytesWithDefault(DEFAULT_VALUE);
    assertThat(builder.hasOptionalBytesWithDefault()).isTrue();
    assertThat(builder.getOptionalBytesWithDefault()).isEqualTo(DEFAULT_VALUE);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBytesWithDefault()).isTrue();
    assertThat(proto.getOptionalBytesWithDefault()).isEqualTo(DEFAULT_VALUE);
  }

  @Test
  public void testOptionalFieldWithDefault_clear() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytesWithDefault(TEST_STRING);
    assertThat(builder.hasOptionalBytesWithDefault()).isTrue();
    assertThat(builder.getOptionalBytesWithDefault()).isEqualTo(TEST_STRING);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBytesWithDefault()).isTrue();
    assertThat(proto.getOptionalBytesWithDefault()).isEqualTo(TEST_STRING);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedBytesCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedBytesCount()).isEqualTo(0);
    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedBytes(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedBytes(TEST_STRING).addRepeatedBytes(ByteString.EMPTY);
    assertThat(builder.getRepeatedBytesCount()).isEqualTo(2);
    assertThat(Arrays.asList(TEST_STRING, ByteString.EMPTY))
        .containsExactlyElementsIn(builder.getRepeatedBytesList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedBytesCount()).isEqualTo(2);
    assertThat(Arrays.asList(TEST_STRING, ByteString.EMPTY))
        .containsExactlyElementsIn(proto.getRepeatedBytesList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .build();

    TestProto.Builder builder =
        startProto
            .toBuilder()
            .addAllRepeatedBytes(
                Arrays.asList(
                    ByteString.copyFrom(new byte[] {1, 2, 3}),
                    ByteString.copyFrom(new byte[] {4, 5, 6}),
                    ByteString.copyFrom(new byte[] {7, 8, 9})));

    assertThat(
            Arrays.asList(
                TEST_STRING,
                ByteString.EMPTY,
                ByteString.copyFrom(new byte[] {1, 2, 3}),
                ByteString.copyFrom(new byte[] {4, 5, 6}),
                ByteString.copyFrom(new byte[] {7, 8, 9})))
        .containsExactlyElementsIn(builder.getRepeatedBytesList())
        .inOrder();

    TestProto proto = builder.build();

    assertThat(
            Arrays.asList(
                TEST_STRING,
                ByteString.EMPTY,
                ByteString.copyFrom(new byte[] {1, 2, 3}),
                ByteString.copyFrom(new byte[] {4, 5, 6}),
                ByteString.copyFrom(new byte[] {7, 8, 9})))
        .containsExactlyElementsIn(proto.getRepeatedBytesList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .addRepeatedBytes(ByteString.copyFrom(new byte[] {0, 0, 0}))
            .build();

    TestProto.Builder builder =
        startProto.toBuilder().setRepeatedBytes(2, ByteString.copyFrom(new byte[] {3, 3, 3}));

    assertThat(
            Arrays.asList(TEST_STRING, ByteString.EMPTY, ByteString.copyFrom(new byte[] {3, 3, 3})))
        .containsExactlyElementsIn(builder.getRepeatedBytesList())
        .inOrder();

    TestProto proto = builder.build();

    assertThat(
            Arrays.asList(TEST_STRING, ByteString.EMPTY, ByteString.copyFrom(new byte[] {3, 3, 3})))
        .containsExactlyElementsIn(proto.getRepeatedBytesList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .addRepeatedBytes(ByteString.EMPTY);

    assertThat(builder.getRepeatedBytesCount()).isEqualTo(3);
    assertThat(builder.getRepeatedBytes(0)).isEqualTo(TEST_STRING);
    assertThat(builder.getRepeatedBytes(1)).isEqualTo(ByteString.EMPTY);
    assertThat(builder.getRepeatedBytes(2)).isEqualTo(ByteString.EMPTY);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedBytes(3));
    }

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedBytesCount()).isEqualTo(3);
    assertThat(proto.getRepeatedBytes(0)).isEqualTo(TEST_STRING);
    assertThat(proto.getRepeatedBytes(1)).isEqualTo(ByteString.EMPTY);
    assertThat(proto.getRepeatedBytes(2)).isEqualTo(ByteString.EMPTY);

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedBytes(3));
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .addRepeatedBytes(ByteString.copyFrom(new byte[] {0, 0, 0}))
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedBytes();
    assertThat(builder.getRepeatedBytesCount()).isEqualTo(0);
    assertThat(builder.getRepeatedBytesList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedBytesCount()).isEqualTo(0);
    assertThat(proto.getRepeatedBytesCount()).isEqualTo(0);
  }
}
