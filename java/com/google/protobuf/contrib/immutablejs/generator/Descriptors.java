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

import static com.google.common.collect.ImmutableList.toImmutableList;

import java.util.Comparator;
import com.google.common.collect.ImmutableList;
import java.util.stream.Stream;

/** Utility methods for protobuf Descriptors. */
final class Descriptors {
  public static ImmutableList<ImportDescriptor> calculateImports(
      Stream<TemplateFieldDescriptor> fields) {
    return fields
        .flatMap(TemplateFieldDescriptor::getImports)
        .filter(TypeReferenceDescriptor::needsImport)
        .map(TypeReferenceDescriptor::target)
        .map(TypeDescriptor::createImport)
        .distinct()
        .sorted(Comparator.comparing(ImportDescriptor::getModuleName))
        .collect(toImmutableList());
  }

  public static String getProtoFileComments(Object descriptor) {
    return null;
  }

  private Descriptors() {}
}
