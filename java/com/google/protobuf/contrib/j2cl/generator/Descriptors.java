package com.google.protobuf.contrib.j2cl.generator;

/** Utility methods for protobuf Descriptors. */
final class Descriptors {

  public static String calculateFileName(String javaPackage, String typeName) {
    return javaPackage.replace('.', '/') + "/" + typeName + ".java";
  }

  private Descriptors() {}
}
