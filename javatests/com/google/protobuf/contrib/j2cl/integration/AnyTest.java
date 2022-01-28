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

import com.google.protobuf.Any;
import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class AnyTest {

  @Test
  public void testPackJspb() throws Exception {
    // Any is proto3 (more details in go/improving-client-protos), but it can be used to store
    // proto2 message
    TestProto proto = TestProto.newBuilder().setOptionalInt(12345).build();
    Any any =
        Any.packJspb(
            proto, "improto.protobuf.contrib.immutablejs.protos.TestProto", "googleapis.com/");
    assertThat(any.getTypeUrl())
        .isEqualTo("googleapis.com/improto.protobuf.contrib.immutablejs.protos.TestProto");
  }

  @Test
  public void testPackJspbUnpackJspb() throws Exception {
    TestProto proto = TestProto.newBuilder().setOptionalInt(12345).build();
    Any any =
        Any.packJspb(
            proto, "improto.protobuf.contrib.immutablejs.protos.TestProto", "googleapis.com/");

    TestProto proto2 =
        (TestProto)
            any.unpackJspb(
                TestProto.getDefaultInstance(),
                "improto.protobuf.contrib.immutablejs.protos.TestProto");
    assertThat(proto2).isEqualTo(proto);
  }

  @Test
  public void testPackJspbUnpackJspb_mismatchedType() {
    TestProto proto = TestProto.newBuilder().setOptionalInt(12345).build();
    Any any =
        Any.packJspb(
            proto, "improto.protobuf.contrib.immutablejs.protos.TestProto", "googleapis.com/");

    assertThat(any.unpackJspb(TestProto.getDefaultInstance(), "CompletelyDifferentTypeName"))
        .isNull();
  }
}
