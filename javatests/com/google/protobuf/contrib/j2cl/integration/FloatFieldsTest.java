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
public class FloatFieldsTest {
  private static Float PROTO_DEFAULT_FLOAT = 1.35f;
  private static Float DELTA = 0.00001f;

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getOptionalFloat()).isWithin(DELTA).of(0);
    assertThat(TestProto.getDefaultInstance().hasOptionalFloat()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalFloat(89.64f);
    assertThat(builder.hasOptionalFloat()).isTrue();
    assertThat(builder.getOptionalFloat()).isWithin(DELTA).of(89.64f);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalFloat()).isTrue();
    assertThat(proto.getOptionalFloat()).isWithin(DELTA).of(89.64f);
  }

  @Test
  public void testOptionalFieldNoDefault_setDefault() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalFloat(0f);
    assertThat(builder.hasOptionalFloat()).isTrue();
    assertThat(builder.getOptionalFloat()).isWithin(DELTA).of(0f);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalFloat()).isTrue();
    assertThat(proto.getOptionalFloat()).isWithin(DELTA).of(0f);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalFloat(1f).build();

    // Test clear
    TestProto.Builder builder = startProto.toBuilder();
    assertThat(builder.hasOptionalFloat()).isTrue();
    builder.clearOptionalFloat();
    assertThat(builder.hasOptionalFloat()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalFloat()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getOptionalFloatWithDefault())
        .isWithin(DELTA)
        .of(PROTO_DEFAULT_FLOAT);
    assertThat(TestProto.getDefaultInstance().hasOptionalFloatWithDefault()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalFloatWithDefault(PROTO_DEFAULT_FLOAT);
    assertThat(builder.hasOptionalFloatWithDefault()).isTrue();
    assertThat(builder.getOptionalFloatWithDefault()).isWithin(DELTA).of(PROTO_DEFAULT_FLOAT);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalFloatWithDefault()).isTrue();
    assertThat(proto.getOptionalFloatWithDefault()).isWithin(DELTA).of(PROTO_DEFAULT_FLOAT);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalFloatWithDefault(246f);
    assertThat(builder.hasOptionalFloatWithDefault()).isTrue();
    assertThat(builder.getOptionalFloatWithDefault()).isWithin(DELTA).of(246f);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalFloatWithDefault()).isTrue();
    assertThat(proto.getOptionalFloatWithDefault()).isWithin(DELTA).of(246f);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedFloatCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedFloatCount()).isEqualTo(0);

    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedFloat(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedFloat(1.324f).addRepeatedFloat(24f);
    assertThat(Arrays.asList(1.324f, 24f))
        .containsExactlyElementsIn(builder.getRepeatedFloatList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(1.324f, 24f))
        .containsExactlyElementsIn(proto.getRepeatedFloatList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder().addRepeatedFloat(1.324f).addRepeatedFloat(24f).build();

    TestProto.Builder builder =
        startProto.toBuilder().addAllRepeatedFloat(Arrays.asList(-1f, -2f, -3f));
    assertThat(Arrays.asList(1.324f, 24f, -1f, -2f, -3f))
        .containsExactlyElementsIn(builder.getRepeatedFloatList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(1.324f, 24f, -1f, -2f, -3f))
        .containsExactlyElementsIn(proto.getRepeatedFloatList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedFloat(1.324f)
            .addRepeatedFloat(24f)
            .addRepeatedFloat(-1f)
            .addRepeatedFloat(-2f)
            .addRepeatedFloat(-3f)
            .build();

    TestProto.Builder builder = startProto.toBuilder().setRepeatedFloat(2, 333f);
    assertThat(Arrays.asList(1.324f, 24f, 333f, -2f, -3f))
        .containsExactlyElementsIn(builder.getRepeatedFloatList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(1.324f, 24f, 333f, -2f, -3f))
        .containsExactlyElementsIn(proto.getRepeatedFloatList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedFloat(1.324f)
            .addRepeatedFloat(24f)
            .addRepeatedFloat(-1f)
            .addRepeatedFloat(-2f)
            .addRepeatedFloat(-3f);

    assertThat(builder.getRepeatedFloatCount()).isEqualTo(5);
    assertThat(builder.getRepeatedFloat(0)).isWithin(DELTA).of(1.324f);
    assertThat(builder.getRepeatedFloat(1)).isWithin(DELTA).of(24f);
    assertThat(builder.getRepeatedFloat(2)).isWithin(DELTA).of(-1f);
    assertThat(builder.getRepeatedFloat(3)).isWithin(DELTA).of(-2f);
    assertThat(builder.getRepeatedFloat(4)).isWithin(DELTA).of(-3f);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedFloat(5));
    } else {
      assertThat(builder.getRepeatedFloat(5)).isNaN();
    }

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedFloat(0)).isWithin(DELTA).of(1.324f);
    assertThat(proto.getRepeatedFloat(1)).isWithin(DELTA).of(24f);
    assertThat(proto.getRepeatedFloat(2)).isWithin(DELTA).of(-1f);
    assertThat(proto.getRepeatedFloat(3)).isWithin(DELTA).of(-2f);
    assertThat(proto.getRepeatedFloat(4)).isWithin(DELTA).of(-3f);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedFloat(5));
    } else {
      assertThat(proto.getRepeatedFloat(5)).isNaN();
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedFloat(1.324f)
            .addRepeatedFloat(24f)
            .addRepeatedFloat(-1f)
            .addRepeatedFloat(-2f)
            .addRepeatedFloat(-3f)
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedFloat();
    assertThat(builder.getRepeatedFloatCount()).isEqualTo(0);
    assertThat(builder.getRepeatedFloatList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedFloatCount()).isEqualTo(0);
    assertThat(proto.getRepeatedFloatCount()).isEqualTo(0);
  }
}
