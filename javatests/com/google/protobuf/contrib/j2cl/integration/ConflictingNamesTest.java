/*
 * Copyright 2021 Google LLC
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

import com.google.protobuf.contrib.j2cl.protos.ConflictingNamesOuterClass.ConflictingNames;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class ConflictingNamesTest {

  @Test
  public void testFieldsWithConflictingNames() {
    ConflictingNames proto = ConflictingNames.getDefaultInstance();
    assertThat(proto.hasFieldCount2()).isFalse();
    assertThat(proto.getFieldCount2()).isEqualTo(0);
    assertThat(proto.getField1Count()).isEqualTo(0);

    assertThat(proto.getField1List().size()).isEqualTo(0);
    assertThat(proto.getFieldList3()).isEqualTo(0);

    assertThat(proto.hasSecondField4()).isFalse();
    assertThat(proto.getSecondField4()).isFalse();
    assertThat(proto.hasSecondField5()).isFalse();
    assertThat(proto.getSecondField5()).isFalse();

    assertThat(proto.hasThirdField6()).isFalse();
    assertThat(proto.getThirdField6()).isFalse();
    assertThat(proto.hasThirdField7()).isFalse();
    assertThat(proto.getThirdField7()).isFalse();

    assertThat(proto.hasClassCount()).isFalse();
    assertThat(proto.getClassCount()).isFalse();
    assertThat(proto.getClass_Count()).isEqualTo(0);

    assertThat(proto.getExtension10Count()).isEqualTo(0);
    assertThat(proto.getExtension11Count()).isEqualTo(0);
    assertThat(proto.hasExtensionCount12()).isFalse();
    assertThat(proto.getExtensionCount12()).isFalse();
  }
}
