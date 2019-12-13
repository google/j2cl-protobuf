package com.google.protobuf.contrib.j2cl.integration;

import static org.junit.Assert.assertEquals;

import com.google.protos.EmptyPackage.TestProto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class EmptyPackageTest {

  @Test
  public void test() {
    // simply reference the proto here to make sure namespacing works
    assertEquals("foo", TestProto.newBuilder().setPayload("foo").build().getPayload());
  }
}
