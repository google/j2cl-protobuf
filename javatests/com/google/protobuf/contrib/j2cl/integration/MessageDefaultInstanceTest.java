package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class MessageDefaultInstanceTest {

  @Test
  public void testGetDefaultInstance() throws Exception {
    assertThat(TestProto.getDefaultInstance()).isNotNull();
    assertThat(TestProto.getDefaultInstance()).isSameInstanceAs(TestProto.getDefaultInstance());
  }

  @Test
  public void testGetDefaultInstanceForType() throws Exception {
    assertThat(TestProto.newBuilder().build().getDefaultInstanceForType()).isNotNull();
    assertThat(TestProto.newBuilder().build().getDefaultInstanceForType())
        .isSameInstanceAs(TestProto.getDefaultInstance());
  }

  @Test
  public void testBuilderGetDefaultInstanceForType() throws Exception {
    assertThat(TestProto.newBuilder().getDefaultInstanceForType()).isNotNull();
    assertThat(TestProto.newBuilder().getDefaultInstanceForType())
        .isSameInstanceAs(TestProto.getDefaultInstance());
  }
}
