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

import com.google.protobuf.contrib.j2cl.protos.Sparse.DenseEnum;
import com.google.protobuf.contrib.j2cl.protos.Sparse.NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Sparse.SparseEnum;
import com.google.protobuf.contrib.j2cl.protos.Sparse.TestProto;
import com.google.protos.protobuf.contrib.j2cl.protos.Oneofs.TestProtoWithNativeOneOfs;
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
    assertThat(LocalTestProto.parse("[2]").getSparseEnum()).isEqualTo(SparseEnum.UNKNOWN);
    assertThat(LocalTestProto.parse("[-1]").getSparseEnum()).isEqualTo(SparseEnum.UNKNOWN);
    assertThat(LocalTestProto.parse("[100]").getSparseEnum()).isEqualTo(SparseEnum.UNKNOWN);
  }

  @Test
  public void testSparse_knownValues() throws Exception {
    assertThat(LocalTestProto.parse("[10]").getSparseEnum()).isEqualTo(SparseEnum.TEN);
    assertThat(LocalTestProto.parse("[20]").getSparseEnum()).isEqualTo(SparseEnum.TWENTY);
  }

  @Test
  public void testDense_unknownValue() throws Exception {
    assertThat(LocalTestProto.parse("[null, -1]").getDenseEnum()).isEqualTo(DenseEnum.DEFAULT);
    assertThat(LocalTestProto.parse("[null, 7]").getDenseEnum()).isEqualTo(DenseEnum.DEFAULT);
  }

  @Test
  public void testDense_knownValues() throws Exception {
    assertThat(LocalTestProto.parse("[null, 0]").getDenseEnum()).isEqualTo(DenseEnum.DEFAULT);
    assertThat(LocalTestProto.parse("[null, 1]").getDenseEnum()).isEqualTo(DenseEnum.ONE);
    assertThat(LocalTestProto.parse("[null, 2]").getDenseEnum()).isEqualTo(DenseEnum.TWO);
    assertThat(LocalTestProto.parse("[null, 3]").getDenseEnum()).isEqualTo(DenseEnum.THREE);
    assertThat(LocalTestProto.parse("[null, 4]").getDenseEnum()).isEqualTo(DenseEnum.FOUR);
    assertThat(LocalTestProto.parse("[null, 5]").getDenseEnum()).isEqualTo(DenseEnum.FIVE);
    assertThat(LocalTestProto.parse("[null, 6]").getDenseEnum()).isEqualTo(DenseEnum.SIX);
  }

  @Test
  public void testNativeEnum_knownValues() throws Exception {
    assertThat(LocalTestProto.parse("[null, null, 1]").getNativeEnum())
        .isEqualTo(NativeEnum.NATIVE_ONE);
    assertThat(LocalTestProto.parse("[null, null, 2]").getNativeEnum())
        .isEqualTo(NativeEnum.NATIVE_TWO);
    assertThat(LocalTestProto.parse("[null, null, 3]").getNativeEnum())
        .isEqualTo(NativeEnum.NATIVE_THREE);
  }

  @Test
  public void testNativeEnum_unknownValues() throws Exception {
    // Since this is a @JsEnum we are not applying filtering to unknown values, so we will see
    // unknown values leak into Java.
    assertThat(LocalTestProto.parse("[null, null, -1]").getNativeEnum().getNumber()).isEqualTo(-1);
    assertThat(LocalTestProto.parse("[null, null, 10]").getNativeEnum().getNumber()).isEqualTo(10);
  }

  @Test
  public void testNativeOneofEnum_unknownValues() throws Exception {
    // This differs from the JVM version, which will return null for these cases.
    assertThat(TestProtoWithNativeOneOfs.AOneofCase.forNumber(-1)).isEqualTo(-1.0);
    assertThat(TestProtoWithNativeOneOfs.AOneofCase.forNumber(100)).isEqualTo(100.0);
  }
}
