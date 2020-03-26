/*
 * Copyright 2020 Google LLC
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
package com.google.protobuf.contrib.immutablejs.generator;

import com.google.common.collect.ImmutableMap;
import com.google.protobuf.Descriptors;

/** Helper class for generating fully qualified Java/GWT identifiers for descriptors. */
final class JavaQualifiedNames {
  private JavaQualifiedNames() {}

  /** A map that stores special cases for underscoresToCamelCase. */
  private static final ImmutableMap<String, String> SPECIAL_CASES =
      ImmutableMap.<String, String>builder()
          .put("cached_size", "CachedSize_")
          .put("class", "Class_")
          .put("serialized_size", "SerializedSize_")
          .build();

  /** Returns the Java name for a proto field. */
  public static String getFieldName(
      Descriptors.FieldDescriptor field, boolean capitalizeFirstLetter) {
    String fieldName = field.getName();
    if (SPECIAL_CASES.containsKey(fieldName)) {
      String output = SPECIAL_CASES.get(fieldName);
      if (capitalizeFirstLetter) {
        return output;
      } else {
        return ((char) (output.charAt(0) + ('a' - 'A'))) + output.substring(1);
      }
    }
    return underscoresToCamelCase(fieldName, capitalizeFirstLetter);
  }

  /** Converts underscore field names to camel case, while preserving camel case field names. */
  public static String underscoresToCamelCase(String input, boolean capitalizeNextLetter) {
    StringBuilder result = new StringBuilder();
    for (int i = 0; i < input.length(); i++) {
      char ch = input.charAt(i);
      if ('a' <= ch && ch <= 'z') {
        if (capitalizeNextLetter) {
          result.append((char) (ch + ('A' - 'a')));
        } else {
          result.append(ch);
        }
        capitalizeNextLetter = false;
      } else if ('A' <= ch && ch <= 'Z') {
        if (i == 0 && !capitalizeNextLetter) {
          // Force first letter to lower-case unless explicitly told to
          // capitalize it.
          result.append((char) (ch + ('a' - 'A')));
        } else {
          // Capital letters after the first are left as-is.
          result.append(ch);
        }
        capitalizeNextLetter = false;
      } else if ('0' <= ch && ch <= '9') {
        result.append(ch);
        capitalizeNextLetter = true;
      } else {
        capitalizeNextLetter = true;
      }
    }
    return result.toString();
  }
}
