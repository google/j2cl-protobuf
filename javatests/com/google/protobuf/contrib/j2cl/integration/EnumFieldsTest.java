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
import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto.TestEnum;
import com.google.protobuf.contrib.j2cl.protos.EnumAlias.EnumWithAliases;
import com.google.protobuf.contrib.j2cl.protos.EnumAlias.NativeEnumWithAliases;
import com.google.protobuf.contrib.j2cl.protos.NativeEnum.MainMessage;
import com.google.protobuf.contrib.j2cl.protos.NativeEnum.TopLevelNativeEnum;
import java.util.Arrays;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class EnumFieldsTest {

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().hasOptionalEnum()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalEnum()).isEqualTo(TestEnum.UNKNOWN);
  }

  @Test
  public void testOptionalFieldNoDefault_defaultInstanceNativeEnum() {
    assertThat(MainMessage.getDefaultInstance().hasTopLevelNativeEnum()).isFalse();
    assertThat(MainMessage.getDefaultInstance().getTopLevelNativeEnum())
        .isEqualTo(TopLevelNativeEnum.UNKNOWN);
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalEnum(TestEnum.TWO);
    assertThat(builder.hasOptionalEnum()).isTrue();
    assertThat(builder.getOptionalEnum()).isEqualTo(TestEnum.TWO);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalEnum()).isTrue();
    assertThat(proto.getOptionalEnum()).isEqualTo(TestEnum.TWO);
  }

  @Test
  public void testOptionalFieldNoDefault_setValueNativeEnum() {
    MainMessage.Builder builder =
        MainMessage.newBuilder().setTopLevelNativeEnum(TopLevelNativeEnum.TWO);
    assertThat(builder.hasTopLevelNativeEnum()).isTrue();
    assertThat(builder.getTopLevelNativeEnum()).isEqualTo(TopLevelNativeEnum.TWO);

    MainMessage proto = builder.build();
    assertThat(proto.hasTopLevelNativeEnum()).isTrue();
    assertThat(proto.getTopLevelNativeEnum()).isEqualTo(TopLevelNativeEnum.TWO);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalEnum(TestEnum.TWO).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalEnum();
    assertThat(builder.hasOptionalEnum()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalEnum()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_clearNativeEnum() {
    MainMessage startProto =
        MainMessage.newBuilder().setTopLevelNativeEnum(TopLevelNativeEnum.TWO).build();

    MainMessage.Builder builder = startProto.toBuilder();
    builder.clearTopLevelNativeEnum();
    assertThat(builder.hasTopLevelNativeEnum()).isFalse();

    MainMessage proto = builder.build();
    assertThat(proto.hasTopLevelNativeEnum()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().hasOptionalEnum()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalEnumWithDefault())
        .isEqualTo(TestEnum.THREE);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalEnumWithDefault(TestEnum.TWO);
    assertThat(builder.hasOptionalEnumWithDefault()).isTrue();
    assertThat(builder.getOptionalEnumWithDefault()).isEqualTo(TestEnum.TWO);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalEnumWithDefault()).isTrue();
    assertThat(proto.getOptionalEnumWithDefault()).isEqualTo(TestEnum.TWO);
  }

  @Test
  public void testOptionalFieldWithDefault_setValueNativeEnum() {
    MainMessage.Builder builder =
        MainMessage.newBuilder().setTopLevelNativeEnum(TopLevelNativeEnum.TWO);
    assertThat(builder.hasTopLevelNativeEnum()).isTrue();
    assertThat(builder.getTopLevelNativeEnum()).isEqualTo(TopLevelNativeEnum.TWO);

    MainMessage proto = builder.build();
    assertThat(proto.hasTopLevelNativeEnum()).isTrue();
    assertThat(proto.getTopLevelNativeEnum()).isEqualTo(TopLevelNativeEnum.TWO);
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalEnumWithDefault(TestEnum.THREE);
    assertThat(builder.hasOptionalEnumWithDefault()).isTrue();
    assertThat(builder.getOptionalEnumWithDefault()).isEqualTo(TestEnum.THREE);

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalEnumWithDefault()).isTrue();
    assertThat(proto.getOptionalEnumWithDefault()).isEqualTo(TestEnum.THREE);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedEnumCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedEnumCount()).isEqualTo(0);
    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedEnum(0));
  }

  @Test
  public void testRepeatedField_defaultInstanceNativeEnum() {
    assertThat(MainMessage.getDefaultInstance().getRepeatedTopLevelNativeEnumCount()).isEqualTo(0);
    assertThat(MainMessage.newBuilder().build().getRepeatedTopLevelNativeEnumCount()).isEqualTo(0);
    assertThrows(
        Exception.class, () -> MainMessage.newBuilder().build().getRepeatedTopLevelNativeEnum(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedEnum(TestEnum.TWO).addRepeatedEnum(TestEnum.FIVE);

    assertThat(Arrays.asList(TestEnum.TWO, TestEnum.FIVE))
        .containsExactlyElementsIn(builder.getRepeatedEnumList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(TestEnum.TWO, TestEnum.FIVE))
        .containsExactlyElementsIn(proto.getRepeatedEnumList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addNativeEnum() {
    MainMessage.Builder builder =
        MainMessage.newBuilder()
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.FIVE);

    assertThat(Arrays.asList(TopLevelNativeEnum.TWO, TopLevelNativeEnum.FIVE))
        .containsExactlyElementsIn(builder.getRepeatedTopLevelNativeEnumList())
        .inOrder();

    MainMessage proto = builder.build();
    assertThat(Arrays.asList(TopLevelNativeEnum.TWO, TopLevelNativeEnum.FIVE))
        .containsExactlyElementsIn(proto.getRepeatedTopLevelNativeEnumList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder().addRepeatedEnum(TestEnum.TWO).addRepeatedEnum(TestEnum.FIVE).build();

    TestProto.Builder builder =
        startProto
            .toBuilder()
            .addAllRepeatedEnum(Arrays.asList(TestEnum.ONE, TestEnum.TWO, TestEnum.THREE));
    assertThat(
            Arrays.asList(TestEnum.TWO, TestEnum.FIVE, TestEnum.ONE, TestEnum.TWO, TestEnum.THREE))
        .containsExactlyElementsIn(builder.getRepeatedEnumList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(
            Arrays.asList(TestEnum.TWO, TestEnum.FIVE, TestEnum.ONE, TestEnum.TWO, TestEnum.THREE))
        .containsExactlyElementsIn(proto.getRepeatedEnumList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAllNativeEnum() {
    MainMessage startProto =
        MainMessage.newBuilder()
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.FIVE)
            .build();

    MainMessage.Builder builder =
        startProto
            .toBuilder()
            .addAllRepeatedTopLevelNativeEnum(
                Arrays.asList(
                    TopLevelNativeEnum.ONE, TopLevelNativeEnum.TWO, TopLevelNativeEnum.THREE));
    assertThat(
            Arrays.asList(
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.FIVE,
                TopLevelNativeEnum.ONE,
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.THREE))
        .containsExactlyElementsIn(builder.getRepeatedTopLevelNativeEnumList())
        .inOrder();

    MainMessage proto = builder.build();
    assertThat(
            Arrays.asList(
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.FIVE,
                TopLevelNativeEnum.ONE,
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.THREE))
        .containsExactlyElementsIn(proto.getRepeatedTopLevelNativeEnumList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.FIVE)
            .addRepeatedEnum(TestEnum.ONE)
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .build();

    TestProto.Builder builder = startProto.toBuilder().setRepeatedEnum(2, TestEnum.SIX);
    assertThat(
            Arrays.asList(TestEnum.TWO, TestEnum.FIVE, TestEnum.SIX, TestEnum.TWO, TestEnum.THREE))
        .containsExactlyElementsIn(builder.getRepeatedEnumList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(
            Arrays.asList(TestEnum.TWO, TestEnum.FIVE, TestEnum.SIX, TestEnum.TWO, TestEnum.THREE))
        .containsExactlyElementsIn(proto.getRepeatedEnumList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_setNativeEnum() {
    MainMessage startProto =
        MainMessage.newBuilder()
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.FIVE)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.ONE)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.THREE)
            .build();

    MainMessage.Builder builder =
        startProto.toBuilder().setRepeatedTopLevelNativeEnum(2, TopLevelNativeEnum.SIX);
    assertThat(
            Arrays.asList(
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.FIVE,
                TopLevelNativeEnum.SIX,
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.THREE))
        .containsExactlyElementsIn(builder.getRepeatedTopLevelNativeEnumList())
        .inOrder();

    MainMessage proto = builder.build();
    assertThat(
            Arrays.asList(
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.FIVE,
                TopLevelNativeEnum.SIX,
                TopLevelNativeEnum.TWO,
                TopLevelNativeEnum.THREE))
        .containsExactlyElementsIn(proto.getRepeatedTopLevelNativeEnumList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.FIVE)
            .addRepeatedEnum(TestEnum.ONE)
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE);

    assertThat(builder.getRepeatedEnumCount()).isEqualTo(5);
    assertThat(builder.getRepeatedEnum(0)).isEqualTo(TestEnum.TWO);
    assertThat(builder.getRepeatedEnum(1)).isEqualTo(TestEnum.FIVE);
    assertThat(builder.getRepeatedEnum(2)).isEqualTo(TestEnum.ONE);
    assertThat(builder.getRepeatedEnum(3)).isEqualTo(TestEnum.TWO);
    assertThat(builder.getRepeatedEnum(4)).isEqualTo(TestEnum.THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedEnum(5));
    } else {
      assertThat(builder.getRepeatedEnum(5)).isEqualTo(TestEnum.UNKNOWN);
    }

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumCount()).isEqualTo(5);
    assertThat(proto.getRepeatedEnum(0)).isEqualTo(TestEnum.TWO);
    assertThat(proto.getRepeatedEnum(1)).isEqualTo(TestEnum.FIVE);
    assertThat(proto.getRepeatedEnum(2)).isEqualTo(TestEnum.ONE);
    assertThat(proto.getRepeatedEnum(3)).isEqualTo(TestEnum.TWO);
    assertThat(proto.getRepeatedEnum(4)).isEqualTo(TestEnum.THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedEnum(5));
    } else {
      assertThat(proto.getRepeatedEnum(5)).isEqualTo(TestEnum.UNKNOWN);
    }
  }

  @Test
  public void testRepeatedField_getAndCountNativeEnum() {
    MainMessage.Builder builder =
        MainMessage.newBuilder()
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.FIVE)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.ONE)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.THREE);

    assertThat(builder.getRepeatedTopLevelNativeEnumCount()).isEqualTo(5);
    assertThat(builder.getRepeatedTopLevelNativeEnum(0)).isEqualTo(TopLevelNativeEnum.TWO);
    assertThat(builder.getRepeatedTopLevelNativeEnum(1)).isEqualTo(TopLevelNativeEnum.FIVE);
    assertThat(builder.getRepeatedTopLevelNativeEnum(2)).isEqualTo(TopLevelNativeEnum.ONE);
    assertThat(builder.getRepeatedTopLevelNativeEnum(3)).isEqualTo(TopLevelNativeEnum.TWO);
    assertThat(builder.getRepeatedTopLevelNativeEnum(4)).isEqualTo(TopLevelNativeEnum.THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedTopLevelNativeEnum(5));
    } else {
      assertThat(builder.getRepeatedTopLevelNativeEnum(5)).isEqualTo(TopLevelNativeEnum.UNKNOWN);
    }

    MainMessage proto = builder.build();
    assertThat(proto.getRepeatedTopLevelNativeEnumCount()).isEqualTo(5);
    assertThat(proto.getRepeatedTopLevelNativeEnum(0)).isEqualTo(TopLevelNativeEnum.TWO);
    assertThat(proto.getRepeatedTopLevelNativeEnum(1)).isEqualTo(TopLevelNativeEnum.FIVE);
    assertThat(proto.getRepeatedTopLevelNativeEnum(2)).isEqualTo(TopLevelNativeEnum.ONE);
    assertThat(proto.getRepeatedTopLevelNativeEnum(3)).isEqualTo(TopLevelNativeEnum.TWO);
    assertThat(proto.getRepeatedTopLevelNativeEnum(4)).isEqualTo(TopLevelNativeEnum.THREE);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedTopLevelNativeEnum(5));
    } else {
      assertThat(proto.getRepeatedTopLevelNativeEnum(5)).isEqualTo(TopLevelNativeEnum.UNKNOWN);
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.FIVE)
            .addRepeatedEnum(TestEnum.ONE)
            .addRepeatedEnum(TestEnum.TWO)
            .addRepeatedEnum(TestEnum.THREE)
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedEnum();
    assertThat(builder.getRepeatedEnumCount()).isEqualTo(0);
    assertThat(builder.getRepeatedEnumList()).isEmpty();

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedEnumCount()).isEqualTo(0);
    assertThat(proto.getRepeatedEnumCount()).isEqualTo(0);
  }

  @Test
  public void testRepeatedField_clearNativeEnum() {
    MainMessage startProto =
        MainMessage.newBuilder()
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.FIVE)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.ONE)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.TWO)
            .addRepeatedTopLevelNativeEnum(TopLevelNativeEnum.THREE)
            .build();

    MainMessage.Builder builder = startProto.toBuilder().clearRepeatedTopLevelNativeEnum();
    assertThat(builder.getRepeatedTopLevelNativeEnumCount()).isEqualTo(0);
    assertThat(builder.getRepeatedTopLevelNativeEnumList()).isEmpty();

    MainMessage proto = builder.build();
    assertThat(proto.getRepeatedTopLevelNativeEnumCount()).isEqualTo(0);
    assertThat(proto.getRepeatedTopLevelNativeEnumCount()).isEqualTo(0);
  }

  @Test
  public void testAliasing() throws Exception {
    assertThat(EnumWithAliases.ORIGINAL).isEqualTo(EnumWithAliases.forNumber(1));
    assertThat(EnumWithAliases.ORIGINAL)
        .isEqualTo(EnumWithAliases.forNumber(EnumWithAliases.ALIAS.getNumber()));

    assertThat(NativeEnumWithAliases.NATIVE_ORIGINAL).isEqualTo(NativeEnumWithAliases.forNumber(1));
    assertThat(NativeEnumWithAliases.NATIVE_ORIGINAL)
        .isEqualTo(NativeEnumWithAliases.forNumber(NativeEnumWithAliases.NATIVE_ALIAS.getNumber()));
  }

  @Test
  public void testForNumberWithUnknownValue() {
    // Note that enum field getter with unknown value is tested EnumGenerationTest. Unlike that
    // class this is tested both in J2CL and JVM and ensures consistent forNumber behavior.
    assertThat(TestProto.TestEnum.forNumber(100)).isNull();
  }
}
