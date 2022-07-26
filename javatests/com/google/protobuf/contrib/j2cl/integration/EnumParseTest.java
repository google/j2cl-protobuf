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

import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto;
import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto.NativeEnum;
import com.google.protobuf.contrib.j2cl.protos.Enums.EnumTestProto.TestEnum;
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto;
import com.google.protobuf.contrib.j2cl.protos.Proto3Enums.Proto3EnumTestProto.Proto3TestEnum;
import com.google.protobuf.contrib.j2cl.protos.Proto3EnumsWithProto2.Proto2TestProto;
import jsinterop.annotations.JsMethod;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class EnumParseTest {

  // Since we currently have no way to instantiate a J2CL proto in Java code we simply use the
  // Js method here.
  @JsMethod(namespace = "improto.protobuf.contrib.j2cl.protos.EnumTestProto")
  private static native EnumTestProto parse(String json);

  // Since we currently have no way to instantiate a J2CL proto in Java code we simply use the
  // Js method here.
  @JsMethod(namespace = "improto.protobuf.contrib.j2cl.protos.Proto3EnumTestProto", name = "parse")
  private static native Proto3EnumTestProto parseProto3(String json);

  // Since we currently have no way to instantiate a J2CL proto in Java code we simply use the
  // Js method here.
  @JsMethod(namespace = "improto.protobuf.contrib.j2cl.protos.Proto2TestProto", name = "parse")
  private static native Proto2TestProto parseProto2(String json);

  @Test
  public void testParse() throws Exception {
    assertThat(parse("[2]").getOptionalEnum()).isEqualTo(TestEnum.TWO);
    assertThat(parse("[null,2]").getOptionalEnumWithDefault()).isEqualTo(TestEnum.TWO);
    assertThat(parse("[null,null,[2]]").getRepeatedEnumList()).containsExactly(TestEnum.TWO);
    assertThat(parse("[null,null,null,2]").getOptionalNativeEnum())
        .isEqualTo(NativeEnum.NATIVE_TWO);
    assertThat(parse("[null,null,null,null,[2]]").getRepeatedNativeEnumList())
        .containsExactly(NativeEnum.NATIVE_TWO);
  }

  @Test
  public void testParse_unsetValue() throws Exception {
    assertThat(parse("[]").getOptionalEnum()).isEqualTo(TestEnum.DEFAULT);
    assertThat(parse("[]").getOptionalEnumWithDefault()).isEqualTo(TestEnum.ONE);
    assertThat(parse("[]").getRepeatedEnumList()).isEmpty();
    assertThat(parse("[]").getOptionalNativeEnum()).isEqualTo(NativeEnum.NATIVE_DEFAULT);
    assertThat(parse("[]").getRepeatedNativeEnumList()).isEmpty();
  }

  @Test
  @SuppressWarnings("TruthIncompatibleType") // intentional
  public void testParse_unknownValue() throws Exception {
    assertThat(parse("[-1]").getOptionalEnum()).isEqualTo(TestEnum.DEFAULT);
    assertThat(parse("[100]").getOptionalEnum()).isEqualTo(TestEnum.DEFAULT);
    assertThat(parse("[null,-1]").getOptionalEnumWithDefault()).isEqualTo(TestEnum.ONE);
    assertThat(parse("[null,100]").getOptionalEnumWithDefault()).isEqualTo(TestEnum.ONE);
    assertThat(parse("[null,null,[-1]]").getRepeatedEnumList())
        .containsExactly(TestEnum.DEFAULT)
        .inOrder();
    assertThat(parse("[null,null,[100]]").getRepeatedEnumList())
        .containsExactly(TestEnum.DEFAULT)
        .inOrder();
    assertThat(parseProto3("[-1]").getOptionalEnum()).isEqualTo(Proto3TestEnum.UNRECOGNIZED);
    assertThat(parseProto3("[100]").getOptionalEnum()).isEqualTo(Proto3TestEnum.UNRECOGNIZED);
    assertThat(parseProto3("[null,[-1]]").getRepeatedEnumList())
        .containsExactly(Proto3TestEnum.UNRECOGNIZED)
        .inOrder();
    assertThat(parseProto3("[null,[100]]").getRepeatedEnumList())
        .containsExactly(Proto3TestEnum.UNRECOGNIZED)
        .inOrder();

    // Since these are @JsEnum we are not applying filtering to unknown values, so we will see
    // unknown values leak into Java.
    assertThat(parse("[null,null,null,-1]").getOptionalNativeEnum()).isEqualTo(-1.0);
    assertThat(parse("[null,null,null,100]").getOptionalNativeEnum()).isEqualTo(100.0);
    assertThat(parse("[null,null,null,null,[-1]]").getRepeatedNativeEnumList())
        .containsExactly(-1.0)
        .inOrder();
    assertThat(parse("[null,null,null,null,[100]]").getRepeatedNativeEnumList())
        .containsExactly(100.0)
        .inOrder();
    assertThat(parseProto3("[null,null,-1]").getOptionalNativeEnum()).isEqualTo(-1.0);
    assertThat(parseProto3("[null,null,100]").getOptionalNativeEnum()).isEqualTo(100.0);
    assertThat(parseProto3("[null,null,null,[-1]]").getRepeatedNativeEnumList())
        .containsExactly(-1.0)
        .inOrder();
    assertThat(parseProto3("[null,null,null,[100]]").getRepeatedNativeEnumList())
        .containsExactly(100.0)
        .inOrder();

    assertThat(parseProto2("[-1]").getOptionalProto3Enum()).isEqualTo(Proto3TestEnum.DEFAULT);
    assertThat(parseProto2("[100]").getOptionalProto3Enum()).isEqualTo(Proto3TestEnum.DEFAULT);
    assertThat(parseProto2("[null,[-1]]").getRepeatedProto3EnumList())
        .containsExactly(Proto3TestEnum.DEFAULT)
        .inOrder();
    assertThat(parseProto2("[null,[100]]").getRepeatedProto3EnumList())
        .containsExactly(Proto3TestEnum.DEFAULT)
        .inOrder();
  }
}
