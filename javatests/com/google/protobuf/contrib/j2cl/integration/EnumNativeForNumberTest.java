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

import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto.NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Oneofs.TestProtoWithNativeOneOfs;
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto.Proto3NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Proto3Oneofs.Proto3TestProtoWithNativeOneOfs;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/** This tests {@code forNumber} behavior for native enums that differ from JVM version */
@RunWith(JUnit4.class)
@SuppressWarnings("TruthIncompatibleType") // intentional
public final class EnumNativeForNumberTest {

  @Test
  public void testNativeEnum() throws Exception {
    // Since this is a @JsEnum we are not applying filtering to unknown values, so we will see
    // unknown values leak into Java.
    assertThat(NativeEnum.forNumber(-1)).isEqualTo(-1.0);
    assertThat(NativeEnum.forNumber(100)).isEqualTo(100.0);
    assertThat(Proto3NativeEnum.forNumber(-1)).isEqualTo(-1.0);
    assertThat(Proto3NativeEnum.forNumber(100)).isEqualTo(100.0);
  }

  @Test
  public void testNativeOneofEnum() throws Exception {
    // This differs from the JVM version, which will return null for these cases.
    assertThat(TestProtoWithNativeOneOfs.AOneofCase.forNumber(-1)).isEqualTo(-1.0);
    assertThat(TestProtoWithNativeOneOfs.AOneofCase.forNumber(100)).isEqualTo(100.0);
    assertThat(Proto3TestProtoWithNativeOneOfs.AOneofCase.forNumber(-1)).isEqualTo(-1.0);
    assertThat(Proto3TestProtoWithNativeOneOfs.AOneofCase.forNumber(100)).isEqualTo(100.0);
  }
}
