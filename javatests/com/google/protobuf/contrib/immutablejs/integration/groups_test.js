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

    // But not on the built object since they get dropped when we defensively
    // copy
    assertEqualsForProto(
        '', groups.getNonIncrementingFieldNumbers().getLowerThanGroup());
    assertEqualsForProto(
        '', groups.getNonIncrementingFieldNumbers().getEqualToGroup());
    assertEqualsForProto(
        'buzz', groups.getNonIncrementingFieldNumbers().getHigherThanGroup());
  }

  testSerialized() {
    const groups =
        GroupsProto.newBuilder()
            .setOptionalGroup(
                GroupsProto.OptionalGroup.newBuilder().setFoo('aaa').setBar(1))
            .addRepeatedGroup(
                GroupsProto.RepeatedGroup.newBuilder().setFoo('bbb').setBar(2))
            .build();

    assertObjectEquals(
        [['aaa', 1], [['bbb', 2]]], JSON.parse(groups.serialize()));
  }

  testPivot() {
    const groups =
        GroupsProto.newBuilder()
            .setOptionalGroup(
                GroupsProto.OptionalGroup.newBuilder().setBeyondNormalPivot(1))
            .build();

    const json = JSON.parse(groups.serialize());

    // All groups should be zero-indexed with no pivot. Therefore the
    // beyond_normal_pivot field should be at array index 998 within the group
    // since field number 1000 - 1 (zero indexed) - 1 (the group field number).
    const beyondNormalPivotIndex =
        GroupsProto.OptionalGroup.BEYOND_NORMAL_PIVOT_FIELD_NUMBER - 2;
    const expected = [new Array(beyondNormalPivotIndex).fill(null)];
    expected[0][beyondNormalPivotIndex] = 1;
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

    assertObjectEquals([null, null, ['buzz']], JSON.parse(groups.serialize()));
  }
}

testSuite(new GroupsTest());
