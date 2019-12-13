package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

import com.google.protobuf.ByteString;
import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import java.util.Arrays;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class ByteStringFieldsTest {

  private static final ByteString TEST_STRING = ByteString.copyFrom(new byte[] {1, 2, 3, 4});
  private static final ByteString DEFAULT_VALUE = ByteString.copyFromUtf8("a bytey default");

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertEquals(ByteString.EMPTY, TestProto.newBuilder().build().getOptionalBytes());
    assertFalse(TestProto.newBuilder().build().hasOptionalBytes());
  }

  @Test
  public void testOptionalFieldNoDefault_setTestBytes() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytes(TEST_STRING);
    assertTrue(builder.hasOptionalBytes());
    assertTrue(TEST_STRING.equals(builder.getOptionalBytes()));

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBytes());
    assertTrue(TEST_STRING.equals(proto.getOptionalBytes()));
  }

  @Test
  public void testOptionalFieldNoDefault_setEmptyBytes() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytes(ByteString.EMPTY);
    assertTrue(builder.hasOptionalBytes());
    assertEquals(ByteString.EMPTY, builder.getOptionalBytes());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBytes());
    assertEquals(ByteString.EMPTY, proto.getOptionalBytes());
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto startProto = TestProto.newBuilder().setOptionalBytes(TEST_STRING).build();

    TestProto.Builder builder = startProto.toBuilder();
    builder.clearOptionalBytes();
    assertFalse(builder.hasOptionalBytes());

    TestProto proto = builder.build();
    assertFalse(proto.hasOptionalBytes());
  }

  @Test
  public void testOptionalFieldWithDefault_defaultInstance() {
    assertEquals(DEFAULT_VALUE, TestProto.newBuilder().build().getOptionalBytesWithDefault());

    assertFalse(TestProto.newBuilder().build().hasOptionalBytesWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_setDefault() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytesWithDefault(DEFAULT_VALUE);
    assertTrue(builder.hasOptionalBytesWithDefault());
    assertEquals(DEFAULT_VALUE, builder.getOptionalBytesWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBytesWithDefault());
    assertEquals(DEFAULT_VALUE, proto.getOptionalBytesWithDefault());
  }

  @Test
  public void testOptionalFieldWithDefault_clear() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBytesWithDefault(TEST_STRING);
    assertTrue(builder.hasOptionalBytesWithDefault());
    assertEquals(TEST_STRING, builder.getOptionalBytesWithDefault());

    TestProto proto = builder.build();
    assertTrue(proto.hasOptionalBytesWithDefault());
    assertEquals(TEST_STRING, proto.getOptionalBytesWithDefault());
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertEquals(0, TestProto.newBuilder().build().getRepeatedBytesCount());
    assertEquals(0, TestProto.newBuilder().build().getRepeatedBytesList().size());
    assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedBytes(0));
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedBytes(TEST_STRING).addRepeatedBytes(ByteString.EMPTY);
    assertEquals(2, builder.getRepeatedBytesCount());
    assertThat(Arrays.asList(TEST_STRING, ByteString.EMPTY))
        .containsExactlyElementsIn(builder.getRepeatedBytesList())
        .inOrder();

    TestProto proto = builder.build();
    assertEquals(2, proto.getRepeatedBytesCount());
    assertThat(Arrays.asList(TEST_STRING, ByteString.EMPTY))
        .containsExactlyElementsIn(proto.getRepeatedBytesList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .build();

    TestProto.Builder builder =
        startProto
            .toBuilder()
            .addAllRepeatedBytes(
                Arrays.asList(
                    ByteString.copyFrom(new byte[] {1, 2, 3}),
                    ByteString.copyFrom(new byte[] {4, 5, 6}),
                    ByteString.copyFrom(new byte[] {7, 8, 9})));

    assertThat(
            Arrays.asList(
                TEST_STRING,
                ByteString.EMPTY,
                ByteString.copyFrom(new byte[] {1, 2, 3}),
                ByteString.copyFrom(new byte[] {4, 5, 6}),
                ByteString.copyFrom(new byte[] {7, 8, 9})))
        .containsExactlyElementsIn(builder.getRepeatedBytesList())
        .inOrder();

    TestProto proto = builder.build();

    assertThat(
            Arrays.asList(
                TEST_STRING,
                ByteString.EMPTY,
                ByteString.copyFrom(new byte[] {1, 2, 3}),
                ByteString.copyFrom(new byte[] {4, 5, 6}),
                ByteString.copyFrom(new byte[] {7, 8, 9})))
        .containsExactlyElementsIn(proto.getRepeatedBytesList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .addRepeatedBytes(ByteString.copyFrom(new byte[] {0, 0, 0}))
            .build();

    TestProto.Builder builder =
        startProto.toBuilder().setRepeatedBytes(2, ByteString.copyFrom(new byte[] {3, 3, 3}));

    assertThat(
            Arrays.asList(TEST_STRING, ByteString.EMPTY, ByteString.copyFrom(new byte[] {3, 3, 3})))
        .containsExactlyElementsIn(builder.getRepeatedBytesList())
        .inOrder();

    TestProto proto = builder.build();

    assertThat(
            Arrays.asList(TEST_STRING, ByteString.EMPTY, ByteString.copyFrom(new byte[] {3, 3, 3})))
        .containsExactlyElementsIn(proto.getRepeatedBytesList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .addRepeatedBytes(ByteString.EMPTY);

    assertEquals(3, builder.getRepeatedBytesCount());
    assertEquals(TEST_STRING, builder.getRepeatedBytes(0));
    assertEquals(ByteString.EMPTY, builder.getRepeatedBytes(1));
    assertEquals(ByteString.EMPTY, builder.getRepeatedBytes(2));
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedBytes(3));
    }

    TestProto proto = builder.build();
    assertEquals(3, proto.getRepeatedBytesCount());
    assertEquals(TEST_STRING, proto.getRepeatedBytes(0));
    assertEquals(ByteString.EMPTY, proto.getRepeatedBytes(1));
    assertEquals(ByteString.EMPTY, proto.getRepeatedBytes(2));

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedBytes(3));
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto startProto =
        TestProto.newBuilder()
            .addRepeatedBytes(TEST_STRING)
            .addRepeatedBytes(ByteString.EMPTY)
            .addRepeatedBytes(ByteString.copyFrom(new byte[] {0, 0, 0}))
            .build();

    TestProto.Builder builder = startProto.toBuilder().clearRepeatedBytes();
    assertEquals(0, builder.getRepeatedBytesCount());
    assertEquals(0, builder.getRepeatedBytesList().size());

    TestProto proto = builder.build();
    assertEquals(0, proto.getRepeatedBytesCount());
    assertEquals(0, proto.getRepeatedBytesList().size());
  }
}
