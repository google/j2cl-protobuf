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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class BuilderCloneTest {
  @Test
  public void test() {
    TestProto.Builder builder1 = TestProto.newBuilder().setOptionalBool(true);
    TestProto.Builder builder2 = builder1.clone();

    // Make sure they are both identical
    assertEquals(builder1.build(), builder2.build());

    // change the first builder
    builder1.setOptionalString("foo");

    // Assert that the first has changed, but not the second
    assertNotEquals(builder1.build(), builder2.build());
    assertEquals("foo", builder1.getOptionalString());
    assertEquals("", builder2.getOptionalString());
    assertFalse(builder2.hasOptionalString());
  }
}
