package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

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
    assertEquals(0, TestProto.newBuilder().build().getOptionalFloat(), DELTA);
    assertFalse(TestProto.newBuilder().build().hasOptionalFloat());
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalFloat(89.64f);
    assertTrue(builder.hasOptionalFloat());
    assertEquals(89.64f, builder.getOptionalFloat(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalFloat());
    assertEquals(89.64f, proto.getOptionalFloat(), DELTA);
  }

  @Test
  public void testOptionalFieldNoDefault_setDefault() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalFloat(0f);
    assertTrue(builder.hasOptionalFloat());
    assertEquals(0f, builder.getOptionalFloat(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalFloat());
    assertEquals(0f, proto.getOptionalFloat(), DELTA);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalFloat(1f).build();

    // Test clear
    TestProto.Builder builder = startProto.toBuilder();
    assertTrue(builder.hasOptionalFloat());
    builder.clearOptionalFloat();
    assertFalse(builder.hasOptionalFloat());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalFloat());
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertEquals(
        PROTO_DEFAULT_FLOAT, TestProto.newBuilder().build().getOptionalFloatWithDefault(), DELTA);
    assertFalse(TestProto.newBuilder().build().hasOptionalFloatWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalFloatWithDefault(PROTO_DEFAULT_FLOAT);
    assertTrue(builder.hasOptionalFloatWithDefault());
    assertEquals(PROTO_DEFAULT_FLOAT, builder.getOptionalFloatWithDefault(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalFloatWithDefault());
    assertEquals(PROTO_DEFAULT_FLOAT, proto.getOptionalFloatWithDefault(), DELTA);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalFloatWithDefault(246f);
    assertTrue(builder.hasOptionalFloatWithDefault());
    assertEquals(246f, builder.getOptionalFloatWithDefault(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalFloatWithDefault());
    assertEquals(246f, proto.getOptionalFloatWithDefault(), DELTA);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedFloatCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedFloatList().size());

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

    assertEquals(5, builder.getRepeatedFloatCount());
    assertEquals(1.324f, builder.getRepeatedFloat(0), DELTA);
    assertEquals(24f, builder.getRepeatedFloat(1), DELTA);
    assertEquals(-1f, builder.getRepeatedFloat(2), DELTA);
    assertEquals(-2f, builder.getRepeatedFloat(3), DELTA);
    assertEquals(-3f, builder.getRepeatedFloat(4), DELTA);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedFloat(5));
    } else {
      assertThat(builder.getRepeatedFloat(5)).isNaN();
    }

    TestProto proto = builder.build();
    assertEquals(1.324f, proto.getRepeatedFloat(0), DELTA);
    assertEquals(24f, proto.getRepeatedFloat(1), DELTA);
    assertEquals(-1f, proto.getRepeatedFloat(2), DELTA);
    assertEquals(-2f, proto.getRepeatedFloat(3), DELTA);
    assertEquals(-3f, proto.getRepeatedFloat(4), DELTA);
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
    assertEquals(0, builder.getRepeatedFloatCount());
    assertEquals(0, builder.getRepeatedFloatList().size());

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedFloatCount());
    assertEquals(0, proto.getRepeatedFloatList().size());
  }
}
