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

import com.google.common.collect.ImmutableMap;
import com.google.protobuf.Descriptors.FieldDescriptor;

final class JavaScriptQualifiedNames {

  private JavaScriptQualifiedNames() {}

  private static final ImmutableMap<String, String> SPECIAL_CASES =
      ImmutableMap.of(
          "Extension",
          "Extension_",
          "extension",
          "extension_",
          "ExtensionCount",
          "ExtensionCount_",
          "extensionCount",
          "extensionCount_");

  /** Returns the JavaScript compatible name for a proto field. */
  public static String getFieldName(FieldDescriptor field, boolean capitalizeFirstLetter) {
    String javaFieldName = JavaQualifiedNames.getFieldName(field, capitalizeFirstLetter);
    return SPECIAL_CASES.getOrDefault(javaFieldName, javaFieldName);
  }
}
