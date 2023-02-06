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

goog.module('proto.im.integration.FloatFieldsTest');
goog.setTestOnly();

const BuggyGroupMessage = goog.require('improto.protobuf.contrib.immutablejs.protos.BuggyGroupMessage');
const GroupsProto = goog.require('improto.protobuf.contrib.immutablejs.protos.GroupsProto');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');

class GroupsTest {
  testOptionalGroup() {
    const groupsBuilder = GroupsProto.newBuilder().setOptionalGroup(
        GroupsProto.OptionalGroup.newBuilder().setFoo('foo').setBar(1));
    const groups = groupsBuilder.build();

    assertEqualsForProto('foo', groupsBuilder.getOptionalGroup().getFoo());
    assertEqualsForProto(1, groupsBuilder.getOptionalGroup().getBar());
    assertEqualsForProto('foo', groups.getOptionalGroup().getFoo());
    assertEqualsForProto(1, groups.getOptionalGroup().getBar());
  }

  testRepeatedGroup() {
    const groupsBuilder = GroupsProto.newBuilder().addRepeatedGroup(
        GroupsProto.RepeatedGroup.newBuilder().setFoo('foo').setBar(1));
    const groups = groupsBuilder.build();

    assertEqualsForProto('foo', groupsBuilder.getRepeatedGroup(0).getFoo());
    assertEqualsForProto(1, groupsBuilder.getRepeatedGroup(0).getBar());
    assertEqualsForProto('foo', groups.getRepeatedGroup(0).getFoo());
    assertEqualsForProto(1, groups.getRepeatedGroup(0).getBar());
  }

  testNonIncrementingFieldNumbers() {
    const nonIncrementingFieldNumbersBuilder =
        GroupsProto.NonIncrementingFieldNumbers.newBuilder()
            .setLowerThanGroup('foo')
            .setEqualToGroup('bar')
            .setHigherThanGroup('buzz');
    const groups =
        GroupsProto.newBuilder()
            .setNonIncrementingFieldNumbers(nonIncrementingFieldNumbersBuilder)
            .build();

    // The fields will be present on the builder
    assertEqualsForProto(
        'foo', nonIncrementingFieldNumbersBuilder.getLowerThanGroup());
    assertEqualsForProto(
        'bar', nonIncrementingFieldNumbersBuilder.getEqualToGroup());
    assertEqualsForProto(
        'buzz', nonIncrementingFieldNumbersBuilder.getHigherThanGroup());

    // No fields should be dropped while copying with the group fix enabled.
    assertEqualsForProto(
        'foo', groups.getNonIncrementingFieldNumbers().getLowerThanGroup());
    assertEqualsForProto(
        'bar', groups.getNonIncrementingFieldNumbers().getEqualToGroup());
    assertEqualsForProto(
        'buzz', groups.getNonIncrementingFieldNumbers().getHigherThanGroup());
  }

  testCloneNonIncrementingFieldNumbers() {
    const nonIncrementingFieldNumbersBuilder =
        GroupsProto.NonIncrementingFieldNumbers.newBuilder().setLowerThanGroup(
            'foo');

    const copy = nonIncrementingFieldNumbersBuilder.clone();

    assertEqualsForProto(
        'foo', nonIncrementingFieldNumbersBuilder.getLowerThanGroup());

    assertEqualsForProto('foo', copy.getLowerThanGroup());
  }

  testPivot() {
    const groups =
        GroupsProto.newBuilder()
            .setOptionalGroup(
                GroupsProto.OptionalGroup.newBuilder().setBeyondNormalPivot(1))
            .build();

    const json = JSON.parse(groups.serialize());

    // All groups should be zero-indexed with no pivot. Therefore the
    // beyond_normal_pivot field should be at array index 999 within the
    // group since field number 1000 - 1 (zero indexed).

    const beyondNormalPivotIndex =
        GroupsProto.OptionalGroup.BEYOND_NORMAL_PIVOT_FIELD_NUMBER - 1;
    const expected = [new Array(beyondNormalPivotIndex).fill(null)];
    expected[0][beyondNormalPivotIndex] = 1;
    expected[0].push({'g': 1});

    assertObjectEquals(expected, json);
  }

  testSerialized_NonIncrementingFieldNumbers() {
    const nonIncrementingFieldNumbersBuilder =
        GroupsProto.NonIncrementingFieldNumbers.newBuilder()
            .setLowerThanGroup('foo')
            .setEqualToGroup('bar')
            .setHigherThanGroup('buzz');
    const groups =
        GroupsProto.newBuilder()
            .setNonIncrementingFieldNumbers(nonIncrementingFieldNumbersBuilder)
            .build();

    assertEquals(
        '[null,null,["foo",null,"bar","buzz",{"g":1}]]', groups.serialize());
  }

  testSerialized() {
    const groups =
        GroupsProto.newBuilder()
            .setOptionalGroup(
                GroupsProto.OptionalGroup.newBuilder().setFoo('aaa').setBar(1))
            .addRepeatedGroup(
                GroupsProto.RepeatedGroup.newBuilder().setFoo('bbb').setBar(2))
            .build();

    assertEquals(
        '[[null,"aaa",1,{"g":1}],[[null,null,"bbb",2,{"g":1}]]]',
        groups.serialize());
  }

  testBuildFixedBuggyGroup() {
    let buggy =
        BuggyGroupMessage.newBuilder()
            .setSomeString('hello')
            .setBuggyGroup(BuggyGroupMessage.BuggyGroup.getDefaultInstance())
            .build();
    assertEquals('["hello",null,[{"g":1}]]', buggy.serialize());

    buggy = buggy.toBuilder()
                .setBuggyGroup(
                    BuggyGroupMessage.BuggyGroup.newBuilder().setSecond('2nd'))
                .build();
    assertEquals('["hello",null,[null,"2nd",{"g":1}]]', buggy.serialize());

    buggy =
        buggy.toBuilder()
            .setBuggyGroup(buggy.getBuggyGroup().toBuilder().setFirst('1st'))
            .build();

    assertEquals('["hello",null,["1st","2nd",{"g":1}]]', buggy.serialize());
  }

  testFixedBuggyGroupFromWire() {
    let buggy = BuggyGroupMessage.parse('["hello",null,[{"g":1}]]');
    assertEquals('["hello",null,[{"g":1}]]', buggy.serialize());

    buggy =
        BuggyGroupMessage.newBuilder(buggy)
            .setBuggyGroup(buggy.getBuggyGroup().toBuilder().setSecond('2nd'))
            .build();
    assertEquals('["hello",null,[null,"2nd",{"g":1}]]', buggy.serialize());

    buggy =
        BuggyGroupMessage.newBuilder(buggy)
            .setBuggyGroup(buggy.getBuggyGroup().toBuilder().setFirst('1st'))
            .build();
    assertEquals('["hello",null,["1st","2nd",{"g":1}]]', buggy.serialize());
  }

  testFixedBuggyGroupFromWireUpdateBeforeSparseField() {
    let buggy = BuggyGroupMessage.parse('["hello",null,[{"1":"1st","g":1}]]');
    assertEquals('["hello",null,[{"1":"1st","g":1}]]', buggy.serialize());

    // Even though the group has a suggested pivot, it's sparse
    // object only exists because of the fixed flag so we should
    // pretend it isn't there.
    buggy =
        BuggyGroupMessage.newBuilder(buggy)
            .setBuggyGroup(buggy.getBuggyGroup().toBuilder().setSecond('2nd'))
            .build();
    assertEquals(
        '["hello",null,[{"1":"1st","2":"2nd","g":1}]]', buggy.serialize());
  }

  testGroupWithoutFixFlagThrows() {
    assertThrows(
        `Group is missing a fix indicator flag. If you see this error, please contact go/web-protos-help (see b/171736612 for more information).`,
        () => {
          return BuggyGroupMessage.BuggyGroup.parse('["hello"]');
        });
  }
}

testSuite(new GroupsTest());