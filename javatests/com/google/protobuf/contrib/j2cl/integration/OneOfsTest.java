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
import static org.junit.Assert.assertEquals;

import com.google.protobuf.contrib.j2cl.protos.Oneofs.TestProtoWithNativeOneOfs;
import com.google.protobuf.contrib.j2cl.protos.Oneofs.TestProtoWithOneOfs;
import com.google.protobuf.contrib.j2cl.protos.Proto3Oneofs.Proto3TestProtoWithNativeOneOfs;
import com.google.protobuf.contrib.j2cl.protos.Proto3Oneofs.Proto3TestProtoWithOneOfs;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class OneOfsTest {

  @Test
  public void testNothingSet() {
    TestProtoWithOneOfs.Builder builder = TestProtoWithOneOfs.newBuilder().setRequiredString("str");
    TestProtoWithOneOfs proto = builder.build();

    assertThat(proto.getRequiredString()).isEqualTo("str");
    assertThat(builder.getRequiredString()).isEqualTo("str");
    assertThat(proto.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(builder.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(proto.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(builder.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(proto.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
    assertThat(builder.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
  }

  @Test
  public void testNothingSetNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder = TestProtoWithNativeOneOfs.newBuilder();
    TestProtoWithNativeOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase())
        .isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(builder.getAOneofCase())
        .isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET);
  }

  @Test
  public void testNothingSetProto3() {
    Proto3TestProtoWithOneOfs.Builder builder = Proto3TestProtoWithOneOfs.newBuilder();
    Proto3TestProtoWithOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase())
        .isEqualTo(Proto3TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(builder.getAOneofCase())
        .isEqualTo(Proto3TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(proto.getAnotherOneofCase())
        .isEqualTo(Proto3TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(builder.getAnotherOneofCase())
        .isEqualTo(Proto3TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(proto.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            Proto3TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
                .ANESTEDONEOF_NOT_SET);
    assertThat(builder.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            Proto3TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase
                .ANESTEDONEOF_NOT_SET);
  }

  @Test
  public void testNothingSetProto3NativeEnum() {
    Proto3TestProtoWithNativeOneOfs.Builder builder = Proto3TestProtoWithNativeOneOfs.newBuilder();
    Proto3TestProtoWithNativeOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase())
        .isEqualTo(Proto3TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(builder.getAOneofCase())
        .isEqualTo(Proto3TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET);
  }

  @Test
  public void testSingleFieldSet() {
    TestProtoWithOneOfs.Builder builder =
        TestProtoWithOneOfs.newBuilder()
            .setRequiredString("str")
            .setABool(true); // member of a_oneof
    TestProtoWithOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.A_BOOL);
    assertThat(builder.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.A_BOOL);
    assertThat(proto.getABool()).isTrue();
    assertThat(builder.getABool()).isTrue();
    assertThat(proto.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(builder.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(proto.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
    assertThat(builder.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
  }

  @Test
  public void testSingleFieldSetNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder().setAFloat(2.5f); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase()).isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT);
    assertThat(builder.getAOneofCase()).isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT);
    assertThat(proto.getAFloat()).isWithin(0.0001f).of(2.5f);
    assertThat(builder.getAFloat()).isWithin(0.0001f).of(2.5f);
  }

  @Test
  public void testSingleFieldSetThenCleared() {
    TestProtoWithOneOfs.Builder builder =
        TestProtoWithOneOfs.newBuilder()
            .setRequiredString("str")
            .setABool(true) // member of a_oneof
            .clearABool(); // member of a_oneof
    TestProtoWithOneOfs proto = builder.build();

    assertThat(proto.getRequiredString()).isEqualTo("str");
    assertThat(builder.getRequiredString()).isEqualTo("str");
    assertThat(proto.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(builder.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(proto.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(builder.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(proto.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
    assertThat(builder.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
  }

  @Test
  public void testSingleFieldSetThenClearedNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder()
            .setAFloat(2.5f) // member of a_oneof
            .clearAFloat(); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase())
        .isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET);
    assertThat(builder.getAOneofCase())
        .isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET);
  }

  @Test
  public void testMultipleFieldsSet() {
    TestProtoWithOneOfs.Builder builder =
        TestProtoWithOneOfs.newBuilder()
            .setRequiredString("str")
            .setABool(true) // member of a_oneof
            .setDoubleWithDefault(0) // member of a_oneof
            .setAFloat(2.5f); // member of a_oneof
    TestProtoWithOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.A_FLOAT);
    assertThat(builder.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.A_FLOAT);
    assertThat(proto.getAFloat()).isWithin(0.0001f).of(2.5f);
    assertThat(builder.getAFloat()).isWithin(0.0001f).of(2.5f);

    assertThat(proto.hasDoubleWithDefault()).isFalse();
    assertThat(builder.hasDoubleWithDefault()).isFalse();
    assertEquals(2.46 /* default value */, proto.getDoubleWithDefault(), 0.0001);
    assertEquals(2.46 /* default value */, builder.getDoubleWithDefault(), 0.0001);

    assertThat(proto.hasABool()).isFalse();
    assertThat(builder.hasABool()).isFalse();
    assertEquals(false /* default value */, proto.getABool());
    assertEquals(false /* default value */, builder.getABool());

    assertThat(proto.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(builder.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(proto.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
    assertThat(builder.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
  }

  @Test
  public void testMultipleFieldsSetNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder()
            .setADouble(0) // member of a_oneof
            .setAFloat(2.5f); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase()).isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT);
    assertThat(builder.getAOneofCase()).isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT);

    assertThat(proto.getAFloat()).isWithin(0.0001f).of(2.5f);
    assertThat(builder.getAFloat()).isWithin(0.0001f).of(2.5f);
  }

  @Test
  public void testMultipleFieldsSetThenCleared() {
    TestProtoWithOneOfs.Builder builder =
        TestProtoWithOneOfs.newBuilder()
            .setRequiredString("str")
            .setABool(true) // member of a_oneof
            .setDoubleWithDefault(0) // member of a_oneof
            .setAFloat(2.5f) // member of a_oneof
            .clearAFloat(); // member of a_oneof
    TestProtoWithOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase()).isEqualTo(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET);

    assertThat(proto.hasAFloat()).isFalse();
    assertEquals(0f /* default value */, proto.getAFloat(), 0.0001f);

    assertThat(proto.hasDoubleWithDefault()).isFalse();
    assertEquals(2.46 /* default value */, proto.getDoubleWithDefault(), 0.0001);

    assertThat(proto.hasABool()).isFalse();
    assertEquals(false /* default value */, proto.getABool());

    assertThat(proto.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(builder.getAnotherOneofCase())
        .isEqualTo(TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET);
    assertThat(proto.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
    assertThat(builder.getNestedProtoWithOneofs().getANestedOneofCase())
        .isEqualTo(
            TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET);
  }

  @Test
  public void testMultipleFieldsSetThenClearedNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder()
            .setADouble(0) // member of a_oneof
            .setAFloat(2.5f) // member of a_oneof
            .clearAFloat(); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertThat(proto.getAOneofCase())
        .isEqualTo(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET);

    assertThat(proto.hasAFloat()).isFalse();
    assertEquals(0f /* default value */, proto.getAFloat(), 0.0001f);

    assertThat(proto.hasADouble()).isFalse();
    assertEquals(0.0 /* default value */, proto.getADouble(), 0.0001);
  }

  @Test
  public void testForNumberWithUnknownValue() {
    assertThat(TestProtoWithOneOfs.AOneofCase.forNumber(100)).isNull();
    assertThat(Proto3TestProtoWithOneOfs.AOneofCase.forNumber(100)).isNull();
    // Unknown values with native oneof cases are tested in EnumNativeForNumberTest since the
    // behavior differs between J2CL and JVM.
  }
}
