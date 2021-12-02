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

  @Test
  public void testToByteArray() throws Exception {
    byte[] halloBytes = "hallo".getBytes("UTF-8");
    assertThat(HALLO_FROM_UTF8.toByteArray()).isEqualTo(halloBytes);

    byte[] negativeBytes = {-1, -1, -1};
    assertThat(ByteString.copyFrom(negativeBytes).toByteArray()).isEqualTo(negativeBytes);
    assertThat(InternalByteString.fromBase64String("////").toByteArray()).isEqualTo(negativeBytes);
  }

  private static void assertByteArrayEqual(byte[] from, byte[] to) {
    assertThat(to.length).isEqualTo(from.length);
    int len = to.length;
    for (int i = 0; i < len; i++) {
      assertThat(to[i]).isEqualTo(from[i]);
    }
  }
}
