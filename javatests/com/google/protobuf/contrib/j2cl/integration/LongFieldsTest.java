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
public class LongFieldsTest {

  private static final long DEFAULT_PROTO_VALUE = 3000000000L;

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertFalse(TestProto.newBuilder().build().hasOptionalLong());
    assertEquals(0L, TestProto.newBuilder().build().getOptionalLong());
  }

  @Test
  public void testOptionalFieldNoDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalLong(8964L);
    assertTrue(builder.hasOptionalLong());
    assertEquals(8964L, builder.getOptionalLong());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalLong());
    assertEquals(8964L, proto.getOptionalLong());
  }

  @Test
  public void testOptionalFieldNoDefault_setDefaultValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalLong(0L);
    assertTrue(builder.hasOptionalLong());
    assertEquals(0L, builder.getOptionalLong());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalLong());
    assertEquals(0L, proto.getOptionalLong());
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalLong(0L).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalLong();
    assertFalse(builder.hasOptionalLong());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalLong());
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertFalse(TestProto.newBuilder().build().hasOptionalLongWithDefault());
    assertEquals(DEFAULT_PROTO_VALUE, TestProto.newBuilder().build().getOptionalLongWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setValue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalLongWithDefault(-4000000000L);
    assertTrue(builder.hasOptionalLongWithDefault());
    assertEquals(-4000000000L, builder.getOptionalLongWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalLongWithDefault());
    assertEquals(-4000000000L, proto.getOptionalLongWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setDefaultValue() {
    TestProto.Builder builder =
        TestProto.newBuilder().setOptionalLongWithDefault(DEFAULT_PROTO_VALUE);
    assertTrue(builder.hasOptionalLongWithDefault());
    assertEquals(DEFAULT_PROTO_VALUE, builder.getOptionalLongWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalLongWithDefault());
    assertEquals(DEFAULT_PROTO_VALUE, proto.getOptionalLongWithDefault());
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedLongCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedLongList().size());
    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedLong(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedLong(13L).addRepeatedLong(24000000000L);
    assertThat(Arrays.asList(13L, 24000000000L))
        .containsExactlyElementsIn(builder.getRepeatedLongList())
        .inOrder();

    TestProto proto = builder.build();

    assertThat(Arrays.asList(13L, 24000000000L))
        .containsExactlyElementsIn(proto.getRepeatedLongList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder().addRepeatedLong(13L).addRepeatedLong(24000000000L).build();

    TestProto.Builder builder =
        startProto.toBuilder().addAllRepeatedLong(Arrays.asList(-1L, -2L, -3L));

    assertThat(Arrays.asList(13L, 24000000000L, -1L, -2L, -3L))
        .containsExactlyElementsIn(builder.getRepeatedLongList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13L, 24000000000L, -1L, -2L, -3L))
        .containsExactlyElementsIn(proto.getRepeatedLongList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedLong(13L)
            .addRepeatedLong(24000000000L)
            .addRepeatedLong(-1L)
            .addRepeatedLong(-2L)
            .addRepeatedLong(-3L)
            .build();

    TestProto.Builder builder = startProto.toBuilder().setRepeatedLong(2, 333L);
    assertThat(Arrays.asList(13L, 24000000000L, 333L, -2L, -3L))
        .containsExactlyElementsIn(builder.getRepeatedLongList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(13L, 24000000000L, 333L, -2L, -3L))
        .containsExactlyElementsIn(proto.getRepeatedLongList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedLong(13L)
            .addRepeatedLong(24000000000L)
            .addRepeatedLong(-1L)
            .addRepeatedLong(-2L)
            .addRepeatedLong(-3L);

    assertEquals(5, builder.getRepeatedLongCount());
    assertEquals(13L, builder.getRepeatedLong(0));
    assertEquals(24000000000L, builder.getRepeatedLong(1));
    assertEquals(-1L, builder.getRepeatedLong(2));
    assertEquals(-2L, builder.getRepeatedLong(3));
    assertEquals(-3L, builder.getRepeatedLong(4));
    assertThrows(Exception.class, () -> builder.getRepeatedLong(5));

    TestProto proto = builder.build();
    assertEquals(5, proto.getRepeatedLongCount());
    assertEquals(13L, proto.getRepeatedLong(0));
    assertEquals(24000000000L, proto.getRepeatedLong(1));
    assertEquals(-1L, proto.getRepeatedLong(2));
    assertEquals(-2L, proto.getRepeatedLong(3));
    assertEquals(-3L, proto.getRepeatedLong(4));
    assertThrows(Exception.class, () -> proto.getRepeatedLong(5));
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedLong(13L)
            .addRepeatedLong(24000000000L)
            .addRepeatedLong(-1L)
            .addRepeatedLong(-2L)
            .addRepeatedLong(-3L)
            .build();
    TestProto.Builder builder = startProto.toBuilder().clearRepeatedLong();
    assertEquals(0, builder.getRepeatedLongCount());
    assertEquals(0, builder.getRepeatedLongList().size());

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedLongCount());
    assertEquals(0, proto.getRepeatedLongList().size());
  }
}
