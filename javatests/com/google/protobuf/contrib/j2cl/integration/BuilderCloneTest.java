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
