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

import com.google.protobuf.contrib.j2cl.protos.Enums.Aliased;
import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto;
import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto.NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto.SparseEnum;
import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto.TestEnum;
import java.util.Arrays;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class EnumFieldsTest {

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(EnumTestProto.getDefaultInstance().hasOptionalEnum()).isFalse();
    assertThat(EnumTestProto.getDefaultInstance().getOptionalEnum()).isEqualTo(TestEnum.DEFAULT);
  }

  @Test
  public void testOptionalFieldNoDefault_defaultInstanceNativeEnum() {
    assertThat(EnumTestProto.getDefaultInstance().hasOptionalNativeEnum()).isFalse();
    assertThat(EnumTestProto.getDefaultInstance().getOptionalNativeEnum())
        .isEqualTo(NativeEnum.NATIVE_DEFAULT);
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    EnumTestProto.Builder builder = EnumTestProto.newBuilder().setOptionalEnum(TestEnum.TWO);
    assertThat(builder.hasOptionalEnum()).isTrue();
    assertThat(builder.getOptionalEnum()).isEqualTo(TestEnum.TWO);

    EnumTestProto proto = builder.build();
    assertThat(proto.hasOptionalEnum()).isTrue();
    assertThat(proto.getOptionalEnum()).isEqualTo(TestEnum.TWO);
  }

  @Test
  public void testOptionalFieldNoDefault_setValueNativeEnum() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder().setOptionalNativeEnum(NativeEnum.NATIVE_TWO);
    assertThat(builder.hasOptionalNativeEnum()).isTrue();
    assertThat(builder.getOptionalNativeEnum()).isEqualTo(NativeEnum.NATIVE_TWO);

    EnumTestProto proto = builder.build();
    assertThat(proto.hasOptionalNativeEnum()).isTrue();
    assertThat(proto.getOptionalNativeEnum()).isEqualTo(NativeEnum.NATIVE_TWO);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    EnumTestProto startProto = EnumTestProto.newBuilder().setOptionalEnum(TestEnum.TWO).build();

    EnumTestProto.Builder builder = startProto.toBuilder().clearOptionalEnum();
    assertThat(builder.hasOptionalEnum()).isFalse();

    EnumTestProto proto = builder.build();
    assertThat(proto.hasOptionalEnum()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_clearOptionalNativeEnum() {
    EnumTestProto startProto =
        EnumTestProto.newBuilder().setOptionalNativeEnum(NativeEnum.NATIVE_TWO).build();

    EnumTestProto.Builder builder = startProto.toBuilder().clearOptionalNativeEnum();
    assertThat(builder.hasOptionalNativeEnum()).isFalse();

    EnumTestProto proto = builder.build();
    assertThat(proto.hasOptionalNativeEnum()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertThat(EnumTestProto.getDefaultInstance().hasOptionalEnum()).isFalse();
    assertThat(EnumTestProto.getDefaultInstance().getOptionalEnumWithDefault())
        .isEqualTo(TestEnum.ONE);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder().setOptionalEnumWithDefault(TestEnum.TWO);
    assertThat(builder.hasOptionalEnumWithDefault()).isTrue();
    assertThat(builder.getOptionalEnumWithDefault()).isEqualTo(TestEnum.TWO);

    EnumTestProto proto = builder.build();
    assertThat(proto.hasOptionalEnumWithDefault()).isTrue();
    assertThat(proto.getOptionalEnumWithDefault()).isEqualTo(TestEnum.TWO);
  }

  @Test
  public void testOptionalFieldWithDefault_setValueNativeEnum() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder().setOptionalNativeEnum(NativeEnum.NATIVE_TWO);
    assertThat(builder.hasOptionalNativeEnum()).isTrue();
    assertThat(builder.getOptionalNativeEnum()).isEqualTo(NativeEnum.NATIVE_TWO);

    EnumTestProto proto = builder.build();
    assertThat(proto.hasOptionalNativeEnum()).isTrue();
    assertThat(proto.getOptionalNativeEnum()).isEqualTo(NativeEnum.NATIVE_TWO);
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder().setOptionalEnumWithDefault(TestEnum.THREE);
    assertThat(builder.hasOptionalEnumWithDefault()).isTrue();
    assertThat(builder.getOptionalEnumWithDefault()).isEqualTo(TestEnum.THREE);

    EnumTestProto proto = builder.build();
    assertThat(proto.hasOptionalEnumWithDefault()).isTrue();
    assertThat(proto.getOptionalEnumWithDefault()).isEqualTo(TestEnum.THREE);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(EnumTestProto.getDefaultInstance().getRepeatedEnumCount()).isEqualTo(0);
    assertThat(EnumTestProto.newBuilder().build().getRepeatedEnumCount()).isEqualTo(0);
    assertThrows(Exception.class, () -> EnumTestProto.newBuilder().build().getRepeatedEnum(0));
  }

  @Test
  public void testRepeatedField_defaultInstanceNativeEnum() {
    assertThat(EnumTestProto.getDefaultInstance().getRepeatedNativeEnumCount()).isEqualTo(0);
    assertThat(EnumTestProto.newBuilder().build().getRepeatedNativeEnumCount()).isEqualTo(0);
    assertThrows(
        Exception.class, () -> EnumTestProto.newBuilder().build().getRepeatedNativeEnum(0));
  }

  @Test
  public void testRepeatedField_add() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder().addRepeatedEnum(TestEnum.TWO).addRepeatedEnum(TestEnum.THREE);

    assertThat(builder.getRepeatedEnumList())
        .containsExactly(TestEnum.TWO, TestEnum.THREE)
        .inOrder();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumList()).containsExactly(TestEnum.TWO, TestEnum.THREE).inOrder();
  }

  @Test
  public void testRepeatedField_addNativeEnum() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder()
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE);

    assertThat(builder.getRepeatedNativeEnumList())
        .containsExactly(NativeEnum.NATIVE_TWO, NativeEnum.NATIVE_THREE)
        .inOrder();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedNativeEnumList())
        .containsExactly(NativeEnum.NATIVE_TWO, NativeEnum.NATIVE_THREE)
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    EnumTestProto startProto =
        EnumTestProto.newBuilder()
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .build();

    EnumTestProto.Builder builder =
        startProto.toBuilder()
            .addAllRepeatedEnum(Arrays.asList(TestEnum.ONE, TestEnum.TWO, TestEnum.THREE));
    assertThat(builder.getRepeatedEnumList())
        .containsExactly(TestEnum.TWO, TestEnum.THREE, TestEnum.ONE, TestEnum.TWO, TestEnum.THREE)
        .inOrder();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumList())
        .containsExactly(TestEnum.TWO, TestEnum.THREE, TestEnum.ONE, TestEnum.TWO, TestEnum.THREE)
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAllNativeEnum() {
    EnumTestProto startProto =
        EnumTestProto.newBuilder()
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE)
            .build();

    EnumTestProto.Builder builder =
        startProto.toBuilder()
            .addAllRepeatedNativeEnum(
                Arrays.asList(
                    NativeEnum.NATIVE_ONE, NativeEnum.NATIVE_TWO, NativeEnum.NATIVE_THREE));
    assertThat(builder.getRepeatedNativeEnumList())
        .containsExactly(
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE,
            NativeEnum.NATIVE_ONE,
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE)
        .inOrder();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedNativeEnumList())
        .containsExactly(
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE,
            NativeEnum.NATIVE_ONE,
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE)
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    EnumTestProto startProto =
        EnumTestProto.newBuilder()
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .addRepeatedEnum(TestEnum.ONE)
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .build();

    EnumTestProto.Builder builder = startProto.toBuilder().setRepeatedEnum(2, TestEnum.ONE);
    assertThat(builder.getRepeatedEnumList())
        .containsExactly(TestEnum.TWO, TestEnum.THREE, TestEnum.ONE, TestEnum.TWO, TestEnum.THREE)
        .inOrder();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumList())
        .containsExactly(TestEnum.TWO, TestEnum.THREE, TestEnum.ONE, TestEnum.TWO, TestEnum.THREE)
        .inOrder();
  }

  @Test
  public void testRepeatedField_setOptionalNativeEnum() {
    EnumTestProto startProto =
        EnumTestProto.newBuilder()
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_ONE)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE)
            .build();

    EnumTestProto.Builder builder =
        startProto.toBuilder().setRepeatedNativeEnum(2, NativeEnum.NATIVE_ONE);
    assertThat(builder.getRepeatedNativeEnumList())
        .containsExactly(
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE,
            NativeEnum.NATIVE_ONE,
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE)
        .inOrder();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedNativeEnumList())
        .containsExactly(
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE,
            NativeEnum.NATIVE_ONE,
            NativeEnum.NATIVE_TWO,
            NativeEnum.NATIVE_THREE)
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder()
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .addRepeatedEnum(TestEnum.ONE)
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE);

    assertThat(builder.getRepeatedEnumCount()).isEqualTo(5);
    assertThat(builder.getRepeatedEnum(0)).isEqualTo(TestEnum.TWO);
    assertThat(builder.getRepeatedEnum(1)).isEqualTo(TestEnum.THREE);
    assertThat(builder.getRepeatedEnum(2)).isEqualTo(TestEnum.ONE);
    assertThat(builder.getRepeatedEnum(3)).isEqualTo(TestEnum.TWO);
    assertThat(builder.getRepeatedEnum(4)).isEqualTo(TestEnum.THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedEnum(5));
    } else {
      assertThat(builder.getRepeatedEnum(5)).isEqualTo(TestEnum.DEFAULT);
    }

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumCount()).isEqualTo(5);
    assertThat(proto.getRepeatedEnum(0)).isEqualTo(TestEnum.TWO);
    assertThat(proto.getRepeatedEnum(1)).isEqualTo(TestEnum.THREE);
    assertThat(proto.getRepeatedEnum(2)).isEqualTo(TestEnum.ONE);
    assertThat(proto.getRepeatedEnum(3)).isEqualTo(TestEnum.TWO);
    assertThat(proto.getRepeatedEnum(4)).isEqualTo(TestEnum.THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedEnum(5));
    } else {
      assertThat(proto.getRepeatedEnum(5)).isEqualTo(TestEnum.DEFAULT);
    }
  }

  @Test
  public void testRepeatedField_getAndCountNativeEnum() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder()
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_ONE)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE);

    assertThat(builder.getRepeatedNativeEnumCount()).isEqualTo(5);
    assertThat(builder.getRepeatedNativeEnum(0)).isEqualTo(NativeEnum.NATIVE_TWO);
    assertThat(builder.getRepeatedNativeEnum(1)).isEqualTo(NativeEnum.NATIVE_THREE);
    assertThat(builder.getRepeatedNativeEnum(2)).isEqualTo(NativeEnum.NATIVE_ONE);
    assertThat(builder.getRepeatedNativeEnum(3)).isEqualTo(NativeEnum.NATIVE_TWO);
    assertThat(builder.getRepeatedNativeEnum(4)).isEqualTo(NativeEnum.NATIVE_THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedNativeEnum(5));
    } else {
      assertThat(builder.getRepeatedNativeEnum(5)).isEqualTo(NativeEnum.NATIVE_DEFAULT);
    }

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedNativeEnumCount()).isEqualTo(5);
    assertThat(proto.getRepeatedNativeEnum(0)).isEqualTo(NativeEnum.NATIVE_TWO);
    assertThat(proto.getRepeatedNativeEnum(1)).isEqualTo(NativeEnum.NATIVE_THREE);
    assertThat(proto.getRepeatedNativeEnum(2)).isEqualTo(NativeEnum.NATIVE_ONE);
    assertThat(proto.getRepeatedNativeEnum(3)).isEqualTo(NativeEnum.NATIVE_TWO);
    assertThat(proto.getRepeatedNativeEnum(4)).isEqualTo(NativeEnum.NATIVE_THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedNativeEnum(5));
    } else {
      assertThat(proto.getRepeatedNativeEnum(5)).isEqualTo(NativeEnum.NATIVE_DEFAULT);
    }
  }

  @Test
  public void testRepeatedField_clear() {
    EnumTestProto startProto =
        EnumTestProto.newBuilder()
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .addRepeatedEnum(TestEnum.ONE)
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .build();

    EnumTestProto.Builder builder = startProto.toBuilder().clearRepeatedEnum();
    assertThat(builder.getRepeatedEnumCount()).isEqualTo(0);
    assertThat(builder.getRepeatedEnumList()).isEmpty();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumCount()).isEqualTo(0);
    assertThat(proto.getRepeatedEnumCount()).isEqualTo(0);
  }

  @Test
  public void testRepeatedField_clearOptionalNativeEnum() {
    EnumTestProto startProto =
        EnumTestProto.newBuilder()
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_ONE)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(NativeEnum.NATIVE_THREE)
            .build();

    EnumTestProto.Builder builder = startProto.toBuilder().clearRepeatedNativeEnum();
    assertThat(builder.getRepeatedNativeEnumCount()).isEqualTo(0);
    assertThat(builder.getRepeatedNativeEnumList()).isEmpty();

    EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedNativeEnumCount()).isEqualTo(0);
    assertThat(proto.getRepeatedNativeEnumCount()).isEqualTo(0);
  }

  @Test
  public void testGetNumber() throws Exception {
    assertThat(TestEnum.DEFAULT.getNumber()).isEqualTo(0);
    assertThat(TestEnum.ONE.getNumber()).isEqualTo(1);
    assertThat(TestEnum.TWO.getNumber()).isEqualTo(2);

    assertThat(SparseEnum.SPARSE_DEFAULT.getNumber()).isEqualTo(0);
    assertThat(SparseEnum.SPARSE_TEN.getNumber()).isEqualTo(10);
    assertThat(SparseEnum.SPARSE_TWENTY.getNumber()).isEqualTo(20);

    assertThat(NativeEnum.NATIVE_DEFAULT.getNumber()).isEqualTo(0);
    assertThat(NativeEnum.NATIVE_ONE.getNumber()).isEqualTo(1);
    assertThat(NativeEnum.NATIVE_TWO.getNumber()).isEqualTo(2);

    assertThat(Aliased.TestEnum.DEFAULT.getNumber()).isEqualTo(0);
    assertThat(Aliased.TestEnum.ORIGINAL.getNumber()).isEqualTo(1);
    assertThat(Aliased.TestEnum.ALIAS.getNumber()).isEqualTo(1);

    assertThat(Aliased.NativeEnum.NATIVE_DEFAULT.getNumber()).isEqualTo(0);
    assertThat(Aliased.NativeEnum.NATIVE_ORIGINAL.getNumber()).isEqualTo(1);
    assertThat(Aliased.NativeEnum.NATIVE_ALIAS.getNumber()).isEqualTo(1);
  }

  @Test
  public void testForNumber() {
    assertThat(TestEnum.forNumber(0)).isEqualTo(TestEnum.DEFAULT);
    assertThat(TestEnum.forNumber(1)).isEqualTo(TestEnum.ONE);
    assertThat(TestEnum.forNumber(2)).isEqualTo(TestEnum.TWO);

    assertThat(SparseEnum.forNumber(0)).isEqualTo(SparseEnum.SPARSE_DEFAULT);
    assertThat(SparseEnum.forNumber(10)).isEqualTo(SparseEnum.SPARSE_TEN);
    assertThat(SparseEnum.forNumber(20)).isEqualTo(SparseEnum.SPARSE_TWENTY);

    assertThat(NativeEnum.forNumber(0)).isEqualTo(NativeEnum.NATIVE_DEFAULT);
    assertThat(NativeEnum.forNumber(1)).isEqualTo(NativeEnum.NATIVE_ONE);
    assertThat(NativeEnum.forNumber(2)).isEqualTo(NativeEnum.NATIVE_TWO);

    assertThat(Aliased.TestEnum.forNumber(0)).isEqualTo(Aliased.TestEnum.DEFAULT);
    assertThat(Aliased.TestEnum.forNumber(1)).isEqualTo(Aliased.TestEnum.ORIGINAL);
    assertThat(Aliased.TestEnum.forNumber(1)).isEqualTo(Aliased.TestEnum.ORIGINAL);

    assertThat(Aliased.NativeEnum.forNumber(0)).isEqualTo(Aliased.NativeEnum.NATIVE_DEFAULT);
    assertThat(Aliased.NativeEnum.forNumber(1)).isEqualTo(Aliased.NativeEnum.NATIVE_ORIGINAL);
    assertThat(Aliased.NativeEnum.forNumber(1)).isEqualTo(Aliased.NativeEnum.NATIVE_ORIGINAL);
  }

  @Test
  public void testForNumberWithUnknownValue() {
    assertThat(TestEnum.forNumber(-1)).isNull();
    assertThat(TestEnum.forNumber(100)).isNull();

    assertThat(SparseEnum.forNumber(-1)).isNull();
    assertThat(SparseEnum.forNumber(100)).isNull();

    assertThat(Aliased.TestEnum.forNumber(-1)).isNull();
    assertThat(Aliased.TestEnum.forNumber(100)).isNull();

    // Note that enum field with unknown value is tested NativeEnumForNumberTest. Unlike that class
    // this is tested both in J2CL and JVM and ensures consistent forNumber behavior.
  }
}
