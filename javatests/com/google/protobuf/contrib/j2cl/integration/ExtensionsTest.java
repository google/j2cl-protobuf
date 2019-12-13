package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

import com.google.protobuf.ByteString;
import com.google.protobuf.ExtensionLite;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Base;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Primitives;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Recursive;
import com.google.protobuf.contrib.j2cl.protos.Extensions.TestEnum;
import com.google.protobuf.contrib.j2cl.protos.NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.NativeEnum.MainMessage;
import com.google.protobuf.contrib.j2cl.protos.NativeEnum.TopLevelNativeEnum;
import java.util.Arrays;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class ExtensionsTest {

  @Test
  public void testSingleBooleanExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleBoolExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleBoolExtension));
    assertFalse(baseBuilder.getExtension(Primitives.singleBoolExtension));
    assertFalse(baseBuilder.build().getExtension(Primitives.singleBoolExtension));

    baseBuilder.setExtension(Primitives.singleBoolExtension, true);
    assertTrue(baseBuilder.hasExtension(Primitives.singleBoolExtension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleBoolExtension));

    assertTrue(baseBuilder.getExtension(Primitives.singleBoolExtension));
    assertTrue(baseBuilder.build().getExtension(Primitives.singleBoolExtension));
  }

  @Test
  public void testSingleBooleanExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleBoolExtension, true);

    baseBuilder.clearExtension(Primitives.singleBoolExtension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleBoolExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleBoolExtension));
  }

  @Test
  public void testRepeatedBooleanExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedBoolExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedBoolExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedBoolExtension, Arrays.asList(true, true));
    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedBoolExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedBoolExtension))
        .containsExactly(true, true);
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension))
        .containsExactly(true, true);
  }

  @Test
  public void testRepeatedBooleanExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.getExtension(Primitives.repeatedBoolExtension, 0));
    }

    baseBuilder.setExtension(Primitives.repeatedBoolExtension, Arrays.asList(true, false));

    assertTrue(baseBuilder.getExtension(Primitives.repeatedBoolExtension, 0));
    assertTrue(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension, 0));
    assertFalse(baseBuilder.getExtension(Primitives.repeatedBoolExtension, 1));
    assertFalse(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension, 1));
  }

  @Test
  public void testRepeatedBooleanExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.setExtension(Primitives.repeatedBoolExtension, 2, true));
    }

    baseBuilder.setExtension(Primitives.repeatedBoolExtension, Arrays.asList(true, false));

    baseBuilder.setExtension(Primitives.repeatedBoolExtension, 0, false);
    baseBuilder.setExtension(Primitives.repeatedBoolExtension, 1, true);

    assertThat(baseBuilder.getExtension(Primitives.repeatedBoolExtension))
        .containsExactly(false, true)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension))
        .containsExactly(false, true)
        .inOrder();
  }

  @Test
  public void testRepeatedBooleanExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Primitives.repeatedBoolExtension, Arrays.asList(true, false));

    baseBuilder.addExtension(Primitives.repeatedBoolExtension, true);
    baseBuilder.addExtension(Primitives.repeatedBoolExtension, false);

    assertThat(baseBuilder.getExtension(Primitives.repeatedBoolExtension))
        .containsExactly(true, false, true, false)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension))
        .containsExactly(true, false, true, false)
        .inOrder();
  }

  @Test
  public void testRepeatedBooleanExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.repeatedBoolExtension, Arrays.asList(true, false));

    baseBuilder.clearExtension(Primitives.repeatedBoolExtension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedBoolExtension));
  }

  @Test
  public void testSingleByteStringExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleByteStringExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleByteStringExtension));
    assertEquals(ByteString.EMPTY, baseBuilder.getExtension(Primitives.singleByteStringExtension));
    assertEquals(
        ByteString.EMPTY, baseBuilder.build().getExtension(Primitives.singleByteStringExtension));

    baseBuilder.setExtension(Primitives.singleByteStringExtension, bs(1));
    assertTrue(baseBuilder.hasExtension(Primitives.singleByteStringExtension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleByteStringExtension));

    assertEquals(bs(1), baseBuilder.getExtension(Primitives.singleByteStringExtension));
    assertEquals(bs(1), baseBuilder.build().getExtension(Primitives.singleByteStringExtension));
  }

  @Test
  public void testSingleByteStringExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.singleByteStringExtension, ByteString.copyFrom(new byte[] {1}));

    baseBuilder.clearExtension(Primitives.singleByteStringExtension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleByteStringExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleByteStringExtension));
  }

  @Test
  public void testRepeatedByteStringExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedByteStringExtension));
    assertThat(baseBuilder.getExtension(Primitives.repeatedByteStringExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, Arrays.asList(bs(1), bs(2)));
    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedByteStringExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedByteStringExtension))
        .containsExactly(bs(1), bs(2))
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension))
        .containsExactly(bs(1), bs(2))
        .inOrder();
  }

  @Test
  public void testRepeatedByteStringExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.getExtension(Primitives.repeatedByteStringExtension, 0));
    }

    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, Arrays.asList(bs(1), bs(2)));

    assertEquals(bs(1), baseBuilder.getExtension(Primitives.repeatedByteStringExtension, 0));
    assertEquals(
        bs(1), baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension, 0));
    assertEquals(bs(2), baseBuilder.getExtension(Primitives.repeatedByteStringExtension, 1));
    assertEquals(
        bs(2), baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension, 1));
  }

  @Test
  public void testRepeatedByteStringExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.setExtension(Primitives.repeatedByteStringExtension, 2, bs(1)));
    }

    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, Arrays.asList(bs(1), bs(2)));

    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, 0, bs(3));
    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, 1, bs(4));

    assertThat(baseBuilder.getExtension(Primitives.repeatedByteStringExtension))
        .containsExactly(bs(3), bs(4))
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension))
        .containsExactly(bs(3), bs(4))
        .inOrder();
  }

  @Test
  public void testRepeatedByteStringExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, Arrays.asList(bs(1), bs(2)));

    baseBuilder.addExtension(Primitives.repeatedByteStringExtension, bs(3));
    baseBuilder.addExtension(Primitives.repeatedByteStringExtension, bs(4));

    assertThat(baseBuilder.getExtension(Primitives.repeatedByteStringExtension))
        .containsExactly(bs(1), bs(2), bs(3), bs(4))
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension))
        .containsExactly(bs(1), bs(2), bs(3), bs(4))
        .inOrder();
  }

  @Test
  public void testRepeatedByteStringExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, Arrays.asList(bs(1), bs(2)));

    baseBuilder.clearExtension(Primitives.repeatedByteStringExtension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedByteStringExtension));
  }

  @Test
  public void testSingleDoubleExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleDoubleExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleDoubleExtension));
    assertEquals(0d, baseBuilder.getExtension(Primitives.singleDoubleExtension), 0.0001d);
    assertEquals(0d, baseBuilder.build().getExtension(Primitives.singleDoubleExtension), 0.0001d);

    baseBuilder.setExtension(Primitives.singleDoubleExtension, 1d);
    assertTrue(baseBuilder.hasExtension(Primitives.singleDoubleExtension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleDoubleExtension));

    assertEquals(1d, baseBuilder.getExtension(Primitives.singleDoubleExtension), 0.0001d);
    assertEquals(1d, baseBuilder.build().getExtension(Primitives.singleDoubleExtension), 0.0001d);
  }

  @Test
  public void testSingleDoubleExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleDoubleExtension, 1d);

    baseBuilder.clearExtension(Primitives.singleDoubleExtension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleDoubleExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleDoubleExtension));
  }

  @Test
  public void testRepeatedDoubleExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedDoubleExtension));
    assertThat(baseBuilder.getExtension(Primitives.repeatedDoubleExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, Arrays.asList(1d, 2d));
    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedDoubleExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedDoubleExtension))
        .containsExactly(1d, 2d)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension))
        .containsExactly(1d, 2d)
        .inOrder();
  }

  @Test
  public void testRepeatedDoubleExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.getExtension(Primitives.repeatedDoubleExtension, 0));
    }

    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, Arrays.asList(1d, 2d));

    assertEquals(1d, baseBuilder.getExtension(Primitives.repeatedDoubleExtension, 0), 0.0001d);
    assertEquals(
        1d, baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension, 0), 0.0001d);
    assertEquals(2d, baseBuilder.getExtension(Primitives.repeatedDoubleExtension, 1), 0.0001d);
    assertEquals(
        2d, baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension, 1), 0.0001d);
  }

  @Test
  public void testRepeatedDoubleExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.setExtension(Primitives.repeatedDoubleExtension, 2, 1d));
    }

    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, Arrays.asList(1d, 2d));

    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, 0, 3d);
    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, 1, 4d);

    assertThat(baseBuilder.getExtension(Primitives.repeatedDoubleExtension))
        .containsExactly(3d, 4d)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension))
        .containsExactly(3d, 4d)
        .inOrder();
  }

  @Test
  public void testRepeatedDoubleExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, Arrays.asList(1d, 2d));

    baseBuilder.addExtension(Primitives.repeatedDoubleExtension, 3d);
    baseBuilder.addExtension(Primitives.repeatedDoubleExtension, 4d);

    assertThat(baseBuilder.getExtension(Primitives.repeatedDoubleExtension))
        .containsExactly(1d, 2d, 3d, 4d)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension))
        .containsExactly(1d, 2d, 3d, 4d)
        .inOrder();
  }

  @Test
  public void testRepeatedDoubleExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, Arrays.asList(1d, 2d));

    baseBuilder.clearExtension(Primitives.repeatedDoubleExtension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedDoubleExtension));
  }

  @Test
  public void testSingleEnumExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleEnumExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleEnumExtension));
    assertEquals(TestEnum.DEFAULT, baseBuilder.getExtension(Primitives.singleEnumExtension));
    assertEquals(
        TestEnum.DEFAULT, baseBuilder.build().getExtension(Primitives.singleEnumExtension));

    baseBuilder.setExtension(Primitives.singleEnumExtension, TestEnum.GREEN);
    assertTrue(baseBuilder.hasExtension(Primitives.singleEnumExtension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleEnumExtension));

    assertEquals(TestEnum.GREEN, baseBuilder.getExtension(Primitives.singleEnumExtension));
    assertEquals(TestEnum.GREEN, baseBuilder.build().getExtension(Primitives.singleEnumExtension));
  }

  @Test
  public void testSingleEnumExtension_get_hasExtensionNativeEnum() {
    MainMessage.Builder baseBuilder = MainMessage.newBuilder();
    assertFalse(baseBuilder.hasExtension(NativeEnum.topLevelNativeEnum));
    assertFalse(baseBuilder.build().hasExtension(NativeEnum.topLevelNativeEnum));
    assertEquals(
        TopLevelNativeEnum.UNKNOWN, baseBuilder.getExtension(NativeEnum.topLevelNativeEnum));
    assertEquals(
        TopLevelNativeEnum.UNKNOWN,
        baseBuilder.build().getExtension(NativeEnum.topLevelNativeEnum));

    baseBuilder.setExtension(NativeEnum.topLevelNativeEnum, TopLevelNativeEnum.TWO);
    assertTrue(baseBuilder.hasExtension(NativeEnum.topLevelNativeEnum));
    assertTrue(baseBuilder.build().hasExtension(NativeEnum.topLevelNativeEnum));

    assertEquals(TopLevelNativeEnum.TWO, baseBuilder.getExtension(NativeEnum.topLevelNativeEnum));
    assertEquals(
        TopLevelNativeEnum.TWO, baseBuilder.build().getExtension(NativeEnum.topLevelNativeEnum));
  }

  @Test
  public void testSingleEnumExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleEnumExtension, TestEnum.GREEN);

    baseBuilder.clearExtension(Primitives.singleEnumExtension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleEnumExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleEnumExtension));
  }

  @Test
  public void testSingleEnumExtension_clearNativeEnum() {
    MainMessage.Builder baseBuilder = MainMessage.newBuilder();
    baseBuilder.setExtension(NativeEnum.topLevelNativeEnum, TopLevelNativeEnum.TWO);

    baseBuilder.clearExtension(NativeEnum.topLevelNativeEnum);

    assertFalse(baseBuilder.hasExtension(NativeEnum.topLevelNativeEnum));
    assertFalse(baseBuilder.build().hasExtension(NativeEnum.topLevelNativeEnum));
  }

  @Test
  public void testRepeatedEnumExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedEnumExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedEnumExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedEnumExtension)).isEmpty();

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension, Arrays.asList(TestEnum.GREEN, TestEnum.RED));
    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedEnumExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedEnumExtension))
        .containsExactly(TestEnum.GREEN, TestEnum.RED)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedEnumExtension))
        .containsExactly(TestEnum.GREEN, TestEnum.RED)
        .inOrder();
  }

  @Test
  public void testRepeatedEnumExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.getExtension(Primitives.repeatedEnumExtension, 0));
    }

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension, Arrays.asList(TestEnum.GREEN, TestEnum.RED));

    assertEquals(TestEnum.GREEN, baseBuilder.getExtension(Primitives.repeatedEnumExtension, 0));
    assertEquals(
        TestEnum.GREEN, baseBuilder.build().getExtension(Primitives.repeatedEnumExtension, 0));
    assertEquals(TestEnum.RED, baseBuilder.getExtension(Primitives.repeatedEnumExtension, 1));
    assertEquals(
        TestEnum.RED, baseBuilder.build().getExtension(Primitives.repeatedEnumExtension, 1));
  }

  @Test
  public void testRepeatedEnumExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.setExtension(Primitives.repeatedEnumExtension, 2, TestEnum.GREEN));
    }

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension, Arrays.asList(TestEnum.GREEN, TestEnum.RED));

    baseBuilder.setExtension(Primitives.repeatedEnumExtension, 0, TestEnum.RED);
    baseBuilder.setExtension(Primitives.repeatedEnumExtension, 1, TestEnum.BLUE);

    assertThat(baseBuilder.getExtension(Primitives.repeatedEnumExtension))
        .containsExactly(TestEnum.RED, TestEnum.BLUE)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedEnumExtension))
        .containsExactly(TestEnum.RED, TestEnum.BLUE)
        .inOrder();
  }

  @Test
  public void testRepeatedEnumExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension, Arrays.asList(TestEnum.GREEN, TestEnum.RED));

    baseBuilder.addExtension(Primitives.repeatedEnumExtension, TestEnum.BLUE);
    baseBuilder.addExtension(Primitives.repeatedEnumExtension, TestEnum.GREEN);

    assertThat(baseBuilder.getExtension(Primitives.repeatedEnumExtension))
        .containsExactly(TestEnum.GREEN, TestEnum.RED, TestEnum.BLUE, TestEnum.GREEN)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedEnumExtension))
        .containsExactly(TestEnum.GREEN, TestEnum.RED, TestEnum.BLUE, TestEnum.GREEN)
        .inOrder();
  }

  @Test
  public void testRepeatedEnumExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension, Arrays.asList(TestEnum.GREEN, TestEnum.RED));

    baseBuilder.clearExtension(Primitives.repeatedEnumExtension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedEnumExtension));
  }

  @Test
  public void testSingleFloatExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleFloatExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleFloatExtension));
    assertEquals(0f, (float) baseBuilder.getExtension(Primitives.singleFloatExtension), 0.0001f);
    assertEquals(
        0f, (float) baseBuilder.build().getExtension(Primitives.singleFloatExtension), 0.0001f);

    baseBuilder.setExtension(Primitives.singleFloatExtension, 1f);
    assertTrue(baseBuilder.hasExtension(Primitives.singleFloatExtension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleFloatExtension));

    assertEquals(1f, (float) baseBuilder.getExtension(Primitives.singleFloatExtension), 0.0001f);
    assertEquals(
        1f, (float) baseBuilder.build().getExtension(Primitives.singleFloatExtension), 0.0001f);
  }

  @Test
  public void testSingleFloatExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleFloatExtension, 1f);

    baseBuilder.clearExtension(Primitives.singleFloatExtension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleFloatExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleFloatExtension));
  }

  @Test
  public void testRepeatedFloatExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedFloatExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedFloatExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedFloatExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedFloatExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedFloatExtension, Arrays.asList(1f, 2f));

    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedFloatExtension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedFloatExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedFloatExtension))
        .containsExactly(1f, 2f)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedFloatExtension))
        .containsExactly(1f, 2f)
        .inOrder();
  }

  @Test
  public void testRepeatedFloatExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.getExtension(Primitives.repeatedFloatExtension, 0));
    }

    baseBuilder.setExtension(Primitives.repeatedFloatExtension, Arrays.asList(1f, 2f));

    assertEquals(1f, baseBuilder.getExtension(Primitives.repeatedFloatExtension, 0), 0.0001f);
    assertEquals(
        1f, baseBuilder.build().getExtension(Primitives.repeatedFloatExtension, 0), 0.0001f);
    assertEquals(2f, baseBuilder.getExtension(Primitives.repeatedFloatExtension, 1), 0.0001f);
    assertEquals(
        2f, baseBuilder.build().getExtension(Primitives.repeatedFloatExtension, 1), 0.0001f);
  }

  @Test
  public void testRepeatedFloatExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.setExtension(Primitives.repeatedFloatExtension, 2, 1f));
    }

    baseBuilder.setExtension(Primitives.repeatedFloatExtension, Arrays.asList(1f, 2f));

    baseBuilder.setExtension(Primitives.repeatedFloatExtension, 0, 3f);
    baseBuilder.setExtension(Primitives.repeatedFloatExtension, 1, 4f);

    assertThat(baseBuilder.getExtension(Primitives.repeatedFloatExtension))
        .containsExactly(3f, 4f)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedFloatExtension))
        .containsExactly(3f, 4f)
        .inOrder();
  }

  @Test
  public void testRepeatedFloatExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Primitives.repeatedFloatExtension, Arrays.asList(1f, 2f));

    baseBuilder.addExtension(Primitives.repeatedFloatExtension, 3f);
    baseBuilder.addExtension(Primitives.repeatedFloatExtension, 4f);

    assertThat(baseBuilder.getExtension(Primitives.repeatedFloatExtension))
        .containsExactly(1f, 2f, 3f, 4f)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedFloatExtension))
        .containsExactly(1f, 2f, 3f, 4f)
        .inOrder();
  }

  @Test
  public void testRepeatedFloatExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.repeatedFloatExtension, Arrays.asList(1f, 2f));

    baseBuilder.clearExtension(Primitives.repeatedFloatExtension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedFloatExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedFloatExtension));
  }

  @Test
  public void testSingleIntExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleInt32Extension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleInt32Extension));
    assertEquals(0, (int) baseBuilder.getExtension(Primitives.singleInt32Extension));
    assertEquals(0, (int) baseBuilder.build().getExtension(Primitives.singleInt32Extension));

    baseBuilder.setExtension(Primitives.singleInt32Extension, 1);
    assertTrue(baseBuilder.hasExtension(Primitives.singleInt32Extension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleInt32Extension));

    assertEquals(1, (int) baseBuilder.getExtension(Primitives.singleInt32Extension));
    assertEquals(1, (int) baseBuilder.build().getExtension(Primitives.singleInt32Extension));
  }

  @Test
  public void testSingleIntExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleInt32Extension, 1);

    baseBuilder.clearExtension(Primitives.singleInt32Extension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleInt32Extension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleInt32Extension));
  }

  @Test
  public void testRepeatedIntExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedInt32Extension));
    assertThat(baseBuilder.getExtension(Primitives.repeatedInt32Extension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt32Extension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedInt32Extension, Arrays.asList(1, 2));
    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedInt32Extension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt32Extension))
        .containsExactly(1, 2)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt32Extension))
        .containsExactly(1, 2)
        .inOrder();
  }

  @Test
  public void testRepeatedIntExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.getExtension(Primitives.repeatedInt32Extension, 0));
    }

    baseBuilder.setExtension(Primitives.repeatedInt32Extension, Arrays.asList(1, 2));

    assertEquals(1, (int) baseBuilder.getExtension(Primitives.repeatedInt32Extension, 0));
    assertEquals(1, (int) baseBuilder.build().getExtension(Primitives.repeatedInt32Extension, 0));
    assertEquals(2, (int) baseBuilder.getExtension(Primitives.repeatedInt32Extension, 1));
    assertEquals(2, (int) baseBuilder.build().getExtension(Primitives.repeatedInt32Extension, 1));
  }

  @Test
  public void testRepeatedIntExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.setExtension(Primitives.repeatedInt32Extension, 2, 1));
    }

    baseBuilder.setExtension(Primitives.repeatedInt32Extension, Arrays.asList(1, 2));

    baseBuilder.setExtension(Primitives.repeatedInt32Extension, 0, 3);
    baseBuilder.setExtension(Primitives.repeatedInt32Extension, 1, 4);

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt32Extension))
        .containsExactly(3, 4)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt32Extension))
        .containsExactly(3, 4)
        .inOrder();
  }

  @Test
  public void testRepeatedIntExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Primitives.repeatedInt32Extension, Arrays.asList(1, 2));

    baseBuilder.addExtension(Primitives.repeatedInt32Extension, 3);
    baseBuilder.addExtension(Primitives.repeatedInt32Extension, 4);

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt32Extension))
        .containsExactly(1, 2, 3, 4)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt32Extension))
        .containsExactly(1, 2, 3, 4)
        .inOrder();
  }

  @Test
  public void testRepeatedIntExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.repeatedInt32Extension, Arrays.asList(1, 2));

    baseBuilder.clearExtension(Primitives.repeatedInt32Extension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedInt32Extension));
  }

  @Test
  public void testSingleLongExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleInt64Extension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleInt64Extension));
    assertEquals(0L, (long) baseBuilder.getExtension(Primitives.singleInt64Extension));
    assertEquals(0L, (long) baseBuilder.build().getExtension(Primitives.singleInt64Extension));

    baseBuilder.setExtension(Primitives.singleInt64Extension, 1L);
    assertTrue(baseBuilder.hasExtension(Primitives.singleInt64Extension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleInt64Extension));

    assertEquals(1L, (long) baseBuilder.getExtension(Primitives.singleInt64Extension));
    assertEquals(1L, (long) baseBuilder.build().getExtension(Primitives.singleInt64Extension));
  }

  @Test
  public void testSingleLongExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleInt64Extension, 1L);

    baseBuilder.clearExtension(Primitives.singleInt64Extension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleInt64Extension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleInt64Extension));
  }

  @Test
  public void testRepeatedLongExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedInt64Extension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt64Extension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt64Extension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedInt64Extension, Arrays.asList(1L, 2L));

    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedInt64Extension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt64Extension))
        .containsExactly(1L, 2L)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt64Extension))
        .containsExactly(1L, 2L)
        .inOrder();
  }

  @Test
  public void testRepeatedLongExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.getExtension(Primitives.repeatedInt64Extension, 0));
    }

    baseBuilder.setExtension(Primitives.repeatedInt64Extension, Arrays.asList(1L, 2L));

    assertEquals(1L, (long) baseBuilder.getExtension(Primitives.repeatedInt64Extension, 0));
    assertEquals(1L, (long) baseBuilder.build().getExtension(Primitives.repeatedInt64Extension, 0));
    assertEquals(2L, (long) baseBuilder.getExtension(Primitives.repeatedInt64Extension, 1));
    assertEquals(2L, (long) baseBuilder.build().getExtension(Primitives.repeatedInt64Extension, 1));
  }

  @Test
  public void testRepeatedLongExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.setExtension(Primitives.repeatedInt64Extension, 2, 1L));
    }

    baseBuilder.setExtension(Primitives.repeatedInt64Extension, Arrays.asList(1L, 2L));

    baseBuilder.setExtension(Primitives.repeatedInt64Extension, 0, 3L);
    baseBuilder.setExtension(Primitives.repeatedInt64Extension, 1, 4L);

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt64Extension))
        .containsExactly(3L, 4L)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt64Extension))
        .containsExactly(3L, 4L)
        .inOrder();
  }

  @Test
  public void testRepeatedLongExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Primitives.repeatedInt64Extension, Arrays.asList(1L, 2L));

    baseBuilder.addExtension(Primitives.repeatedInt64Extension, 3L);
    baseBuilder.addExtension(Primitives.repeatedInt64Extension, 4L);

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt64Extension))
        .containsExactly(1L, 2L, 3L, 4L)
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt64Extension))
        .containsExactly(1L, 2L, 3L, 4L)
        .inOrder();
  }

  @Test
  public void testRepeatedLongExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.repeatedInt64Extension, Arrays.asList(1L, 2L));

    baseBuilder.clearExtension(Primitives.repeatedInt64Extension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedInt64Extension));
  }

  @Test
  public void testSingleMessageExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Recursive.recursiveOptional));
    assertFalse(baseBuilder.build().hasExtension(Recursive.recursiveOptional));
    assertTrue(
        Base.newBuilder().build().equals(baseBuilder.getExtension(Recursive.recursiveOptional)));
    assertTrue(
        Base.newBuilder()
            .build()
            .equals(baseBuilder.build().getExtension(Recursive.recursiveOptional)));

    baseBuilder.setExtension(Recursive.recursiveOptional, base(1));
    assertTrue(baseBuilder.hasExtension(Recursive.recursiveOptional));
    assertTrue(baseBuilder.build().hasExtension(Recursive.recursiveOptional));

    assertEquals(base(1), baseBuilder.getExtension(Recursive.recursiveOptional));
    assertEquals(base(1), baseBuilder.build().getExtension(Recursive.recursiveOptional));
  }

  @Test
  public void testSingleMessageExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Recursive.recursiveOptional, base(1));

    baseBuilder.clearExtension(Recursive.recursiveOptional);

    assertFalse(baseBuilder.hasExtension(Recursive.recursiveOptional));
    assertFalse(baseBuilder.build().hasExtension(Recursive.recursiveOptional));
  }

  @Test
  public void testRepeatedMessageExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Recursive.recursiveRepeated));
    assertEquals(0, baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated));
    assertThat(baseBuilder.getExtension(Recursive.recursiveRepeated)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveRepeated)).isEmpty();

    baseBuilder.setExtension(Recursive.recursiveRepeated, Arrays.asList(base(1), base(2)));
    assertEquals(2, baseBuilder.getExtensionCount(Recursive.recursiveRepeated));
    assertEquals(2, baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated));

    assertThat(baseBuilder.getExtension(Recursive.recursiveRepeated))
        .containsExactly(base(1), base(2))
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveRepeated))
        .containsExactly(base(1), base(2))
        .inOrder();
  }

  @Test
  public void testRepeatedMessageExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(Exception.class, () -> baseBuilder.getExtension(Recursive.recursiveRepeated, 0));
    }

    baseBuilder.setExtension(Recursive.recursiveRepeated, Arrays.asList(base(1), base(2)));

    assertEquals(base(1), baseBuilder.getExtension(Recursive.recursiveRepeated, 0));
    assertEquals(base(1), baseBuilder.build().getExtension(Recursive.recursiveRepeated, 0));
    assertEquals(base(2), baseBuilder.getExtension(Recursive.recursiveRepeated, 1));
    assertEquals(base(2), baseBuilder.build().getExtension(Recursive.recursiveRepeated, 1));
  }

  @Test
  public void testRepeatedMessageExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.setExtension(Recursive.recursiveRepeated, 2, base(1)));
    }

    baseBuilder.setExtension(Recursive.recursiveRepeated, Arrays.asList(base(1), base(2)));

    baseBuilder.setExtension(Recursive.recursiveRepeated, 0, base(3));
    baseBuilder.setExtension(Recursive.recursiveRepeated, 1, base(4));

    assertThat(baseBuilder.getExtension(Recursive.recursiveRepeated))
        .containsExactly(base(3), base(4))
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveRepeated))
        .containsExactly(base(3), base(4))
        .inOrder();
  }

  @Test
  public void testRepeatedMessageExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Recursive.recursiveRepeated, Arrays.asList(base(1), base(2)));

    baseBuilder.addExtension(Recursive.recursiveRepeated, base(3));
    baseBuilder.addExtension(Recursive.recursiveRepeated, base(4));

    assertThat(baseBuilder.getExtension(Recursive.recursiveRepeated))
        .containsExactly(base(1), base(2), base(3), base(4))
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveRepeated))
        .containsExactly(base(1), base(2), base(3), base(4))
        .inOrder();
  }

  @Test
  public void testRepeatedMessageExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Recursive.recursiveRepeated, Arrays.asList(base(1), base(2)));

    baseBuilder.clearExtension(Recursive.recursiveRepeated);

    assertEquals(0, baseBuilder.getExtensionCount(Recursive.recursiveRepeated));
    assertEquals(0, baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated));
  }

  @Test
  public void testSingleStringExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertFalse(baseBuilder.hasExtension(Primitives.singleStringExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleStringExtension));
    assertEquals("", baseBuilder.getExtension(Primitives.singleStringExtension));
    assertEquals("", baseBuilder.build().getExtension(Primitives.singleStringExtension));

    baseBuilder.setExtension(Primitives.singleStringExtension, "1");
    assertTrue(baseBuilder.hasExtension(Primitives.singleStringExtension));
    assertTrue(baseBuilder.build().hasExtension(Primitives.singleStringExtension));

    assertEquals("1", baseBuilder.getExtension(Primitives.singleStringExtension));
    assertEquals("1", baseBuilder.build().getExtension(Primitives.singleStringExtension));
  }

  @Test
  public void testSingleStringExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleStringExtension, "1");

    baseBuilder.clearExtension(Primitives.singleStringExtension);

    assertFalse(baseBuilder.hasExtension(Primitives.singleStringExtension));
    assertFalse(baseBuilder.build().hasExtension(Primitives.singleStringExtension));
  }

  @Test
  public void testRepeatedStringExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedStringExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedStringExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedStringExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedStringExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedStringExtension, Arrays.asList("1", "2"));
    assertEquals(2, baseBuilder.getExtensionCount(Primitives.repeatedStringExtension));
    assertEquals(2, baseBuilder.build().getExtensionCount(Primitives.repeatedStringExtension));

    assertThat(baseBuilder.getExtension(Primitives.repeatedStringExtension))
        .containsExactly("1", "2")
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedStringExtension))
        .containsExactly("1", "2")
        .inOrder();
  }

  @Test
  public void testRepeatedStringExtension_getAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class, () -> baseBuilder.getExtension(Primitives.repeatedStringExtension, 0));
    }

    baseBuilder.setExtension(Primitives.repeatedStringExtension, Arrays.asList("1", "2"));

    assertEquals("1", baseBuilder.getExtension(Primitives.repeatedStringExtension, 0));
    assertEquals("1", baseBuilder.build().getExtension(Primitives.repeatedStringExtension, 0));
    assertEquals("2", baseBuilder.getExtension(Primitives.repeatedStringExtension, 1));
    assertEquals("2", baseBuilder.build().getExtension(Primitives.repeatedStringExtension, 1));
  }

  @Test
  public void testRepeatedStringExtension_setAtIndex() {
    Base.Builder baseBuilder = Base.newBuilder();

    if (checkIndex()) {
      assertThrows(
          Exception.class,
          () -> baseBuilder.setExtension(Primitives.repeatedStringExtension, 2, "1"));
    }

    baseBuilder.setExtension(Primitives.repeatedStringExtension, Arrays.asList("1", "2"));

    baseBuilder.setExtension(Primitives.repeatedStringExtension, 0, "3");
    baseBuilder.setExtension(Primitives.repeatedStringExtension, 1, "4");

    assertThat(baseBuilder.getExtension(Primitives.repeatedStringExtension))
        .containsExactly("3", "4")
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedStringExtension))
        .containsExactly("3", "4")
        .inOrder();
  }

  @Test
  public void testRepeatedStringExtension_add() {
    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(Primitives.repeatedStringExtension, Arrays.asList("1", "2"));

    baseBuilder.addExtension(Primitives.repeatedStringExtension, "3");
    baseBuilder.addExtension(Primitives.repeatedStringExtension, "4");

    assertThat(baseBuilder.getExtension(Primitives.repeatedStringExtension))
        .containsExactly("1", "2", "3", "4")
        .inOrder();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedStringExtension))
        .containsExactly("1", "2", "3", "4")
        .inOrder();
  }

  @Test
  public void testRepeatedStringExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.repeatedStringExtension, Arrays.asList("1", "2"));

    baseBuilder.clearExtension(Primitives.repeatedStringExtension);

    assertEquals(0, baseBuilder.getExtensionCount(Primitives.repeatedStringExtension));
    assertEquals(0, baseBuilder.build().getExtensionCount(Primitives.repeatedStringExtension));
  }

  @Test
  public void testRepeatedExtensionStoredInVaraible() {
    // Note that this variable type should work with extension APIs.
    ExtensionLite<Base, List<String>> ext = Primitives.repeatedStringExtension;

    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(ext, Arrays.asList("1", "2"));
    baseBuilder.clearExtension(ext);
    assertEquals(0, baseBuilder.getExtensionCount(ext));
    assertEquals(0, baseBuilder.build().getExtensionCount(ext));
  }

  private boolean checkIndex() {
    return System.getProperty("proto.im.defines.CHECK_INDEX", "true").equals("true");
  }

  private static ByteString bs(int b) {
    return ByteString.copyFrom(new byte[] {(byte) b});
  }

  private static Base base(int value) {
    return Base.newBuilder().setOptionalInt(value).build();
  }
}
