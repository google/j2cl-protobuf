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
import com.google.protobuf.ExtensionLite;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Base;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Primitives;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Primitives.NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Primitives.TestEnum;
import com.google.protobuf.contrib.j2cl.protos.Extensions.Recursive;
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
    assertThat(baseBuilder.hasExtension(Primitives.singleBoolExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleBoolExtension)).isFalse();
    assertThat(baseBuilder.getExtension(Primitives.singleBoolExtension)).isFalse();
    assertThat(baseBuilder.build().getExtension(Primitives.singleBoolExtension)).isFalse();

    baseBuilder.setExtension(Primitives.singleBoolExtension, true);
    assertThat(baseBuilder.hasExtension(Primitives.singleBoolExtension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleBoolExtension)).isTrue();

    assertThat(baseBuilder.getExtension(Primitives.singleBoolExtension)).isTrue();
    assertThat(baseBuilder.build().getExtension(Primitives.singleBoolExtension)).isTrue();
  }

  @Test
  public void testSingleBooleanExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleBoolExtension, true);

    baseBuilder.clearExtension(Primitives.singleBoolExtension);

    assertThat(baseBuilder.hasExtension(Primitives.singleBoolExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleBoolExtension)).isFalse();
  }

  @Test
  public void testRepeatedBooleanExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedBoolExtension))
        .isEqualTo(0);

    assertThat(baseBuilder.getExtension(Primitives.repeatedBoolExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedBoolExtension, Arrays.asList(true, true));
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedBoolExtension))
        .isEqualTo(2);

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

    assertThat(baseBuilder.getExtension(Primitives.repeatedBoolExtension, 0)).isTrue();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension, 0)).isTrue();
    assertThat(baseBuilder.getExtension(Primitives.repeatedBoolExtension, 1)).isFalse();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedBoolExtension, 1)).isFalse();
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedBoolExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedBoolExtension))
        .isEqualTo(0);
  }

  @Test
  public void testSingleByteStringExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleByteStringExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleByteStringExtension)).isFalse();
    assertThat(baseBuilder.getExtension(Primitives.singleByteStringExtension))
        .isEqualTo(ByteString.EMPTY);
    assertThat(baseBuilder.build().getExtension(Primitives.singleByteStringExtension))
        .isEqualTo(ByteString.EMPTY);

    baseBuilder.setExtension(Primitives.singleByteStringExtension, bs(1));
    assertThat(baseBuilder.hasExtension(Primitives.singleByteStringExtension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleByteStringExtension)).isTrue();

    assertThat(baseBuilder.getExtension(Primitives.singleByteStringExtension)).isEqualTo(bs(1));
    assertThat(baseBuilder.build().getExtension(Primitives.singleByteStringExtension))
        .isEqualTo(bs(1));
  }

  @Test
  public void testSingleByteStringExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(
        Primitives.singleByteStringExtension, ByteString.copyFrom(new byte[] {1}));

    baseBuilder.clearExtension(Primitives.singleByteStringExtension);

    assertThat(baseBuilder.hasExtension(Primitives.singleByteStringExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleByteStringExtension)).isFalse();
  }

  @Test
  public void testRepeatedByteStringExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedByteStringExtension))
        .isEqualTo(0);
    assertThat(baseBuilder.getExtension(Primitives.repeatedByteStringExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedByteStringExtension, Arrays.asList(bs(1), bs(2)));
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedByteStringExtension))
        .isEqualTo(2);

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

    assertThat(baseBuilder.getExtension(Primitives.repeatedByteStringExtension, 0))
        .isEqualTo(bs(1));
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension, 0))
        .isEqualTo(bs(1));
    assertThat(baseBuilder.getExtension(Primitives.repeatedByteStringExtension, 1))
        .isEqualTo(bs(2));
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedByteStringExtension, 1))
        .isEqualTo(bs(2));
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedByteStringExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedByteStringExtension))
        .isEqualTo(0);
  }

  @Test
  public void testSingleDoubleExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleDoubleExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleDoubleExtension)).isFalse();
    assertThat(baseBuilder.getExtension(Primitives.singleDoubleExtension)).isWithin(0.0001d).of(0d);
    assertThat(baseBuilder.build().getExtension(Primitives.singleDoubleExtension))
        .isWithin(0.0001d)
        .of(0d);

    baseBuilder.setExtension(Primitives.singleDoubleExtension, 1d);
    assertThat(baseBuilder.hasExtension(Primitives.singleDoubleExtension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleDoubleExtension)).isTrue();

    assertThat(baseBuilder.getExtension(Primitives.singleDoubleExtension)).isWithin(0.0001d).of(1d);
    assertThat(baseBuilder.build().getExtension(Primitives.singleDoubleExtension))
        .isWithin(0.0001d)
        .of(1d);
  }

  @Test
  public void testSingleDoubleExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleDoubleExtension, 1d);

    baseBuilder.clearExtension(Primitives.singleDoubleExtension);

    assertThat(baseBuilder.hasExtension(Primitives.singleDoubleExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleDoubleExtension)).isFalse();
  }

  @Test
  public void testRepeatedDoubleExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedDoubleExtension))
        .isEqualTo(0);
    assertThat(baseBuilder.getExtension(Primitives.repeatedDoubleExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedDoubleExtension, Arrays.asList(1d, 2d));
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedDoubleExtension))
        .isEqualTo(2);

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

    assertThat(baseBuilder.getExtension(Primitives.repeatedDoubleExtension, 0))
        .isWithin(0.0001d)
        .of(1d);
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension, 0))
        .isWithin(0.0001d)
        .of(1d);
    assertThat(baseBuilder.getExtension(Primitives.repeatedDoubleExtension, 1))
        .isWithin(0.0001d)
        .of(2d);
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedDoubleExtension, 1))
        .isWithin(0.0001d)
        .of(2d);
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedDoubleExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedDoubleExtension))
        .isEqualTo(0);
  }

  @Test
  public void testSingleEnumExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleEnumExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleEnumExtension)).isFalse();
    assertThat(baseBuilder.getExtension(Primitives.singleEnumExtension))
        .isEqualTo(TestEnum.DEFAULT);
    assertThat(baseBuilder.build().getExtension(Primitives.singleEnumExtension))
        .isEqualTo(TestEnum.DEFAULT);

    baseBuilder.setExtension(Primitives.singleEnumExtension, TestEnum.GREEN);
    assertThat(baseBuilder.hasExtension(Primitives.singleEnumExtension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleEnumExtension)).isTrue();

    assertThat(baseBuilder.getExtension(Primitives.singleEnumExtension)).isEqualTo(TestEnum.GREEN);
    assertThat(baseBuilder.build().getExtension(Primitives.singleEnumExtension))
        .isEqualTo(TestEnum.GREEN);
  }

  @Test
  public void testSingleEnumExtension_get_hasExtensionNativeEnum() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleNativeEnumExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleNativeEnumExtension)).isFalse();
    assertThat(baseBuilder.getExtension(Primitives.singleNativeEnumExtension))
        .isEqualTo(NativeEnum.NATIVE_DEFAULT);
    assertThat(baseBuilder.build().getExtension(Primitives.singleNativeEnumExtension))
        .isEqualTo(NativeEnum.NATIVE_DEFAULT);

    baseBuilder.setExtension(Primitives.singleNativeEnumExtension, NativeEnum.NATIVE_GREEN);
    assertThat(baseBuilder.hasExtension(Primitives.singleNativeEnumExtension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleNativeEnumExtension)).isTrue();

    assertThat(baseBuilder.getExtension(Primitives.singleNativeEnumExtension))
        .isEqualTo(NativeEnum.NATIVE_GREEN);
    assertThat(baseBuilder.build().getExtension(Primitives.singleNativeEnumExtension))
        .isEqualTo(NativeEnum.NATIVE_GREEN);
  }

  @Test
  public void testSingleEnumExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleEnumExtension, TestEnum.GREEN);

    baseBuilder.clearExtension(Primitives.singleEnumExtension);

    assertThat(baseBuilder.hasExtension(Primitives.singleEnumExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleEnumExtension)).isFalse();
  }

  @Test
  public void testSingleEnumExtension_clearNativeEnum() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleNativeEnumExtension, NativeEnum.NATIVE_GREEN);

    baseBuilder.clearExtension(Primitives.singleNativeEnumExtension);

    assertThat(baseBuilder.hasExtension(Primitives.singleNativeEnumExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleNativeEnumExtension)).isFalse();
  }

  @Test
  public void testRepeatedEnumExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedEnumExtension))
        .isEqualTo(0);

    assertThat(baseBuilder.getExtension(Primitives.repeatedEnumExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedEnumExtension)).isEmpty();

    baseBuilder.setExtension(
        Primitives.repeatedEnumExtension, Arrays.asList(TestEnum.GREEN, TestEnum.RED));
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedEnumExtension))
        .isEqualTo(2);

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

    assertThat(baseBuilder.getExtension(Primitives.repeatedEnumExtension, 0))
        .isEqualTo(TestEnum.GREEN);
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedEnumExtension, 0))
        .isEqualTo(TestEnum.GREEN);
    assertThat(baseBuilder.getExtension(Primitives.repeatedEnumExtension, 1))
        .isEqualTo(TestEnum.RED);
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedEnumExtension, 1))
        .isEqualTo(TestEnum.RED);
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedEnumExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedEnumExtension))
        .isEqualTo(0);
  }

  @Test
  public void testSingleFloatExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleFloatExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleFloatExtension)).isFalse();
    assertThat((float) baseBuilder.getExtension(Primitives.singleFloatExtension))
        .isWithin(0.0001f)
        .of(0f);
    assertThat((float) baseBuilder.build().getExtension(Primitives.singleFloatExtension))
        .isWithin(0.0001f)
        .of(0f);

    baseBuilder.setExtension(Primitives.singleFloatExtension, 1f);
    assertThat(baseBuilder.hasExtension(Primitives.singleFloatExtension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleFloatExtension)).isTrue();

    assertThat((float) baseBuilder.getExtension(Primitives.singleFloatExtension))
        .isWithin(0.0001f)
        .of(1f);
    assertThat((float) baseBuilder.build().getExtension(Primitives.singleFloatExtension))
        .isWithin(0.0001f)
        .of(1f);
  }

  @Test
  public void testSingleFloatExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleFloatExtension, 1f);

    baseBuilder.clearExtension(Primitives.singleFloatExtension);

    assertThat(baseBuilder.hasExtension(Primitives.singleFloatExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleFloatExtension)).isFalse();
  }

  @Test
  public void testRepeatedFloatExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedFloatExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedFloatExtension))
        .isEqualTo(0);

    assertThat(baseBuilder.getExtension(Primitives.repeatedFloatExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedFloatExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedFloatExtension, Arrays.asList(1f, 2f));

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedFloatExtension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedFloatExtension))
        .isEqualTo(2);

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

    assertThat(baseBuilder.getExtension(Primitives.repeatedFloatExtension, 0))
        .isWithin(0.0001f)
        .of(1f);
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedFloatExtension, 0))
        .isWithin(0.0001f)
        .of(1f);
    assertThat(baseBuilder.getExtension(Primitives.repeatedFloatExtension, 1))
        .isWithin(0.0001f)
        .of(2f);
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedFloatExtension, 1))
        .isWithin(0.0001f)
        .of(2f);
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedFloatExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedFloatExtension))
        .isEqualTo(0);
  }

  @Test
  public void testSingleIntExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleInt32Extension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleInt32Extension)).isFalse();
    assertThat((int) baseBuilder.getExtension(Primitives.singleInt32Extension)).isEqualTo(0);
    assertThat((int) baseBuilder.build().getExtension(Primitives.singleInt32Extension))
        .isEqualTo(0);

    baseBuilder.setExtension(Primitives.singleInt32Extension, 1);
    assertThat(baseBuilder.hasExtension(Primitives.singleInt32Extension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleInt32Extension)).isTrue();

    assertThat((int) baseBuilder.getExtension(Primitives.singleInt32Extension)).isEqualTo(1);
    assertThat((int) baseBuilder.build().getExtension(Primitives.singleInt32Extension))
        .isEqualTo(1);
  }

  @Test
  public void testSingleIntExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleInt32Extension, 1);

    baseBuilder.clearExtension(Primitives.singleInt32Extension);

    assertThat(baseBuilder.hasExtension(Primitives.singleInt32Extension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleInt32Extension)).isFalse();
  }

  @Test
  public void testRepeatedIntExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedInt32Extension))
        .isEqualTo(0);
    assertThat(baseBuilder.getExtension(Primitives.repeatedInt32Extension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt32Extension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedInt32Extension, Arrays.asList(1, 2));
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedInt32Extension))
        .isEqualTo(2);

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

    assertThat((int) baseBuilder.getExtension(Primitives.repeatedInt32Extension, 0)).isEqualTo(1);
    assertThat((int) baseBuilder.build().getExtension(Primitives.repeatedInt32Extension, 0))
        .isEqualTo(1);
    assertThat((int) baseBuilder.getExtension(Primitives.repeatedInt32Extension, 1)).isEqualTo(2);
    assertThat((int) baseBuilder.build().getExtension(Primitives.repeatedInt32Extension, 1))
        .isEqualTo(2);
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedInt32Extension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedInt32Extension))
        .isEqualTo(0);
  }

  @Test
  public void testSingleLongExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleInt64Extension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleInt64Extension)).isFalse();
    assertThat((long) baseBuilder.getExtension(Primitives.singleInt64Extension)).isEqualTo(0L);
    assertThat((long) baseBuilder.build().getExtension(Primitives.singleInt64Extension))
        .isEqualTo(0L);

    baseBuilder.setExtension(Primitives.singleInt64Extension, 1L);
    assertThat(baseBuilder.hasExtension(Primitives.singleInt64Extension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleInt64Extension)).isTrue();

    assertThat((long) baseBuilder.getExtension(Primitives.singleInt64Extension)).isEqualTo(1L);
    assertThat((long) baseBuilder.build().getExtension(Primitives.singleInt64Extension))
        .isEqualTo(1L);
  }

  @Test
  public void testSingleLongExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleInt64Extension, 1L);

    baseBuilder.clearExtension(Primitives.singleInt64Extension);

    assertThat(baseBuilder.hasExtension(Primitives.singleInt64Extension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleInt64Extension)).isFalse();
  }

  @Test
  public void testRepeatedLongExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedInt64Extension))
        .isEqualTo(0);

    assertThat(baseBuilder.getExtension(Primitives.repeatedInt64Extension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedInt64Extension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedInt64Extension, Arrays.asList(1L, 2L));

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedInt64Extension))
        .isEqualTo(2);

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

    assertThat((long) baseBuilder.getExtension(Primitives.repeatedInt64Extension, 0)).isEqualTo(1L);
    assertThat((long) baseBuilder.build().getExtension(Primitives.repeatedInt64Extension, 0))
        .isEqualTo(1L);
    assertThat((long) baseBuilder.getExtension(Primitives.repeatedInt64Extension, 1)).isEqualTo(2L);
    assertThat((long) baseBuilder.build().getExtension(Primitives.repeatedInt64Extension, 1))
        .isEqualTo(2L);
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedInt64Extension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedInt64Extension))
        .isEqualTo(0);
  }

  @Test
  public void testSingleMessageExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Recursive.recursiveOptional)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Recursive.recursiveOptional)).isFalse();
    assertThat(
            Base.getDefaultInstance().equals(baseBuilder.getExtension(Recursive.recursiveOptional)))
        .isTrue();
    assertThat(
            Base.getDefaultInstance()
                .equals(baseBuilder.build().getExtension(Recursive.recursiveOptional)))
        .isTrue();

    baseBuilder.setExtension(Recursive.recursiveOptional, base(1));
    assertThat(baseBuilder.hasExtension(Recursive.recursiveOptional)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Recursive.recursiveOptional)).isTrue();

    assertThat(baseBuilder.getExtension(Recursive.recursiveOptional)).isEqualTo(base(1));
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveOptional)).isEqualTo(base(1));
  }

  @Test
  public void testSingleMessageExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Recursive.recursiveOptional, base(1));

    baseBuilder.clearExtension(Recursive.recursiveOptional);

    assertThat(baseBuilder.hasExtension(Recursive.recursiveOptional)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Recursive.recursiveOptional)).isFalse();
  }

  @Test
  public void testRepeatedMessageExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Recursive.recursiveRepeated)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated)).isEqualTo(0);
    assertThat(baseBuilder.getExtension(Recursive.recursiveRepeated)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveRepeated)).isEmpty();

    baseBuilder.setExtension(Recursive.recursiveRepeated, Arrays.asList(base(1), base(2)));
    assertThat(baseBuilder.getExtensionCount(Recursive.recursiveRepeated)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated)).isEqualTo(2);

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

    assertThat(baseBuilder.getExtension(Recursive.recursiveRepeated, 0)).isEqualTo(base(1));
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveRepeated, 0)).isEqualTo(base(1));
    assertThat(baseBuilder.getExtension(Recursive.recursiveRepeated, 1)).isEqualTo(base(2));
    assertThat(baseBuilder.build().getExtension(Recursive.recursiveRepeated, 1)).isEqualTo(base(2));
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

    assertThat(baseBuilder.getExtensionCount(Recursive.recursiveRepeated)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Recursive.recursiveRepeated)).isEqualTo(0);
  }

  @Test
  public void testSingleStringExtension_get_hasExtension() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.hasExtension(Primitives.singleStringExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleStringExtension)).isFalse();
    assertThat(baseBuilder.getExtension(Primitives.singleStringExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.singleStringExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.singleStringExtension, "1");
    assertThat(baseBuilder.hasExtension(Primitives.singleStringExtension)).isTrue();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleStringExtension)).isTrue();

    assertThat(baseBuilder.getExtension(Primitives.singleStringExtension)).isEqualTo("1");
    assertThat(baseBuilder.build().getExtension(Primitives.singleStringExtension)).isEqualTo("1");
  }

  @Test
  public void testSingleStringExtension_clear() {
    Base.Builder baseBuilder = Base.newBuilder();
    baseBuilder.setExtension(Primitives.singleStringExtension, "1");

    baseBuilder.clearExtension(Primitives.singleStringExtension);

    assertThat(baseBuilder.hasExtension(Primitives.singleStringExtension)).isFalse();
    assertThat(baseBuilder.build().hasExtension(Primitives.singleStringExtension)).isFalse();
  }

  @Test
  public void testRepeatedStringExtension_count_get() {
    Base.Builder baseBuilder = Base.newBuilder();
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedStringExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedStringExtension))
        .isEqualTo(0);

    assertThat(baseBuilder.getExtension(Primitives.repeatedStringExtension)).isEmpty();
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedStringExtension)).isEmpty();

    baseBuilder.setExtension(Primitives.repeatedStringExtension, Arrays.asList("1", "2"));
    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedStringExtension)).isEqualTo(2);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedStringExtension))
        .isEqualTo(2);

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

    assertThat(baseBuilder.getExtension(Primitives.repeatedStringExtension, 0)).isEqualTo("1");
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedStringExtension, 0))
        .isEqualTo("1");
    assertThat(baseBuilder.getExtension(Primitives.repeatedStringExtension, 1)).isEqualTo("2");
    assertThat(baseBuilder.build().getExtension(Primitives.repeatedStringExtension, 1))
        .isEqualTo("2");
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

    assertThat(baseBuilder.getExtensionCount(Primitives.repeatedStringExtension)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(Primitives.repeatedStringExtension))
        .isEqualTo(0);
  }

  @Test
  public void testRepeatedExtensionStoredInVaraible() {
    // Note that this variable type should work with extension APIs.
    ExtensionLite<Base, List<String>> ext = Primitives.repeatedStringExtension;

    Base.Builder baseBuilder = Base.newBuilder();

    baseBuilder.setExtension(ext, Arrays.asList("1", "2"));
    baseBuilder.clearExtension(ext);
    assertThat(baseBuilder.getExtensionCount(ext)).isEqualTo(0);
    assertThat(baseBuilder.build().getExtensionCount(ext)).isEqualTo(0);
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
