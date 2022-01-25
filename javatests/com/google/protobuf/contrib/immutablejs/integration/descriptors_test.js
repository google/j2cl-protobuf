// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.module('proto.im.integration.DescriptorsTest');
goog.setTestOnly();

const Base = goog.require('improto.protobuf.contrib.immutablejs.protos.Base');
const MapTestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.MapTestProto');
/** @suppress {extraRequire} Required extension registration. */
const Primitives = goog.require('improto.protobuf.contrib.immutablejs.protos.Primitives');
/** @suppress {extraRequire} Required extension registration. */
const Recursive = goog.require('improto.protobuf.contrib.immutablejs.protos.Recursive');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {FieldType} = goog.require('proto.im.descriptor');

class DescriptorsTest {
  testFieldTypes() {
    const fields = TestProto.getDescriptor().fields();

    assertEquals(FieldType.BOOL, fields[1].fieldType);
    assertEquals(FieldType.BOOL, fields[2].fieldType);
    assertEquals(FieldType.BOOL, fields[3].fieldType);

    assertEquals(FieldType.INT32, fields[4].fieldType);
    assertEquals(FieldType.INT32, fields[5].fieldType);
    assertEquals(FieldType.INT32, fields[6].fieldType);

    assertEquals(FieldType.INT64, fields[7].fieldType);
    assertEquals(FieldType.INT64, fields[8].fieldType);
    assertEquals(FieldType.INT64, fields[9].fieldType);
    assertEquals(FieldType.INT64, fields[50].fieldType);
    assertEquals(FieldType.INT64, fields[51].fieldType);
    assertEquals(FieldType.INT64, fields[52].fieldType);
    assertEquals(FieldType.INT64, fields[53].fieldType);

    assertEquals(FieldType.FLOAT, fields[10].fieldType);
    assertEquals(FieldType.FLOAT, fields[11].fieldType);
    assertEquals(FieldType.FLOAT, fields[12].fieldType);

    assertEquals(FieldType.DOUBLE, fields[13].fieldType);
    assertEquals(FieldType.DOUBLE, fields[14].fieldType);
    assertEquals(FieldType.DOUBLE, fields[15].fieldType);

    assertEquals(FieldType.ENUM, fields[16].fieldType);
    assertEquals(FieldType.ENUM, fields[17].fieldType);
    assertEquals(FieldType.ENUM, fields[18].fieldType);

    assertEquals(FieldType.STRING, fields[19].fieldType);
    assertEquals(FieldType.STRING, fields[20].fieldType);
    assertEquals(FieldType.STRING, fields[21].fieldType);

    assertEquals(FieldType.BYTES, fields[28].fieldType);
    assertEquals(FieldType.BYTES, fields[29].fieldType);
    assertEquals(FieldType.BYTES, fields[30].fieldType);

    assertEquals(FieldType.UINT32, fields[31].fieldType);
    assertEquals(FieldType.UINT32, fields[33].fieldType);
    assertEquals(FieldType.UINT32, fields[34].fieldType);

    assertEquals(FieldType.UINT64, fields[32].fieldType);

    assertEquals(FieldType.FIXED32, fields[35].fieldType);
    assertEquals(FieldType.FIXED32, fields[36].fieldType);
    assertEquals(FieldType.FIXED32, fields[37].fieldType);

    assertEquals(FieldType.MESSAGE, fields[26].fieldType);
    assertEquals(FieldType.MESSAGE, fields[27].fieldType);
  }

  testMap() {
    const fields = MapTestProto.getDescriptor().fields();
    const submessageFields = fields[1].submessageDescriptorProvider().fields();
    assertEquals(FieldType.MESSAGE, fields[1].fieldType);
    assertEquals(FieldType.INT32, submessageFields[1].fieldType);
    assertEquals(FieldType.BOOL, submessageFields[2].fieldType);
    assertTrue(fields[1].repeated);
  }

  testMap_nestedMessage() {
    const fields = MapTestProto.getDescriptor().fields();
    const submessageFields = fields[11].submessageDescriptorProvider().fields();
    assertEquals(FieldType.MESSAGE, fields[11].fieldType);
    assertEquals(FieldType.INT32, submessageFields[1].fieldType);
    assertEquals(FieldType.MESSAGE, submessageFields[2].fieldType);
    assertEquals(
        MapTestProto.NestedMessage.getDescriptor(),
        submessageFields[2].submessageDescriptorProvider());
    assertTrue(fields[11].repeated);
  }

  testRepeated() {
    const fields = TestProto.getDescriptor().fields();

    assertFalse(fields[1].repeated);
    assertFalse(fields[2].repeated);
    assertTrue(fields[3].repeated);
  }

  testSubmessageDescriptor() {
    const fields = TestProto.getDescriptor().fields();

    assertUndefined(fields[1].submessageDescriptorProvider);

    assertEquals(
        TestProto.NestedMessage.getDescriptor(),
        fields[26].submessageDescriptorProvider());
  }

  testJspbString() {
    const fields = TestProto.getDescriptor().fields();

    assertTrue(fields[7].jspbInt64String);
    assertFalse(fields[50].jspbInt64String);
  }

  testExtension() {
    const fields = Base.getDescriptor().fields();

    assertEquals(FieldType.BOOL, fields[101].fieldType);
    assertTrue(fields[101].extension);
  }

  testExtension_withSubmessage() {
    const fields = Base.getDescriptor().fields();

    assertEquals(FieldType.MESSAGE, fields[180].fieldType);
    assertTrue(fields[101].extension);
    assertEquals(
        Base.getDescriptor(), fields[180].submessageDescriptorProvider());
  }
}

testSuite(new DescriptorsTest());