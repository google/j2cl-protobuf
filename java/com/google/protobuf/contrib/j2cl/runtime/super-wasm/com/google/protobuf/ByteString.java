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
package com.google.protobuf;

import java.util.Arrays;

/** J2Wasm implementation of ByteString. */
public class ByteString {
  public static final ByteString EMPTY = new ByteString(new byte[0]);

  public static ByteString copyFrom(byte[] bytes) {
    return new ByteString(cloneByteArray(bytes));
  }

  public static ByteString copyFromUtf8(String s) {
    return copyFrom(s.getBytes());
  }

  private final byte[] bytes;

  private ByteString(byte[] bytes) {
    this.bytes = bytes;
  }

  public byte[] toByteArray() {
    return cloneByteArray(bytes);
  }

  public int size() {
    return bytes.length;
  }

  public byte byteAt(int index) {
    return bytes[index];
  }

  public final String toStringUtf8() {
    // Using the bytes[] constructor is fine, since in J2CL this is UTF-8 by default.
    return new String(toByteArray());
  }

  public boolean isEmpty() {
    return bytes.length != 0;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    return Arrays.equals(bytes, ((ByteString) o).bytes);
  }

  @Override
  public int hashCode() {
    return Arrays.hashCode(bytes);
  }

  // TODO(b/160264050): remove and replace with bytes.clone()
  private static byte[] cloneByteArray(byte[] bytes) {
    return Arrays.copyOf(bytes, bytes.length);
  }
}
