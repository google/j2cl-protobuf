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
public class DoubleFieldsTest {
  private static double PROTO_DEFAULT_FLOAT = 2.46d;
  private static double DELTA = 0.00001d;

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getOptionalDouble(), DELTA);
    assertFalse(TestProto.newBuilder().build().hasOptionalDouble());
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalDouble(89.64d);
    assertTrue(builder.hasOptionalDouble());
    assertEquals(89.64d, builder.getOptionalDouble(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalDouble());
    assertEquals(89.64d, proto.getOptionalDouble(), DELTA);
  }

  @Test
  public void testOptionalFieldNoDefault_setDefault() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalDouble(0d);
    assertTrue(builder.hasOptionalDouble());
    assertEquals(0d, builder.getOptionalDouble(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalDouble());
    assertEquals(0d, proto.getOptionalDouble(), DELTA);
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalDouble(1).build();

    // Test clear
    TestProto.Builder builder = startProto.toBuilder();
    assertTrue(builder.hasOptionalDouble());
    builder.clearOptionalDouble();
    assertFalse(builder.hasOptionalDouble());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalDouble());
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertEquals(2.46d, TestProto.newBuilder().build().getOptionalDoubleWithDefault(), DELTA);
    assertFalse(TestProto.newBuilder().build().hasOptionalDoubleWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalDoubleWithDefault(PROTO_DEFAULT_FLOAT);
    assertTrue(builder.hasOptionalDoubleWithDefault());
    assertEquals(PROTO_DEFAULT_FLOAT, builder.getOptionalDoubleWithDefault(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalDoubleWithDefault());
    assertEquals(PROTO_DEFAULT_FLOAT, proto.getOptionalDoubleWithDefault(), DELTA);
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalDoubleWithDefault(246);
    assertTrue(builder.hasOptionalDoubleWithDefault());
    assertEquals(246, builder.getOptionalDoubleWithDefault(), DELTA);

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalDoubleWithDefault());
    assertEquals(246, proto.getOptionalDoubleWithDefault(), DELTA);
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedDoubleCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedDoubleList().size());

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

    assertEquals(5, builder.getRepeatedDoubleCount());
    assertEquals(1.324d, builder.getRepeatedDouble(0), DELTA);
    assertEquals(24d, builder.getRepeatedDouble(1), DELTA);
    assertEquals(-1d, builder.getRepeatedDouble(2), DELTA);
    assertEquals(-2d, builder.getRepeatedDouble(3), DELTA);
    assertEquals(-3d, builder.getRepeatedDouble(4), DELTA);
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedDouble(5));
    } else {
      assertThat(builder.getRepeatedDouble(5)).isNaN();
    }

    TestProto proto = builder.build();
    assertEquals(1.324d, proto.getRepeatedDouble(0), DELTA);
    assertEquals(24d, proto.getRepeatedDouble(1), DELTA);
    assertEquals(-1d, proto.getRepeatedDouble(2), DELTA);
    assertEquals(-2d, proto.getRepeatedDouble(3), DELTA);
    assertEquals(-3d, proto.getRepeatedDouble(4), DELTA);
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
    assertEquals(0, builder.getRepeatedDoubleCount());
    assertEquals(0, builder.getRepeatedDoubleList().size());

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedDoubleCount());
    assertEquals(0, proto.getRepeatedDoubleList().size());
  }
}
