package com.google.protobuf.contrib.j2cl.runtime;

import com.google.protobuf.Message;
import com.google.protobuf.MessageLite;
import jsinterop.annotations.JsFunction;
import jsinterop.annotations.JsType;

/** Utilities for serialization/deserialization of protos in JSPB format. */
public final class JspbUtils {

  /** Serializes a proto to a jspb string */
  public static String toJspbString(MessageLite m) {
    return ((Message) m).serialize();
  }

  /** Parses a proto from a jspb string */
  public static <M extends MessageLite> M fromJspbString(String jspbString, M prototype)
      throws JspbParseException {
    try {
      return ((Message<M, ?>) prototype).getParserForType().parse(jspbString);
    } catch (JsException e) {
      throw new JspbParseException(e);
    }
  }

  @JsType(isNative = true, name = "Message", namespace = "proto.im")
  private static class Message<M, B> {
    public native String serialize();

    public native Parser<M> getParserForType();
  }

  @JsFunction
  private interface Parser<M> {
    M parse(String json);
  }

  private JspbUtils() {}
}
