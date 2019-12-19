// Copyright 2019 Google LLC
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

goog.module('proto.im.integration.MessageEqualityTest');
goog.setTestOnly();

const MessageA = goog.require('improto.protobuf.contrib.immutablejs.protos.MessageA');
const MessageB = goog.require('improto.protobuf.contrib.immutablejs.protos.MessageB');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');


class MessageEqualityTest {
  testEqualsForStructurallySameMessage() {
    const protoA = MessageA.newBuilder().setFoo('Foo').build();
    const protoB = MessageB.newBuilder().setFoo('Foo').build();
    const otherProtoA = MessageA.newBuilder().setFoo('Foo').build();
    const otherProtoB = MessageB.newBuilder().setFoo('Foo').build();


    assertEqualsForProto(protoA, protoA);
    assertEqualsForProto(protoB, protoB);
    assertEqualsForProto(protoA, otherProtoA);
    assertEqualsForProto(protoB, otherProtoB);
    // Makes sure that messages with the same structure are not seen as equal
    assertFalse(protoA.equals(protoB));
  }
}


testSuite(new MessageEqualityTest());
