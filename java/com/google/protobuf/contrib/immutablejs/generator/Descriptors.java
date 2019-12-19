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

import com.google.common.base.Splitter;
import com.google.common.base.Strings;
import com.google.common.collect.ImmutableList;
import com.google.protobuf.DescriptorProtos.SourceCodeInfo.Location;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.OneofDescriptor;
import com.google.protobuf.contrib.descriptor.SourceInfoProvider;
import java.util.Comparator;
import java.util.stream.Stream;

/** Utility methods for protobuf Descriptors. */
final class Descriptors {
  private static final SourceInfoProvider sourceInfoProvider = new SourceInfoProvider();

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

  public static String getProtoFileComments(EnumDescriptor descriptor) {
    return formatComments(sourceInfoProvider.getLocation(descriptor));
  }

  public static String getProtoFileComments(Descriptor descriptor) {
    return formatComments(sourceInfoProvider.getLocation(descriptor));
  }

  public static String getProtoFileComments(FieldDescriptor descriptor) {
    return formatComments(sourceInfoProvider.getLocation(descriptor));
  }

  public static String getProtoFileComments(OneofDescriptor descriptor) {
    return formatComments(sourceInfoProvider.getLocation(descriptor));
  }

  private static String formatComments(Location location) {
    if (location == null) {
      return null;
    }
    return Strings.emptyToNull(
        String.join(
            " ",
            Splitter.on('\n')
                .split(
                    location
                        .getLeadingComments()
                        .trim()
                        // @ characters are used for types in JsDoc.
                        .replace("@", "&#64;")
                        // * characters will break comments.
                        .replace("/*", "/&#42;")
                        .replace("*/", "*&#47;"))));
  }

  private Descriptors() {}
}
