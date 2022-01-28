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

goog.module('proto.im.integration.AnyTest');
goog.setTestOnly();

const Any = goog.require('improto.google.protobuf.Any');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');

class AnyTest {
  testgetTypeName_typeUrlWithSlash() {
    const msg = TestProto.newBuilder().setOptionalInt(12345).build();
    const any = Any.packJspb(
        msg, 'improto.protobuf.contrib.immutablejs.protos.TestProto',
        'googleapis.com/');
    assertEqualsForProto(
        any.getTypeName(),
        'improto.protobuf.contrib.immutablejs.protos.TestProto');
  }

  testgetTypeName_typeUrlWithoutSlash() {
    const msg = TestProto.newBuilder().setOptionalInt(12345).build();
    const any = Any.packJspb(
        msg, 'improto.protobuf.contrib.immutablejs.protos.TestProto',
        'googleapis.com');
    assertEqualsForProto(
        any.getTypeName(),
        'improto.protobuf.contrib.immutablejs.protos.TestProto');
  }

  testPackJspb_customTypeUrlPrefix() {
    const msg = TestProto.newBuilder().setOptionalInt(12345).build();
    const any = Any.packJspb(
        msg, 'improto.protobuf.contrib.immutablejs.protos.TestProto',
        'googleapis.com/');
    assertEqualsForProto(
        any.getTypeUrl(),
        'googleapis.com/improto.protobuf.contrib.immutablejs.protos.TestProto');
  }

  testPackJspb_defaultTypeUrlPrefix() {
    const msg = TestProto.newBuilder().setOptionalInt(12345).build();
    // with default typeUrlPrefix
    const any = Any.packJspb(
        msg, 'improto.protobuf.contrib.immutablejs.protos.TestProto');
    assertEqualsForProto(
        any.getTypeUrl(),
        'type.googleapis.com/improto.protobuf.contrib.immutablejs.protos.TestProto');
  }

  testUnpackJspb() {
    const msg = TestProto.newBuilder().setOptionalInt(12345).build();
    const any = Any.packJspb(
        msg, 'improto.protobuf.contrib.immutablejs.protos.TestProto',
        'googleapis.com');
    const msg2 = any.unpackJspb(
        TestProto.getDefaultInstance(),
        'improto.protobuf.contrib.immutablejs.protos.TestProto');
    assertEqualsForProto(msg, msg2);
  }

  testUnpackJspb_mismatchedName() {
    const msg = TestProto.newBuilder().setOptionalInt(12345).build();
    const any = Any.packJspb(
        msg, 'improto.protobuf.contrib.immutablejs.protos.TestProto',
        'googleapis.com');
    const msg2 = any.unpackJspb(
        TestProto.getDefaultInstance(), 'CompletelyDifferentTypeName');
    assertNull(msg2);
  }

  testUnpackJspb_binaryPayload() {
    const any = Any.parse(
        '["type.googleapis.com/improto.protobuf.contrib.immutablejs.protos.TestProto", "abc"]');
    const msg2 = any.unpackJspb(
        TestProto.getDefaultInstance(),
        'improto.protobuf.contrib.immutablejs.protos.TestProto');
    assertNull(msg2);
  }
}

testSuite(new AnyTest());
