package com.google.protobuf.contrib.j2cl.integration;

import static org.junit.Assert.assertEquals;

import com.google.protobuf.contrib.j2cl.protos.Sparse.DenseEnum;
import com.google.protobuf.contrib.j2cl.protos.Sparse.NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Sparse.SparseEnum;
import com.google.protobuf.contrib.j2cl.protos.Sparse.TestProto;
import jsinterop.annotations.JsType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class EnumGenerationTest {

  // Since we currently have no way to instantiate a J2CL proto in Java code we simply use the
  // Js method here.
  @JsType(isNative = true, name = "TestProto", namespace = "improto.protobuf.contrib.j2cl.protos")
  private static class LocalTestProto {
    public static native TestProto parse(String json);
  }

  @Test
  public void testSparse_unknownValue() throws Exception {
    assertEquals(SparseEnum.UNKNOWN, LocalTestProto.parse("[2]").getSparseEnum());
    assertEquals(SparseEnum.UNKNOWN, LocalTestProto.parse("[-1]").getSparseEnum());
    assertEquals(SparseEnum.UNKNOWN, LocalTestProto.parse("[100]").getSparseEnum());
  }

  @Test
  public void testSparse_knownValues() throws Exception {
    assertEquals(SparseEnum.TEN, LocalTestProto.parse("[10]").getSparseEnum());
    assertEquals(SparseEnum.TWENTY, LocalTestProto.parse("[20]").getSparseEnum());
  }

  @Test
  public void testDense_unknownValue() throws Exception {
    assertEquals(DenseEnum.DEFAULT, LocalTestProto.parse("[null, -1]").getDenseEnum());
    assertEquals(DenseEnum.DEFAULT, LocalTestProto.parse("[null, 7]").getDenseEnum());
  }

  @Test
  public void testDense_knownValues() throws Exception {
    assertEquals(DenseEnum.DEFAULT, LocalTestProto.parse("[null, 0]").getDenseEnum());
    assertEquals(DenseEnum.ONE, LocalTestProto.parse("[null, 1]").getDenseEnum());
    assertEquals(DenseEnum.TWO, LocalTestProto.parse("[null, 2]").getDenseEnum());
    assertEquals(DenseEnum.THREE, LocalTestProto.parse("[null, 3]").getDenseEnum());
    assertEquals(DenseEnum.FOUR, LocalTestProto.parse("[null, 4]").getDenseEnum());
    assertEquals(DenseEnum.FIVE, LocalTestProto.parse("[null, 5]").getDenseEnum());
    assertEquals(DenseEnum.SIX, LocalTestProto.parse("[null, 6]").getDenseEnum());
  }

  @Test
  public void testNativeEnum_knownValues() throws Exception {
    assertEquals(NativeEnum.NATIVE_ONE, LocalTestProto.parse("[null, null, 1]").getNativeEnum());
    assertEquals(NativeEnum.NATIVE_TWO, LocalTestProto.parse("[null, null, 2]").getNativeEnum());
    assertEquals(NativeEnum.NATIVE_THREE, LocalTestProto.parse("[null, null, 3]").getNativeEnum());
  }

  @Test
  public void testNativeEnum_unknownValues() throws Exception {
    // Since this is a @JsEnum we are not applying filtering to unknown values, so we will see
    // unknown values leak into Java.
    assertEquals(-1, LocalTestProto.parse("[null, null, -1]").getNativeEnum().getNumber());
    assertEquals(10, LocalTestProto.parse("[null, null, 10]").getNativeEnum().getNumber());
  }
}
