package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class MessageEqualityTest {
  @Test
  public void test() {
    TestProto first = TestProto.newBuilder().setOptionalBool(true).build();
    TestProto second = TestProto.newBuilder().setOptionalBool(true).build();

    assertThat(first).isEqualTo(second);
    assertThat(first.hashCode()).isEqualTo(second.hashCode());
    assertThat(first).isNotEqualTo(first.toBuilder().setOptionalBool(false).build());
    assertThat(first.hashCode())
        .isNotEqualTo(first.toBuilder().setOptionalBool(false).build().hashCode());
  }
}
