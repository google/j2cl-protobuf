// Copyright 2021 Google LLC
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

goog.module('proto.im.testdata.ConflictingTest');
goog.setTestOnly();

const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.ConflictingNames');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');

class ConflictingNamesTest {
  testFieldWithConflictingName() {
    assertEqualsForProto(0, TestProto.newBuilder().build().getFieldCount2());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasFieldCount2());
    assertEqualsForProto(0, TestProto.newBuilder().build().getField1Count());

    assertEqualsForProto(0, TestProto.newBuilder().build().getFieldList3());
    assertEqualsForProto(false, TestProto.newBuilder().build().hasFieldList3());
    assertEqualsForProto(
        [], TestProto.newBuilder().build().getField1List().toArray());

    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasSecondField4());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().getSecondField4());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasSecondField5());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().getSecondField5());

    assertEqualsForProto(false, TestProto.newBuilder().build().hasClassCount());
    assertEqualsForProto(false, TestProto.newBuilder().build().getClassCount());
    assertEqualsForProto(0, TestProto.newBuilder().build().getClass_Count());

    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasThirdField6());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().getThirdField6());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasThirdField7());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().getThirdField7());

    assertEqualsForProto(
        0, TestProto.newBuilder().build().getExtension10Count());
    assertEqualsForProto(
        0, TestProto.newBuilder().build().getExtension11Count());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasExtensionCount12());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().getExtensionCount12());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().hasExtensionAtIndex14());
    assertEqualsForProto(
        false, TestProto.newBuilder().build().getExtensionAtIndex14());
  }
}

testSuite(new ConflictingNamesTest());
