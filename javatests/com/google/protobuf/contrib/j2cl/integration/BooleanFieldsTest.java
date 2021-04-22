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

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertThrows;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import java.util.Arrays;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class BooleanFieldsTest {

  @Test
  public void testOptionalFieldNoDefault_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().hasOptionalBool()).isFalse();
    assertThat(TestProto.getDefaultInstance().getOptionalBool()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_setTrue() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBool(true);
    assertThat(builder.hasOptionalBool()).isTrue();
    assertThat(builder.getOptionalBool()).isTrue();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBool()).isTrue();
    assertThat(proto.getOptionalBool()).isTrue();
  }

  @Test
  public void testOptionalFieldNoDefault_setFalse() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBool(false);
    assertThat(builder.hasOptionalBool()).isTrue();
    assertThat(builder.getOptionalBool()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBool()).isTrue();
    assertThat(proto.getOptionalBool()).isFalse();
  }

  @Test
  public void testOptionalFieldNoDefault_clear() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBool(true);
    builder.clearOptionalBool();
    assertThat(builder.hasOptionalBool()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBool()).isFalse();
  }

  @Test
  public void testOptionalFieldWithDefault_setTrue() {
    assertThat(TestProto.getDefaultInstance().getOptionalBoolWithDefault()).isTrue();

    TestProto.Builder builder = TestProto.newBuilder().setOptionalBoolWithDefault(true);
    assertThat(builder.getOptionalBoolWithDefault()).isTrue();
    assertThat(builder.hasOptionalBoolWithDefault()).isTrue();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBoolWithDefault()).isTrue();
    assertThat(proto.getOptionalBoolWithDefault()).isTrue();
  }

  @Test
  public void testOptionalFieldWithDefault_setFalse() {
    TestProto.Builder builder = TestProto.newBuilder().setOptionalBoolWithDefault(false);
    assertThat(builder.hasOptionalBoolWithDefault()).isTrue();
    assertThat(builder.getOptionalBoolWithDefault()).isFalse();

    TestProto proto = builder.build();
    assertThat(proto.hasOptionalBoolWithDefault()).isTrue();
    assertThat(proto.getOptionalBoolWithDefault()).isFalse();
  }

  @Test
  public void testRepeatedField_defaultInstance() {
    assertThat(TestProto.getDefaultInstance().getRepeatedBoolCount()).isEqualTo(0);
    assertThat(TestProto.newBuilder().build().getRepeatedBoolCount()).isEqualTo(0);

    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> TestProto.newBuilder().build().getRepeatedBool(3));
    } else {
      assertThat(TestProto.newBuilder().build().getRepeatedBool(3)).isNull();
    }
  }

  @Test
  public void testRepeatedField_add() {
    TestProto.Builder builder = TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false);
    assertThat(Arrays.asList(true, false))
        .containsExactlyElementsIn(builder.getRepeatedBoolList())
        .inOrder();

    TestProto proto = builder.build();
    assertThat(Arrays.asList(true, false))
        .containsExactlyElementsIn(proto.getRepeatedBoolList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_addAll() {
    TestProto proto = TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false).build();

    TestProto.Builder builder =
        proto.toBuilder().addAllRepeatedBool(Arrays.asList(false, true, true));
    assertThat(Arrays.asList(true, false, false, true, true))
        .containsExactlyElementsIn(builder.getRepeatedBoolList())
        .inOrder();

    TestProto proto2 = builder.build();
    assertThat(Arrays.asList(true, false, false, true, true))
        .containsExactlyElementsIn(proto2.getRepeatedBoolList())
        .inOrder();
  }

  @Test
  public void testRepeatedField_set() {
    TestProto proto =
        TestProto.newBuilder()
            .addRepeatedBool(true)
            .addRepeatedBool(false)
            .addRepeatedBool(false)
            .build();

    TestProto.Builder builder = proto.toBuilder().setRepeatedBool(2, true);
    assertThat(Arrays.asList(true, false, true))
        .containsExactlyElementsIn(builder.getRepeatedBoolList())
        .inOrder();

    TestProto proto2 = builder.build();
    assertThat(Arrays.asList(true, false, true))
        .containsExactlyElementsIn(proto2.getRepeatedBoolList().toArray())
        .inOrder();
  }

  @Test
  public void testRepeatedField_getAndCount() {
    TestProto.Builder builder =
        TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false).addRepeatedBool(false);

    assertThat(builder.getRepeatedBoolCount()).isEqualTo(3);
    assertThat(builder.getRepeatedBool(0)).isTrue();
    assertThat(builder.getRepeatedBool(1)).isFalse();
    assertThat(builder.getRepeatedBool(2)).isFalse();
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> builder.getRepeatedBool(3));
    } else {
      assertThat(builder.getRepeatedBool(3)).isNull();
    }

    TestProto proto = builder.build();
    assertThat(proto.getRepeatedBoolCount()).isEqualTo(3);
    assertThat(proto.getRepeatedBool(0)).isTrue();
    assertThat(proto.getRepeatedBool(1)).isFalse();
    assertThat(proto.getRepeatedBool(2)).isFalse();
    if (InternalChecks.isCheckIndex()) {
      assertThrows(Exception.class, () -> proto.getRepeatedBool(3));
    } else {
      assertThat(proto.getRepeatedBool(3)).isNull();
    }
  }

  @Test
  public void testRepeatedField_clear() {
    TestProto proto = TestProto.newBuilder().addRepeatedBool(true).addRepeatedBool(false).build();

    TestProto.Builder builder = proto.toBuilder().clearRepeatedBool();
    assertThat(builder.getRepeatedBoolCount()).isEqualTo(0);
    assertThat(builder.getRepeatedBoolList()).isEmpty();

    TestProto proto2 = builder.build();
    assertThat(proto2.getRepeatedBoolCount()).isEqualTo(0);
    assertThat(proto2.getRepeatedBoolCount()).isEqualTo(0);
  }

  @Test
  public void testRepeatedField_getReturnsImmutableList() {
    TestProto.Builder builder = TestProto.newBuilder().addRepeatedBool(true);
    List<Boolean> repeatedFieldList = builder.getRepeatedBoolList();

    assertThrows(Exception.class, () -> repeatedFieldList.add(false));
    assertThrows(Exception.class, () -> repeatedFieldList.remove(0));
  }
}
