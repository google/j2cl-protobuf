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

import jsinterop.annotations.JsOverlay;
import jsinterop.annotations.JsType;

/** J2CL's implementation of ByteString. */
@JsType(isNative = true, namespace = "proto.im")
public class ByteString {
  // Normally this field should be final. The field is actually declared constant in
  // bytestring.js and thus is actually final in JsCompiler, but because of JsInterop
  // restrictions we can not declare it final here. Note that any Java code that will try
  // to assign the field will receive a closure compiler error.
  public static ByteString EMPTY;

  public static native ByteString copyFrom(byte[] bytes);

  @JsOverlay
  public static ByteString copyFromUtf8(String s) {
    return copyFrom(s.getBytes());
  }

  // Hides the constructor. Factory methods should be used instead.
  private ByteString() {}

  @JsOverlay
  public final byte[] toByteArray() {
    byte[] byteArray = new byte[0];
    for (int i = 0; i < size(); i++) {
      byteArray[i] = byteAt(i);
    }
    return byteArray;
  }

  public native int size();

  public native byte byteAt(int index);

  @JsOverlay
  public final String toStringUtf8() {
    // Using the bytes[] contructor is fine, since in J2CL this is UTF-8 by default.
    return new String(toByteArray());
  }

  public native boolean isEmpty();
}
