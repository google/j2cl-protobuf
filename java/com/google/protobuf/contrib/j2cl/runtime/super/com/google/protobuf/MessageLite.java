package com.google.protobuf;

import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

/** J2CL emulation of MessageLite. */
@JsType(isNative = true, name = "?", namespace = JsPackage.GLOBAL)
public interface MessageLite {

  Builder toBuilder();

  /** J2CL emulation of MessageLite.Builder. */
  @JsType(isNative = true, name = "?", namespace = JsPackage.GLOBAL)
  interface Builder {

    Builder clone();

    MessageLite build();
  }
}
