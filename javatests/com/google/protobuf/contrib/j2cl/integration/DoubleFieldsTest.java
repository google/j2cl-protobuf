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
public class DoubleFieldsTest {
  private static double PROTO_DEFAULT_FLOAT = 2.46d;
  private static double DELTA = 0.00001d;

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getOptionalDouble()).isWithin(DELTA).of(0);
    assertThat(TestProto.getDefaultInstance().hasOptionalDouble()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalDouble(89.64d);
    assertThat(builder.hasOptionalDouble()).isTrue();
    assertThat(builder.getOptionalDouble()).isWithin(DELTA).of(89.64d);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalDouble()).isTrue();
    assertThat(proto.getOptionalDouble()).isWithin(DELTA).of(89.64d);
  }

  @Test
  public void testOptionalFieldNoDefault_setDefault() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalDouble(0d);
    assertThat(builder.hasOptionalDouble()).isTrue();
    assertThat(builder.getOptionalDouble()).isWithin(DELTA).of(0d);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalDouble()).isTrue();
    assertThat(proto.getOptionalDouble()).isWithin(DELTA).of(0d);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalDouble(1).build();

    // Test clear
    TestProto.Builder builder = startProto.toBuilder();
    assertThat(builder.hasOptionalDouble()).isTrue();
    builder.clearOptionalDouble();
    assertThat(builder.hasOptionalDouble()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalDouble()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getOptionalDoubleWithDefault())
        .isWithin(DELTA)
        .of(2.46d);
    assertThat(TestProto.getDefaultInstance().hasOptionalDoubleWithDefault()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalDoubleWithDefault(PROTO_DEFAULT_FLOAT);
    assertThat(builder.hasOptionalDoubleWithDefault()).isTrue();
    assertThat(builder.getOptionalDoubleWithDefault()).isWithin(DELTA).of(PROTO_DEFAULT_FLOAT);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalDoubleWithDefault()).isTrue();
    assertThat(proto.getOptionalDoubleWithDefault()).isWithin(DELTA).of(PROTO_DEFAULT_FLOAT);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalDoubleWithDefault(246);
    assertThat(builder.hasOptionalDoubleWithDefault()).isTrue();
    assertThat(builder.getOptionalDoubleWithDefault()).isWithin(DELTA).of(246);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalDoubleWithDefault()).isTrue();
    assertThat(proto.getOptionalDoubleWithDefault()).isWithin(DELTA).of(246);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedDoubleCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedDoubleCount()).isEqualTo(0);

    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedDouble(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedDouble(1.324d).addRepeatedDouble(24d);
    assertThat(Arrays.asList(1.324d, 24d))
        .containsExactlyElementsIn(builder.getRepeatedDoubleList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(1.324d, 24d))
        .containsExactlyElementsIn(proto.getRepeatedDoubleList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder().addRepeatedDouble(1.324d).addRepeatedDouble(24d).build();

    TestProto.Builder builder =
        startProto.toBuilder().addAllRepeatedDouble(Arrays.asList(-1d, -2d, -3d));
    assertThat(Arrays.asList(1.324d, 24d, -1d, -2d, -3d))
        .containsExactlyElementsIn(builder.getRepeatedDoubleList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(1.324d, 24d, -1d, -2d, -3d))
        .containsExactlyElementsIn(proto.getRepeatedDoubleList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedDouble(1.324d)
            .addRepeatedDouble(24d)
            .addRepeatedDouble(-1d)
            .addRepeatedDouble(-2d)
            .addRepeatedDouble(-3d)
            .build();

    TestProto.Builder builder = startProto.toBuilder().setRepeatedDouble(2, 333d);
    assertThat(Arrays.asList(1.324d, 24d, 333d, -2d, -3d))
        .containsExactlyElementsIn(builder.getRepeatedDoubleList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(1.324d, 24d, 333d, -2d, -3d))
        .containsExactlyElementsIn(proto.getRepeatedDoubleList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedDouble(1.324d)
            .addRepeatedDouble(24d)
            .addRepeatedDouble(-1d)
            .addRepeatedDouble(-2d)
            .addRepeatedDouble(-3d);

    assertThat(builder.getRepeatedDoubleCount()).isEqualTo(5);
    assertThat(builder.getRepeatedDouble(0)).isWithin(DELTA).of(1.324d);
    assertThat(builder.getRepeatedDouble(1)).isWithin(DELTA).of(24d);
    assertThat(builder.getRepeatedDouble(2)).isWithin(DELTA).of(-1d);
    assertThat(builder.getRepeatedDouble(3)).isWithin(DELTA).of(-2d);
    assertThat(builder.getRepeatedDouble(4)).isWithin(DELTA).of(-3d);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedDouble(5));
    } else {
      assertThat(builder.getRepeatedDouble(5)).isNaN();
    }

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedDouble(0)).isWithin(DELTA).of(1.324d);
    assertThat(proto.getRepeatedDouble(1)).isWithin(DELTA).of(24d);
    assertThat(proto.getRepeatedDouble(2)).isWithin(DELTA).of(-1d);
    assertThat(proto.getRepeatedDouble(3)).isWithin(DELTA).of(-2d);
    assertThat(proto.getRepeatedDouble(4)).isWithin(DELTA).of(-3d);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedDouble(5));
    } else {
      assertThat(proto.getRepeatedDouble(5)).isNaN();
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedDouble(1.324)
            .addRepeatedDouble(24)
            .addRepeatedDouble(-1)
            .addRepeatedDouble(-2)
            .addRepeatedDouble(-3)
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedDouble();
    assertThat(builder.getRepeatedDoubleCount()).isEqualTo(0);
    assertThat(builder.getRepeatedDoubleList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedDoubleCount()).isEqualTo(0);
    assertThat(proto.getRepeatedDoubleCount()).isEqualTo(0);
  }
}
