// Copyright 2020 Google LLC
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

goog.module('proto.im.testdata.MapsTest');
goog.setTestOnly('proto.im.testdata.MapsTest');

const ImmutableProto = goog.require('improto.protobuf.contrib.immutablejs.protos.MapTestProto');
const testSuite = goog.require('goog.testing.testSuite');

class MapsTest {
  testMalformedMap_duplicateKeys_getterReturnsLastOccurance() {
    const serialized = `[null,null,null,null,null,[[1,"foo"],[1,"bar"]]]`;
    const immutable = ImmutableProto.parse(serialized);

    assertEquals(1, immutable.getInt32KeyStringValueCount());
    assertEquals('bar', immutable.getInt32KeyStringValueOrThrow(1));
    assertEquals('bar', immutable.getInt32KeyStringValueMap().get(1));
  }

  testMalformedMap_serializesDuplicateKeyWithoutMutation_leavesDuplicates() {
    const serialized = `[null,null,null,null,null,[[1,"foo"],[1,"bar"]]]`;
    const immutable = ImmutableProto.parse(serialized);

    assertEquals(serialized, immutable.serialize());
  }


  testMalformedMap_mutateDuplicateKey_removesAllDuplicates() {
    const serialized =
        `[null,null,null,null,null,[[1,"foo"],[2,"alpha"],[2,"bravo"],[1,"bar"]]]`;
    const immutable = ImmutableProto.parse(serialized);

    const updatedImmutable =
        immutable.toBuilder().putInt32KeyStringValue(1, 'buzz').build();
    assertEquals(
        `[null,null,null,null,null,[[1,"buzz"],[2,"bravo"]]]`,
        updatedImmutable.serialize());
  }
}

testSuite(new MapsTest());
