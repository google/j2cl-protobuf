package com.google.protobuf.contrib.j2cl.integration;

import jsinterop.annotations.JsType;

/** Helper to acccess InternalChecks in J2CL tests. */
@JsType(isNative = true, name = "internalChecks", namespace = "proto.im.internal")
public class InternalChecks {

  public static native boolean isCheckType();

  public static native boolean isCheckIndex();
}
