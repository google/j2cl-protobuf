package com.google.protobuf;

import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

/** J2CL emulation of Message. */
@JsType(isNative = true, name = "?", namespace = JsPackage.GLOBAL)
public interface Message extends MessageLite {

  /** J2CL emulation of Message.Builder. */
  @JsType(isNative = true, name = "?", namespace = JsPackage.GLOBAL)
  interface Builder extends MessageLite.Builder {}
}
