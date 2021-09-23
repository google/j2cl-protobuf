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

goog.module('proto.im.integration.PivotTest');
goog.setTestOnly();

const MutablePivot = goog.require('proto.protobuf.contrib.immutablejs.protos.Pivot');
const MutablePivotWithoutMessageId = goog.require('proto.protobuf.contrib.immutablejs.protos.PivotWithoutMessageId');
const MutablePivotWithoutMessageIdAndExtension = goog.require('proto.protobuf.contrib.immutablejs.protos.PivotWithoutMessageIdAndExtension');
const Pivot = goog.require('improto.protobuf.contrib.immutablejs.protos.Pivot');
const PivotOnlyExtensions = goog.require('improto.protobuf.contrib.immutablejs.protos.PivotOnlyExtensions');
const PivotWithoutMessageId = goog.require('improto.protobuf.contrib.immutablejs.protos.PivotWithoutMessageId');
const PivotWithoutMessageIdAndExtension = goog.require('improto.protobuf.contrib.immutablejs.protos.PivotWithoutMessageIdAndExtension');
const PivotWithoutMessageIdOnlyExtensions = goog.require('improto.protobuf.contrib.immutablejs.protos.PivotWithoutMessageIdOnlyExtensions');
const mutablePivotExtension = goog.require('proto.protobuf.contrib.immutablejs.protos.pivotExtension');
const mutablePivotNoMsgidExtension = goog.require('proto.protobuf.contrib.immutablejs.protos.pivotNoMsgidExtension');
const pivot = goog.require('improto.protobuf.contrib.immutablejs.protos.pivot');
const testSuite = goog.require('goog.testing.testSuite');
const {assertEqualsForProto} = goog.require('proto.im.proto_asserts');

class PivotTest {
  testFieldInExtensionObject() {
    const builder = Pivot.newBuilder()
                        .setExtension(
                            pivot.pivotExtension,
                            Pivot.newBuilder().setPayload('child').build())
                        .setPayload('parent')
                        .setPayload2('parent2');

    assertEqualsForProto('parent2', builder.getPayload2());
    assertEqualsForProto(
        Pivot.newBuilder().setPayload('child').build(),
        builder.getExtension(pivot.pivotExtension));
    assertEqualsForProto(
        Pivot.newBuilder().setPayload('child').build(),
        builder.build().getExtension(pivot.pivotExtension));
  }

  testParse() {
    const data = ["my_message_id"];
    data[1] = 'parent1';
    data[501] = 'parent2';
    data[502] = {1000: [, 'child']};
    const serialized = JSON.stringify(data);

    const m = MutablePivot.deserialize(serialized);
    assertEqualsForProto('parent1', m.getPayload());
    assertEqualsForProto('parent2', m.getPayload2());
    assertEqualsForProto(
        'child', m.getExtension(mutablePivotExtension).getPayload());

    const p = Pivot.parse(serialized);
    assertEqualsForProto('parent1', p.getPayload());
    assertEqualsForProto('parent2', p.getPayload2());
    assertEqualsForProto(
        'child', p.getExtension(pivot.pivotExtension).getPayload());
  }

  testParse_noMessageId() {
    {
      const data = [];
      data[0] = 'parent';
      const serialized = JSON.stringify(data);

      const m = MutablePivotWithoutMessageId.deserialize(serialized);
      assertEqualsForProto('parent', m.getPayload());

      const p = PivotWithoutMessageId.parse(serialized);
      assertEqualsForProto('parent', p.getPayload());
    }

    {
      const data = [];
      data[0] = 'parent';
      data[1] = {1000: ['child']};
      const serialized = JSON.stringify(data);

      const m = MutablePivotWithoutMessageId.deserialize(serialized);
      assertEqualsForProto('parent', m.getPayload());
      assertEqualsForProto(
          'child', m.getExtension(mutablePivotNoMsgidExtension).getPayload());

      const p = PivotWithoutMessageId.parse(serialized);
      assertEqualsForProto('parent', p.getPayload());
      assertEqualsForProto(
          'child', p.getExtension(pivot.pivotNoMsgidExtension).getPayload());
    }
  }

  testParse_noMessageIdAndExtension() {
    const data = [];
    data[0] = 'parent1';
    data[500] = 'parent2';
    const serialized = JSON.stringify(data);

    const m = MutablePivotWithoutMessageIdAndExtension.deserialize(serialized);
    assertEqualsForProto('parent1', m.getPayload());
    assertEqualsForProto('parent2', m.getPayload2());

    const p = PivotWithoutMessageIdAndExtension.parse(serialized);
    assertEqualsForProto('parent1', p.getPayload());
    assertEqualsForProto('parent2', p.getPayload2());
  }

  testSerialize_onlyExtensions() {
    const m = PivotOnlyExtensions.newBuilder()
                  .setExtension(pivot.onlyExtensionsExtension, 'foo')
                  .build();
    assertEquals(`["my_message_id",{"1":"foo"}]`, m.serialize());
  }

  testSerialize_onlyExtensionsWithoutMessageId() {
    const m = PivotWithoutMessageIdOnlyExtensions.newBuilder()
                  .setExtension(pivot.noMsgidOnlyExtensionsExtension, 'foo')
                  .build();
    assertEquals(`[{"1":"foo"}]`, m.serialize());
  }

  testInteropWithAppsJspb_fromImmutable() {
    const immutableProto =
        Pivot.newBuilder()
            .setExtension(
                pivot.pivotExtension,
                Pivot.newBuilder().setPayload('child').build())
            .setPayload('parent')
            .setPayload2('parent2')
            .build();

    const mutableProto = MutablePivot.deserialize(immutableProto.serialize());

    assertEqualsForProto(
        mutableProto.getPayload(), immutableProto.getPayload());
    assertEqualsForProto(
        mutableProto.getPayload2(), immutableProto.getPayload2());
    assertEqualsForProto(
        mutableProto.getExtension(mutablePivotExtension).getPayload(),
        immutableProto.getExtension(pivot.pivotExtension).getPayload());
  }

  testInteropWithAppsJspb_fromMutable() {
    const mutableProto =
        new MutablePivot().setPayload('parent').setPayload2('parent2');
    const child = new MutablePivot().setPayload('child');
    mutableProto.setExtension(mutablePivotExtension, child);

    const immutableProto = Pivot.parse(mutableProto.serialize());

    assertEqualsForProto(
        mutableProto.getPayload(), immutableProto.getPayload());
    assertEqualsForProto(
        mutableProto.getPayload2(), immutableProto.getPayload2());
    assertEqualsForProto(
        mutableProto.getExtension(mutablePivotExtension).getPayload(),
        immutableProto.getExtension(pivot.pivotExtension).getPayload());
  }
}

testSuite(new PivotTest());
