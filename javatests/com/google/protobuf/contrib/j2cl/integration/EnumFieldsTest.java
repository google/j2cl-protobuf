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
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto;
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto.Proto3NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto.Proto3SparseEnum;
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto.Proto3TestEnum;
import java.util.Arrays;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class EnumFieldsTest {

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(EnumTestProto.getDefaultInstance().hasOptionalEnum()).isFalse();
    assertThat(EnumTestProto.getDefaultInstance().getOptionalEnum()).isEqualTo(TestEnum.DEFAULT);
    assertThat(Proto3EnumTestProto.getDefaultInstance().getOptionalEnum())
        .isEqualTo(Proto3TestEnum.DEFAULT);
    assertThat(Proto3EnumTestProto.getDefaultInstance().getOptionalEnumValue()).isEqualTo(0);
  }

  @Test
  public void testOptionalFieldNoDefault_defaultInstanceNativeEnum() {
    assertThat(EnumTestProto.getDefaultInstance().hasOptionalNativeEnum()).isFalse();
    assertThat(EnumTestProto.getDefaultInstance().getOptionalNativeEnum())
        .isEqualTo(NativeEnum.NATIVE_DEFAULT);
    assertThat(Proto3EnumTestProto.getDefaultInstance().getOptionalNativeEnum())
        .isEqualTo(Proto3NativeEnum.NATIVE_DEFAULT);
    assertThat(Proto3EnumTestProto.getDefaultInstance().getOptionalNativeEnumValue()).isEqualTo(0);
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
  public void testOptionalFieldNoDefault_setIntValue() {
    assertThat(Proto3EnumTestProto.getDefaultInstance().getOptionalEnumValue()).isEqualTo(0);
    Proto3EnumTestProto.Builder builder = Proto3EnumTestProto.newBuilder().setOptionalEnumValue(2);
    assertThat(builder.getOptionalEnum()).isEqualTo(Proto3TestEnum.TWO);
    assertThat(builder.getOptionalEnumValue()).isEqualTo(2);

    Proto3EnumTestProto proto = builder.build();
    assertThat(proto.getOptionalEnum()).isEqualTo(Proto3TestEnum.TWO);
    assertThat(proto.getOptionalEnumValue()).isEqualTo(2);
  }

  @Test
  public void testOptionalFieldNoDefault_setUnknownIntValue() {
    Proto3EnumTestProto.Builder builder = Proto3EnumTestProto.newBuilder().setOptionalEnumValue(5);
    assertThat(builder.getOptionalEnum()).isEqualTo(Proto3TestEnum.UNRECOGNIZED);
    assertThat(builder.getOptionalEnumValue()).isEqualTo(5);

    Proto3EnumTestProto proto = builder.build();
    assertThat(proto.getOptionalEnum()).isEqualTo(Proto3TestEnum.UNRECOGNIZED);
    assertThat(proto.getOptionalEnumValue()).isEqualTo(5);
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
  public void testOptionalFieldNoDefault_setIntValueNativeEnum() {
    Proto3EnumTestProto.Builder builder =
        Proto3EnumTestProto.newBuilder().setOptionalNativeEnumValue(2);
    assertThat(builder.getOptionalNativeEnum()).isEqualTo(Proto3NativeEnum.NATIVE_TWO);
    assertThat(builder.getOptionalNativeEnumValue()).isEqualTo(2);

    Proto3EnumTestProto proto = builder.build();
    assertThat(proto.getOptionalNativeEnum()).isEqualTo(Proto3NativeEnum.NATIVE_TWO);
    assertThat(proto.getOptionalNativeEnumValue()).isEqualTo(2);
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
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> EnumTestProto.newBuilder().build().getRepeatedEnum(0));
    } else {
      AssertionError error =
          assertThrows(
              AssertionError.class, () -> EnumTestProto.newBuilder().build().getRepeatedEnum(0));
      assertThat(error).hasCauseThat().isInstanceOf(ClassCastException.class);
    }
  }

  @Test
  public void testRepeatedField_defaultInstanceNativeEnum() {
    assertThat(EnumTestProto.getDefaultInstance().getRepeatedNativeEnumCount()).isEqualTo(0);
    assertThat(EnumTestProto.newBuilder().build().getRepeatedNativeEnumCount()).isEqualTo(0);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(
          Exception.class, () -> EnumTestProto.newBuilder().build().getRepeatedNativeEnum(0));
    }
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
  public void testRepeatedField_addIntValue() {
    Proto3EnumTestProto.Builder builder =
        Proto3EnumTestProto.newBuilder()
            .addRepeatedEnumValue(2)
            .addRepeatedEnumValue(3)
            .addRepeatedEnumValue(5);

    assertThat(builder.getRepeatedEnumList())
        .containsExactly(Proto3TestEnum.TWO, Proto3TestEnum.THREE, Proto3TestEnum.UNRECOGNIZED)
        .inOrder();

    Proto3EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumList())
        .containsExactly(Proto3TestEnum.TWO, Proto3TestEnum.THREE, Proto3TestEnum.UNRECOGNIZED)
        .inOrder();
  }

  @Test
  public void testRepeatedField_addIntNativeEnum() {
    Proto3EnumTestProto.Builder builder =
        Proto3EnumTestProto.newBuilder()
            .addRepeatedNativeEnum(Proto3NativeEnum.NATIVE_TWO)
            .addRepeatedNativeEnum(Proto3NativeEnum.NATIVE_THREE);

    assertThat(builder.getRepeatedNativeEnumList())
        .containsExactly(Proto3NativeEnum.NATIVE_TWO, Proto3NativeEnum.NATIVE_THREE)
        .inOrder();

    Proto3EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedNativeEnumList())
        .containsExactly(Proto3NativeEnum.NATIVE_TWO, Proto3NativeEnum.NATIVE_THREE)
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
  public void testRepeatedField_setIntValue() {
    Proto3EnumTestProto startProto =
        Proto3EnumTestProto.newBuilder()
            .addRepeatedEnumValue(2)
            .addRepeatedEnumValue(3)
            .addRepeatedEnumValue(3)
            .addRepeatedEnumValue(5)
            .build();

    Proto3EnumTestProto.Builder builder = startProto.toBuilder().setRepeatedEnumValue(2, 1);
    assertThat(builder.getRepeatedEnumList())
        .containsExactly(
            Proto3TestEnum.TWO,
            Proto3TestEnum.THREE,
            Proto3TestEnum.ONE,
            Proto3TestEnum.UNRECOGNIZED)
        .inOrder();
    assertThat(builder.getRepeatedEnumValue(0)).isEqualTo(2);
    assertThat(builder.getRepeatedEnumValue(1)).isEqualTo(3);
    assertThat(builder.getRepeatedEnumValue(2)).isEqualTo(1);
    assertThat(builder.getRepeatedEnumValue(3)).isEqualTo(5);

    Proto3EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumList())
        .containsExactly(
            Proto3TestEnum.TWO,
            Proto3TestEnum.THREE,
            Proto3TestEnum.ONE,
            Proto3TestEnum.UNRECOGNIZED)
        .inOrder();
    assertThat(proto.getRepeatedEnumValue(0)).isEqualTo(2);
    assertThat(proto.getRepeatedEnumValue(1)).isEqualTo(3);
    assertThat(proto.getRepeatedEnumValue(2)).isEqualTo(1);
    assertThat(proto.getRepeatedEnumValue(3)).isEqualTo(5);
  }

  @Test
  public void testRepeatedField_setIntValueOptionalNativeEnum() {
    Proto3EnumTestProto startProto =
        Proto3EnumTestProto.newBuilder()
            .addRepeatedNativeEnumValue(2)
            .addRepeatedNativeEnumValue(3)
            .addRepeatedNativeEnumValue(3)
            .build();

    Proto3EnumTestProto.Builder builder = startProto.toBuilder().setRepeatedNativeEnumValue(2, 1);
    assertThat(builder.getRepeatedNativeEnumList())
        .containsExactly(
            Proto3NativeEnum.NATIVE_TWO, Proto3NativeEnum.NATIVE_THREE, Proto3NativeEnum.NATIVE_ONE)
        .inOrder();
    assertThat(builder.getRepeatedNativeEnumValue(0)).isEqualTo(2);
    assertThat(builder.getRepeatedNativeEnumValue(1)).isEqualTo(3);
    assertThat(builder.getRepeatedNativeEnumValue(2)).isEqualTo(1);

    Proto3EnumTestProto proto = builder.build();
    assertThat(proto.getRepeatedNativeEnumList())
        .containsExactly(
            Proto3NativeEnum.NATIVE_TWO, Proto3NativeEnum.NATIVE_THREE, Proto3NativeEnum.NATIVE_ONE)
        .inOrder();
    assertThat(proto.getRepeatedNativeEnumValue(0)).isEqualTo(2);
    assertThat(proto.getRepeatedNativeEnumValue(1)).isEqualTo(3);
    assertThat(proto.getRepeatedNativeEnumValue(2)).isEqualTo(1);
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
      AssertionError error = assertThrows(AssertionError.class, () -> builder.getRepeatedEnum(5));
      assertThat(error).hasCauseThat().isInstanceOf(ClassCastException.class);
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
      AssertionError error = assertThrows(AssertionError.class, () -> proto.getRepeatedEnum(5));
      assertThat(error).hasCauseThat().isInstanceOf(ClassCastException.class);
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
  public void testRepeatedField_getReturnsImmutableList() {
    EnumTestProto.Builder builder =
        EnumTestProto.newBuilder().addRepeatedNativeEnum(NativeEnum.NATIVE_ONE);
    List<NativeEnum> repeatedFieldList = builder.getRepeatedNativeEnumList();

    assertThrows(Exception.class, () -> repeatedFieldList.add(NativeEnum.NATIVE_TWO));
    assertThrows(Exception.class, () -> repeatedFieldList.remove(0));
  }

  @Test
  public void testValues() throws Exception {
    assertThat(TestEnum.values())
        .asList()
        .containsExactly(TestEnum.DEFAULT, TestEnum.ONE, TestEnum.TWO, TestEnum.THREE)
        .inOrder();
    assertThat(SparseEnum.values())
        .asList()
        .containsExactly(SparseEnum.SPARSE_DEFAULT, SparseEnum.SPARSE_TEN, SparseEnum.SPARSE_TWENTY)
        .inOrder();
    assertThat(Aliased.TestEnum.values())
        .asList()
        .containsExactly(Aliased.TestEnum.DEFAULT, Aliased.TestEnum.ORIGINAL, Aliased.TestEnum.FOO)
        .inOrder();
    assertThat(Proto3TestEnum.values())
        .asList()
        .containsExactly(
            Proto3TestEnum.DEFAULT,
            Proto3TestEnum.ONE,
            Proto3TestEnum.TWO,
            Proto3TestEnum.THREE,
            Proto3TestEnum.UNRECOGNIZED)
        .inOrder();
    assertThat(Proto3SparseEnum.values())
        .asList()
        .containsExactly(
            Proto3SparseEnum.SPARSE_DEFAULT,
            Proto3SparseEnum.SPARSE_TEN,
            Proto3SparseEnum.SPARSE_TWENTY,
            Proto3SparseEnum.UNRECOGNIZED)
        .inOrder();
    // Note that native enums doesn't provide values() method.
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

    assertThat(Proto3TestEnum.DEFAULT.getNumber()).isEqualTo(0);
    assertThat(Proto3TestEnum.ONE.getNumber()).isEqualTo(1);
    assertThat(Proto3TestEnum.TWO.getNumber()).isEqualTo(2);
    assertThrows(IllegalArgumentException.class, Proto3TestEnum.UNRECOGNIZED::getNumber);

    assertThat(Proto3SparseEnum.SPARSE_DEFAULT.getNumber()).isEqualTo(0);
    assertThat(Proto3SparseEnum.SPARSE_TEN.getNumber()).isEqualTo(10);
    assertThat(Proto3SparseEnum.SPARSE_TWENTY.getNumber()).isEqualTo(20);
    assertThrows(IllegalArgumentException.class, Proto3SparseEnum.UNRECOGNIZED::getNumber);

    // There is no UNRECOGNIZED value even for proto3 native enums
    assertThat(Proto3NativeEnum.NATIVE_DEFAULT.getNumber()).isEqualTo(0);
    assertThat(Proto3NativeEnum.NATIVE_ONE.getNumber()).isEqualTo(1);
    assertThat(Proto3NativeEnum.NATIVE_TWO.getNumber()).isEqualTo(2);
  }

  @Test
  public void testForNumber() {
    assertThat(TestEnum.forNumber(0)).isEqualTo(TestEnum.DEFAULT);
    assertThat(TestEnum.forNumber(1)).isEqualTo(TestEnum.ONE);
    assertThat(TestEnum.forNumber(2)).isEqualTo(TestEnum.TWO);
    assertThat(TestEnum.forNumber(3)).isEqualTo(TestEnum.THREE);

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

    assertThat(Proto3TestEnum.forNumber(0)).isEqualTo(Proto3TestEnum.DEFAULT);
    assertThat(Proto3TestEnum.forNumber(1)).isEqualTo(Proto3TestEnum.ONE);
    assertThat(Proto3TestEnum.forNumber(2)).isEqualTo(Proto3TestEnum.TWO);
    assertThat(Proto3TestEnum.forNumber(3)).isEqualTo(Proto3TestEnum.THREE);

    assertThat(Proto3SparseEnum.forNumber(0)).isEqualTo(Proto3SparseEnum.SPARSE_DEFAULT);
    assertThat(Proto3SparseEnum.forNumber(10)).isEqualTo(Proto3SparseEnum.SPARSE_TEN);
    assertThat(Proto3SparseEnum.forNumber(20)).isEqualTo(Proto3SparseEnum.SPARSE_TWENTY);

    assertThat(Proto3NativeEnum.forNumber(0)).isEqualTo(Proto3NativeEnum.NATIVE_DEFAULT);
    assertThat(Proto3NativeEnum.forNumber(1)).isEqualTo(Proto3NativeEnum.NATIVE_ONE);
    assertThat(Proto3NativeEnum.forNumber(2)).isEqualTo(Proto3NativeEnum.NATIVE_TWO);
  }

  @Test
  public void testForNumberWithUnknownValue() {
    assertThat(TestEnum.forNumber(-1)).isNull();
    assertThat(TestEnum.forNumber(4)).isNull();
    assertThat(TestEnum.forNumber(100)).isNull();

    // assertThat(SparseEnum.forNumber(-1)).isNull();
    assertThat(SparseEnum.forNumber(4)).isNull();
    assertThat(SparseEnum.forNumber(100)).isNull();

    assertThat(Aliased.TestEnum.forNumber(-1)).isNull();
    assertThat(Aliased.TestEnum.forNumber(100)).isNull();

    assertThat(Proto3TestEnum.forNumber(-1)).isNull();
    assertThat(Proto3TestEnum.forNumber(4)).isNull();
    assertThat(Proto3TestEnum.forNumber(100)).isNull();

    // assertThat(Proto3SparseEnum.forNumber(-1)).isNull();
    assertThat(Proto3SparseEnum.forNumber(4)).isNull();
    assertThat(Proto3SparseEnum.forNumber(100)).isNull();

    // Unknown values with native enums are tested in EnumNativeForNumberTest since the behavior
    // differs between J2CL and JVM.
  }
}
