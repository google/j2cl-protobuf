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
