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
public class IntFieldsTest {

  private static final int PROTO_DEFAULT_VALUE = 135;

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getOptionalInt());
    assertFalse(TestProto.newBuilder().build().hasOptionalInt());
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalInt(8964);
    assertTrue(builder.hasOptionalInt());
    assertEquals(8964, builder.getOptionalInt());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalInt());
    assertEquals(8964, proto.getOptionalInt());
  }

  @Test
  public void testOptionalFieldNoDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalInt(0);
    assertTrue(builder.hasOptionalInt());
    assertEquals(0, builder.getOptionalInt());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalInt());
    assertEquals(0, proto.getOptionalInt());
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalInt(8964).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalInt();
    assertFalse(builder.hasOptionalInt());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalInt());
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    assertEquals(PROTO_DEFAULT_VALUE, TestProto.newBuilder().build().getOptionalIntWithDefault());
    assertFalse(TestProto.newBuilder().build().hasOptionalIntWithDefault());

    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalIntWithDefault(PROTO_DEFAULT_VALUE);
    assertTrue(builder.hasOptionalIntWithDefault());
    assertEquals(PROTO_DEFAULT_VALUE, builder.getOptionalIntWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalIntWithDefault());
    assertEquals(PROTO_DEFAULT_VALUE, proto.getOptionalIntWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalIntWithDefault(246);
    assertTrue(builder.hasOptionalIntWithDefault());
    assertEquals(246, builder.getOptionalIntWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalIntWithDefault());
    assertEquals(246, proto.getOptionalIntWithDefault());
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedIntCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedIntList().size());
    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedInt(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder = TestProto.newBuilder().addRepeatedInt(13).addRepeatedInt(24);
    assertEquals(2, builder.getRepeatedIntCount());
    assertThat(Arrays.<Integer>asList(13, 24))
        .containsExactlyElementsIn(builder.getRepeatedIntList())
        .inOrder();

    TestProto proto = builder.build();
    assertEquals(2, proto.getRepeatedIntCount());
    assertThat(Arrays.<Integer>asList(13, 24))
        .containsExactlyElementsIn(proto.getRepeatedIntList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto = TestProto.newBuilder().addRepeatedInt(13).addRepeatedInt(24).build();
    TestProto.Builder builder = startProto.toBuilder().addAllRepeatedInt(Arrays.asList(-1, -2, -3));

    assertThat(Arrays.asList(13, 24, -1, -2, -3))
        .containsExactlyElementsIn(builder.getRepeatedIntList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13, 24, -1, -2, -3))
        .containsExactlyElementsIn(proto.getRepeatedIntList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedInt(13)
            .addRepeatedInt(24)
            .addRepeatedInt(-1)
            .addRepeatedInt(-2)
            .addRepeatedInt(-3)
            .build();
    TestProto.Builder builder = startProto.toBuilder().setRepeatedInt(2, 333);
    assertThat(Arrays.asList(13, 24, 333, -2, -3))
        .containsExactlyElementsIn(builder.getRepeatedIntList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13, 24, 333, -2, -3))
        .containsExactlyElementsIn(proto.getRepeatedIntList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedInt(13)
            .addRepeatedInt(24)
            .addRepeatedInt(-1)
            .addRepeatedInt(-2)
            .addRepeatedInt(-3);

    assertEquals(5, builder.getRepeatedIntCount());
    assertEquals(13, builder.getRepeatedInt(0));
    assertEquals(24, builder.getRepeatedInt(1));
    assertEquals(-1, builder.getRepeatedInt(2));
    assertEquals(-2, builder.getRepeatedInt(3));
    assertEquals(-3, builder.getRepeatedInt(4));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedInt(5));
    } else {
      assertEquals(0, builder.getRepeatedInt(5));
    }

    TestProto proto = builder.build();
    assertEquals(5, proto.getRepeatedIntCount());
    assertEquals(13, proto.getRepeatedInt(0));
    assertEquals(24, proto.getRepeatedInt(1));
    assertEquals(-1, proto.getRepeatedInt(2));
    assertEquals(-2, proto.getRepeatedInt(3));
    assertEquals(-3, proto.getRepeatedInt(4));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedInt(5));
    } else {
      assertEquals(0, proto.getRepeatedInt(5));
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedInt(13)
            .addRepeatedInt(24)
            .addRepeatedInt(-1)
            .addRepeatedInt(-2)
            .addRepeatedInt(-3)
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedInt();
    assertEquals(0, builder.getRepeatedIntCount());
    assertEquals(0, builder.getRepeatedIntList().size());

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedIntCount());
    assertEquals(0, proto.getRepeatedIntList().size());
  }
}
