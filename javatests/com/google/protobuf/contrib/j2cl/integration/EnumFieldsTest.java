package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

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
    assertFalse(TestProto.newBuilder().build().hasOptionalEnum());
    assertEquals(TestEnum.UNKNOWN, TestProto.newBuilder().build().getOptionalEnum());
  }

  @Test
  public void testOptionalFieldNoDefault_defaultInstanceNativeEnum() {
    assertFalse(MainMessage.newBuilder().build().hasTopLevelNativeEnum());
    assertEquals(
        TopLevelNativeEnum.UNKNOWN, MainMessage.newBuilder().build().getTopLevelNativeEnum());
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalEnum(TestEnum.TWO);
    assertTrue(builder.hasOptionalEnum());
    assertEquals(TestEnum.TWO, builder.getOptionalEnum());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalEnum());
    assertEquals(TestEnum.TWO, proto.getOptionalEnum());
  }

  @Test
  public void testOptionalFieldNoDefault_setValueNativeEnum() {
    MainMessage.Builder builder =
        MainMessage.newBuilder().setTopLevelNativeEnum(TopLevelNativeEnum.TWO);
    assertTrue(builder.hasTopLevelNativeEnum());
    assertEquals(TopLevelNativeEnum.TWO, builder.getTopLevelNativeEnum());

    MainMessage proto = builder.build();
    assertTrue(proto.hasTopLevelNativeEnum());
    assertEquals(TopLevelNativeEnum.TWO, proto.getTopLevelNativeEnum());
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalEnum(TestEnum.TWO).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalEnum();
    assertFalse(builder.hasOptionalEnum());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalEnum());
  }

  @Test
  public void testOptionalFieldNoDefault_clearNativeEnum() {
    MainMessage startProto =
        MainMessage.newBuilder().setTopLevelNativeEnum(TopLevelNativeEnum.TWO).build();

    MainMessage.Builder builder = startProto.toBuilder();
    builder.clearTopLevelNativeEnum();
    assertFalse(builder.hasTopLevelNativeEnum());

    MainMessage proto = builder.build();
    assertFalse(proto.hasTopLevelNativeEnum());
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertFalse(TestProto.newBuilder().build().hasOptionalEnum());
    assertEquals(TestEnum.THREE, TestProto.newBuilder().build().getOptionalEnumWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalEnumWithDefault(TestEnum.TWO);
    assertTrue(builder.hasOptionalEnumWithDefault());
    assertEquals(TestEnum.TWO, builder.getOptionalEnumWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalEnumWithDefault());
    assertEquals(TestEnum.TWO, proto.getOptionalEnumWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setValueNativeEnum() {
    MainMessage.Builder builder =
        MainMessage.newBuilder().setTopLevelNativeEnum(TopLevelNativeEnum.TWO);
    assertTrue(builder.hasTopLevelNativeEnum());
    assertEquals(TopLevelNativeEnum.TWO, builder.getTopLevelNativeEnum());

    MainMessage proto = builder.build();
    assertTrue(proto.hasTopLevelNativeEnum());
    assertEquals(TopLevelNativeEnum.TWO, proto.getTopLevelNativeEnum());
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalEnumWithDefault(TestEnum.THREE);
    assertTrue(builder.hasOptionalEnumWithDefault());
    assertEquals(TestEnum.THREE, builder.getOptionalEnumWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalEnumWithDefault());
    assertEquals(TestEnum.THREE, proto.getOptionalEnumWithDefault());
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedEnumCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedEnumList().size());
    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedEnum(0));
  }

  @Test
  public void testRepeatedField_defaultInstanceNativeEnum() {
    assertEquals(0, MainMessage.newBuilder().build().getRepeatedTopLevelNativeEnumCount());
    assertEquals(0, MainMessage.newBuilder().build().getRepeatedTopLevelNativeEnumList().size());
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

    assertEquals(5, builder.getRepeatedEnumCount());
    assertEquals(TestEnum.TWO, builder.getRepeatedEnum(0));
    assertEquals(TestEnum.FIVE, builder.getRepeatedEnum(1));
    assertEquals(TestEnum.ONE, builder.getRepeatedEnum(2));
    assertEquals(TestEnum.TWO, builder.getRepeatedEnum(3));
    assertEquals(TestEnum.THREE, builder.getRepeatedEnum(4));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedEnum(5));
    } else {
      assertEquals(TestEnum.UNKNOWN, builder.getRepeatedEnum(5));
    }

    TestProto proto = builder.build();
    assertEquals(5, proto.getRepeatedEnumCount());
    assertEquals(TestEnum.TWO, proto.getRepeatedEnum(0));
    assertEquals(TestEnum.FIVE, proto.getRepeatedEnum(1));
    assertEquals(TestEnum.ONE, proto.getRepeatedEnum(2));
    assertEquals(TestEnum.TWO, proto.getRepeatedEnum(3));
    assertEquals(TestEnum.THREE, proto.getRepeatedEnum(4));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedEnum(5));
    } else {
      assertEquals(TestEnum.UNKNOWN, proto.getRepeatedEnum(5));
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

    assertEquals(5, builder.getRepeatedTopLevelNativeEnumCount());
    assertEquals(TopLevelNativeEnum.TWO, builder.getRepeatedTopLevelNativeEnum(0));
    assertEquals(TopLevelNativeEnum.FIVE, builder.getRepeatedTopLevelNativeEnum(1));
    assertEquals(TopLevelNativeEnum.ONE, builder.getRepeatedTopLevelNativeEnum(2));
    assertEquals(TopLevelNativeEnum.TWO, builder.getRepeatedTopLevelNativeEnum(3));
    assertEquals(TopLevelNativeEnum.THREE, builder.getRepeatedTopLevelNativeEnum(4));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedTopLevelNativeEnum(5));
    } else {
      assertEquals(TopLevelNativeEnum.UNKNOWN, builder.getRepeatedTopLevelNativeEnum(5));
    }

    MainMessage proto = builder.build();
    assertEquals(5, proto.getRepeatedTopLevelNativeEnumCount());
    assertEquals(TopLevelNativeEnum.TWO, proto.getRepeatedTopLevelNativeEnum(0));
    assertEquals(TopLevelNativeEnum.FIVE, proto.getRepeatedTopLevelNativeEnum(1));
    assertEquals(TopLevelNativeEnum.ONE, proto.getRepeatedTopLevelNativeEnum(2));
    assertEquals(TopLevelNativeEnum.TWO, proto.getRepeatedTopLevelNativeEnum(3));
    assertEquals(TopLevelNativeEnum.THREE, proto.getRepeatedTopLevelNativeEnum(4));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedTopLevelNativeEnum(5));
    } else {
      assertEquals(TopLevelNativeEnum.UNKNOWN, proto.getRepeatedTopLevelNativeEnum(5));
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
    assertEquals(0, builder.getRepeatedEnumCount());
    assertEquals(0, builder.getRepeatedEnumList().size());

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedEnumCount());
    assertEquals(0, proto.getRepeatedEnumList().size());
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
    assertEquals(0, builder.getRepeatedTopLevelNativeEnumCount());
    assertEquals(0, builder.getRepeatedTopLevelNativeEnumList().size());

    MainMessage proto = builder.build();
    assertEquals(0, proto.getRepeatedTopLevelNativeEnumCount());
    assertEquals(0, proto.getRepeatedTopLevelNativeEnumList().size());
  }

  @Test
  public void testAliasing() throws Exception {
    assertEquals(EnumWithAliases.ORIGINAL, EnumWithAliases.forNumber(1));
    assertEquals(
        EnumWithAliases.ORIGINAL, EnumWithAliases.forNumber(EnumWithAliases.ALIAS.getNumber()));

    assertEquals(NativeEnumWithAliases.NATIVE_ORIGINAL, NativeEnumWithAliases.forNumber(1));
    assertEquals(
        NativeEnumWithAliases.NATIVE_ORIGINAL,
        NativeEnumWithAliases.forNumber(NativeEnumWithAliases.NATIVE_ALIAS.getNumber()));
  }

  @Test
  public void testForNumberWithUnknownValue() {
    // Note that enum field getter with unknown value is tested EnumGenerationTest. Unlike that
    // class this is tested both in J2CL and JVM and ensures consistent forNumber behavior.
    assertNull(TestProto.TestEnum.forNumber(100));
  }
}
