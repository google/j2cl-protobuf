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

  public native byte[] toByteArray();

  @JsOverlay
  public final String toStringUtf8() {
    // Using the bytes[] contructor is fine, since in J2CL this is UTF-8 by default.
    return new String(toByteArray());
  }

  public native boolean isEmpty();
}
