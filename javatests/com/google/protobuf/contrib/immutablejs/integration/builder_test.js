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

goog.module('proto.im.integration.BuilderTest');
goog.setTestOnly();

const GroupsProto = goog.require('improto.protobuf.contrib.immutablejs.protos.GroupsProto');
const TestProto = goog.require('improto.protobuf.contrib.immutablejs.protos.TestProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');
const {enableFixGroupsB171736612} = goog.require('proto.im.defines');


class BuilderTest {
  testClone() {
    const builder1 = TestProto.newBuilder().setOptionalBool(true);
    const builder2 = builder1.clone();

    // Make sure they are both identical
    assertEqualsForProto(true, builder1.build().equals(builder2.build()));

    // change the first builder
    builder1.setOptionalString('foo');

    // Assert that the first has changed, but not the second
    assertEqualsForProto(false, builder1.build().equals(builder2.build()));
    assertEqualsForProto('foo', builder1.getOptionalString());
    assertEqualsForProto('', builder2.getOptionalString());
    assertEqualsForProto(false, builder2.hasOptionalString());
  }
}

class GroupBuilderTestUnderFixFlagTest {
  setUp() {
    enableFixGroupsB171736612(true);
  }

  tearDown() {
    enableFixGroupsB171736612(false);
  }

  testBuildGroupUnderFixedFlag() {
    const g = GroupsProto.newBuilder()
                  .setOptionalGroup(GroupsProto.OptionalGroup.newBuilder())
                  .build();

    assertEquals(g.serialize(), '[[{"g":1}]]');
  }
}

testSuite({
  testBuilder: new BuilderTest(),
  testGroupBuilderTestUnderFixFlag: new GroupBuilderTestUnderFixFlagTest()
});
