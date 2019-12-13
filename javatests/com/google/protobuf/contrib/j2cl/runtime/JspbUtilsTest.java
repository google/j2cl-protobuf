package com.google.protobuf.contrib.j2cl.runtime;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertThrows;

import com.google.protobuf.contrib.j2cl.protos.Accessor.TestProto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class JspbUtilsTest {

  @Test
  public void test() throws Exception {
    assertThat(JspbUtils.fromJspbString("[]", TestProto.getDefaultInstance()))
        .isEqualTo(TestProto.getDefaultInstance());

    TestProto proto = TestProto.newBuilder().setOptionalBool(true).build();
    TestProto proto2 =
        JspbUtils.fromJspbString(JspbUtils.toJspbString(proto), TestProto.getDefaultInstance());
    assertThat(proto2).isEqualTo(proto);
  }

  @Test
  public void testInvalidInput() {
    assertJspbUtilThrows("not a jsbp string");
    assertJspbUtilThrows(null);
    assertJspbUtilThrows("");

    // Should ideally throw for following but doesn't if not in checked mode
    // assertJspbUtilThrows("1");
    // assertJspbUtilThrows("{}");
  }

  private static void assertJspbUtilThrows(String jspbString) {
    assertThrows(
        JspbParseException.class,
        () -> JspbUtils.fromJspbString(jspbString, TestProto.getDefaultInstance()));
  }
}
