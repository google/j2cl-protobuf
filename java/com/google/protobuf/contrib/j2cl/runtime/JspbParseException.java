package com.google.protobuf.contrib.j2cl.runtime;

/** Denotes a problem that is occurred while parsing a JSPB message. */
public class JspbParseException extends Exception {
  public JspbParseException(Throwable cause) {
    super(cause);
  }
}
