package com.google.protobuf.contrib.j2cl.runtime;

import static com.google.common.truth.Truth.assertThat;

import com.google.protobuf.ByteString;
import java.io.UnsupportedEncodingException;
import jsinterop.annotations.JsType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class ByteStringTest {

  // Defined here to give us access to fromBase64String which we do not want on the public api.
  @JsType(isNative = true, name = "ByteString", namespace = "proto.im")
  private static class InternalByteString {
    public static native ByteString fromBase64String(String value);
  }

  private static final ByteString HALLO_FROM_UTF8 = ByteString.copyFromUtf8("hallo");
  private static final ByteString HALLO_FROM_BASE64 =
      InternalByteString.fromBase64String("aGFsbG8=");
  private static final ByteString HALLO_FROM_BYTES = createFromBytes();

  private static ByteString createFromBytes() {
    try {
      return ByteString.copyFrom("hallo".getBytes("UTF-8"));
    } catch (UnsupportedEncodingException e) {
      throw new AssertionError("J2CL guarantees support of UTF-8.");
    }
  }

  @Test
  public void testUTF8String() throws Exception {
    assertThat(HALLO_FROM_UTF8.toStringUtf8()).isEqualTo("hallo");
    assertThat(HALLO_FROM_BASE64.toStringUtf8()).isEqualTo("hallo");
    assertThat(HALLO_FROM_BYTES.toStringUtf8()).isEqualTo("hallo");
  }
}
