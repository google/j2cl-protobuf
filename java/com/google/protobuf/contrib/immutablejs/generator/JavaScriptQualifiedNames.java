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
package com.google.protobuf.contrib.immutablejs.generator;

import com.google.common.base.Ascii;
import com.google.common.collect.ImmutableMap;
import com.google.protobuf.Descriptors;

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
