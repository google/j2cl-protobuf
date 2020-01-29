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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import com.google.protos.protobuf.contrib.j2cl.protos.Oneofs.TestProtoWithNativeOneOfs;
import com.google.protos.protobuf.contrib.j2cl.protos.Oneofs.TestProtoWithOneOfs;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class OneOfsTest {

  @Test
  public void testNothingSet() {
    TestProtoWithOneOfs.Builder builder = TestProtoWithOneOfs.newBuilder().setRequiredString("str");
    TestProtoWithOneOfs proto = builder.build();

    assertEquals("str", proto.getRequiredString());
    assertEquals("str", builder.getRequiredString());
    assertEquals(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());
    assertEquals(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, builder.getAOneofCase());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, proto.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, builder.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  @Test
  public void testNothingSetNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder = TestProtoWithNativeOneOfs.newBuilder();
    TestProtoWithNativeOneOfs proto = builder.build();

    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());
    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET, builder.getAOneofCase());
  }

  @Test
  public void testSingleFieldSet() {
    TestProtoWithOneOfs.Builder builder =
        TestProtoWithOneOfs.newBuilder()
            .setRequiredString("str")
            .setABool(true); // member of a_oneof
    TestProtoWithOneOfs proto = builder.build();

    assertEquals(TestProtoWithOneOfs.AOneofCase.A_BOOL, proto.getAOneofCase());
    assertEquals(TestProtoWithOneOfs.AOneofCase.A_BOOL, builder.getAOneofCase());
    assertTrue(proto.getABool());
    assertTrue(builder.getABool());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, proto.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, builder.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  @Test
  public void testSingleFieldSetNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder().setAFloat(2.5f); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT, proto.getAOneofCase());
    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT, builder.getAOneofCase());
    assertEquals(2.5f, proto.getAFloat(), 0.0001f);
    assertEquals(2.5f, builder.getAFloat(), 0.0001f);
  }

  @Test
  public void testSingleFieldSetThenCleared() {
    TestProtoWithOneOfs.Builder builder =
        TestProtoWithOneOfs.newBuilder()
            .setRequiredString("str")
            .setABool(true) // member of a_oneof
            .clearABool(); // member of a_oneof
    TestProtoWithOneOfs proto = builder.build();

    assertEquals("str", proto.getRequiredString());
    assertEquals("str", builder.getRequiredString());
    assertEquals(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());
    assertEquals(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, builder.getAOneofCase());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, proto.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, builder.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  @Test
  public void testSingleFieldSetThenClearedNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder()
            .setAFloat(2.5f) // member of a_oneof
            .clearAFloat(); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());
    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET, builder.getAOneofCase());
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

    assertEquals(TestProtoWithOneOfs.AOneofCase.A_FLOAT, proto.getAOneofCase());
    assertEquals(TestProtoWithOneOfs.AOneofCase.A_FLOAT, builder.getAOneofCase());
    assertEquals(2.5f, proto.getAFloat(), 0.0001f);
    assertEquals(2.5f, builder.getAFloat(), 0.0001f);

    assertFalse(proto.hasDoubleWithDefault());
    assertFalse(builder.hasDoubleWithDefault());
    assertEquals(2.46 /* default value */, proto.getDoubleWithDefault(), 0.0001);
    assertEquals(2.46 /* default value */, builder.getDoubleWithDefault(), 0.0001);

    assertFalse(proto.hasABool());
    assertFalse(builder.hasABool());
    assertEquals(false /* default value */, proto.getABool());
    assertEquals(false /* default value */, builder.getABool());

    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, proto.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, builder.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  @Test
  public void testMultipleFieldsSetNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder()
            .setADouble(0) // member of a_oneof
            .setAFloat(2.5f); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT, proto.getAOneofCase());
    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.A_FLOAT, builder.getAOneofCase());

    assertEquals(2.5f, proto.getAFloat(), 0.0001f);
    assertEquals(2.5f, builder.getAFloat(), 0.0001f);
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

    assertEquals(TestProtoWithOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());

    assertFalse(proto.hasAFloat());
    assertEquals(0f /* default value */, proto.getAFloat(), 0.0001f);

    assertFalse(proto.hasDoubleWithDefault());
    assertEquals(2.46 /* default value */, proto.getDoubleWithDefault(), 0.0001);

    assertFalse(proto.hasABool());
    assertEquals(false /* default value */, proto.getABool());

    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, proto.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.AnotherOneofCase.ANOTHERONEOF_NOT_SET, builder.getAnotherOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        proto.getNestedProtoWithOneofs().getANestedOneofCase());
    assertEquals(
        TestProtoWithOneOfs.TestNestedProtoWithOneOfs.ANestedOneofCase.ANESTEDONEOF_NOT_SET,
        builder.getNestedProtoWithOneofs().getANestedOneofCase());
  }

  @Test
  public void testMultipleFieldsSetThenClearedNativeEnum() {
    TestProtoWithNativeOneOfs.Builder builder =
        TestProtoWithNativeOneOfs.newBuilder()
            .setADouble(0) // member of a_oneof
            .setAFloat(2.5f) // member of a_oneof
            .clearAFloat(); // member of a_oneof
    TestProtoWithNativeOneOfs proto = builder.build();

    assertEquals(TestProtoWithNativeOneOfs.AOneofCase.AONEOF_NOT_SET, proto.getAOneofCase());

    assertFalse(proto.hasAFloat());
    assertEquals(0f /* default value */, proto.getAFloat(), 0.0001f);

    assertFalse(proto.hasADouble());
    assertEquals(0.0 /* default value */, proto.getADouble(), 0.0001);
  }

  @Test
  public void testForNumberWithUnknownValue() {
    assertNull(TestProtoWithOneOfs.AOneofCase.forNumber(100));
  }

  // Unknown values with native oneof case enums are tested in EnumGenerationTest since the behavior
  // differs between J2CL and JVM.
}
