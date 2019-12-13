package com.google.protobuf.contrib.immutablejs.generator;

import com.google.common.base.Ascii;
import com.google.common.collect.ImmutableMap;
import com.google.protobuf.Descriptors;
import com.google.protobuf.contrib.JavaQualifiedNames;

/** Helper class for generating fully qualified JS/J2CL identifiers for descriptors. */
public final class JavaScriptQualifiedNames {

  private JavaScriptQualifiedNames() {}

  private static final ImmutableMap<String, String> SPECIAL_CASES =
      ImmutableMap.of("extension", "extension_");

  /** Returns the JavaScript compatible name for a proto field. */
  public static String getFieldName(
      Descriptors.FieldDescriptor field, boolean capitalizeFirstLetter) {
    String fieldName = field.getName();
    if (SPECIAL_CASES.containsKey(fieldName)) {
      String output = SPECIAL_CASES.get(fieldName);
      if (capitalizeFirstLetter) {
        return capitalizeFirstLetter(output);
      } else {
        return output;
      }
    }

    return JavaQualifiedNames.getFieldName(field, capitalizeFirstLetter);
  }

  private static String capitalizeFirstLetter(String input) {
    return Ascii.toUpperCase(input.charAt(0)) + input.substring(1);
  }
}
