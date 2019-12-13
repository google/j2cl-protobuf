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
public class BooleanFieldsTest {

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertFalse(TestProto.newBuilder().build().hasOptionalBool());
    assertFalse(TestProto.newBuilder().build().getOptionalBool());
  }

  @Test
  public void testOptionalFieldNoDefault_setTrue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBool(true);
    assertTrue(builder.hasOptionalBool());
    assertTrue(builder.getOptionalBool());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBool());
    assertTrue(proto.getOptionalBool());
  }

  @Test
  public void testOptionalFieldNoDefault_setFalse() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBool(false);
    assertTrue(builder.hasOptionalBool());
    assertFalse(builder.getOptionalBool());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBool());
    assertFalse(proto.getOptionalBool());
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBool(true);
    builder.clearOptionalBool();
    assertFalse(builder.hasOptionalBool());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalBool());
  }

  @Test
  public void testOptionalFieldWithDefault_setTrue() {
    assertTrue(TestProto.newBuilder().build().getOptionalBoolWithDefault());

    TestProto.Builder builder = TestProto.newBuilder().setOptionalBoolWithDefault(true);
    assertTrue(builder.getOptionalBoolWithDefault());
    assertTrue(builder.hasOptionalBoolWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBoolWithDefault());
    assertTrue(proto.getOptionalBoolWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setFalse() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBoolWithDefault(false);
    assertTrue(builder.hasOptionalBoolWithDefault());
    assertFalse(builder.getOptionalBoolWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBoolWithDefault());
    assertFalse(proto.getOptionalBoolWithDefault());
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedBoolCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedBoolList().size());

    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedBool(3));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder = TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false);
    assertThat(Arrays.asList(true, false))
        .containsExactlyElementsIn(builder.getRepeatedBoolList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(true, false))
        .containsExactlyElementsIn(proto.getRepeatedBoolList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto proto = TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false).build();

    TestProto.Builder builder =
        proto.toBuilder().addAllRepeatedBool(Arrays.asList(false, true, true));
    assertThat(Arrays.asList(true, false, false, true, true))
        .containsExactlyElementsIn(builder.getRepeatedBoolList())
        .inOrder();

    TestProto proto2 = builder.build();
    assertThat(Arrays.asList(true, false, false, true, true))
        .containsExactlyElementsIn(proto2.getRepeatedBoolList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto proto =
        TestProto.newBuilder()
            .addRepeatedBool(true)
            .addRepeatedBool(false)
            .addRepeatedBool(false)
            .build();

    TestProto.Builder builder = proto.toBuilder().setRepeatedBool(2, true);
    assertThat(Arrays.asList(true, false, true))
        .containsExactlyElementsIn(builder.getRepeatedBoolList())
        .inOrder();

    TestProto proto2 = builder.build();
    assertThat(Arrays.asList(true, false, true))
        .containsExactlyElementsIn(proto2.getRepeatedBoolList().toArray())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false).addRepeatedBool(false);

    assertEquals(3, builder.getRepeatedBoolCount());
    assertTrue(builder.getRepeatedBool(0));
    assertFalse(builder.getRepeatedBool(1));
    assertFalse(builder.getRepeatedBool(2));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedBool(3));
    } else {
      assertFalse(builder.getRepeatedBool(3));
    }

    TestProto proto = builder.build();
    assertEquals(3, proto.getRepeatedBoolCount());
    assertTrue(proto.getRepeatedBool(0));
    assertFalse(proto.getRepeatedBool(1));
    assertFalse(proto.getRepeatedBool(2));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedBool(3));
    } else {
      assertFalse(proto.getRepeatedBool(3));
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto proto = TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false).build();

    TestProto.Builder builder = proto.toBuilder().clearRepeatedBool();
    assertEquals(0, builder.getRepeatedBoolCount());
    assertEquals(0, builder.getRepeatedBoolList().size());

    TestProto proto2 = builder.build();
    assertEquals(0, proto2.getRepeatedBoolCount());
    assertEquals(0, proto2.getRepeatedBoolList().size());
  }
}
