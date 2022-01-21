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
import com.google.protobuf.DescriptorProtos.FieldOptions.JSType;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.FileDescriptor.Syntax;
import com.google.protobuf.Descriptors.GenericDescriptor;
import com.google.protobuf.Descriptors.OneofDescriptor;
import java.util.Comparator;
import java.util.stream.Stream;

/** Utility methods for protobuf Descriptors. */
public final class Descriptors {
  public static ImmutableList<ImportDescriptor> calculateImports(
      Stream<TemplateFieldDescriptor> fields) {
    return calculateImportsForTypes(fields.flatMap(TemplateFieldDescriptor::getImports));
  }

  public static ImmutableList<ImportDescriptor> calculateImportsForTypes(
      Stream<TypeReferenceDescriptor> fields) {
    return fields
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

  // TODO(b/211017789) Use hasPresence method after upgrading protobuf version
  public static boolean hasHasser(FieldDescriptor descriptor) {
    if (descriptor.isRepeated()) {
      return false;
    }
    return descriptor.getType() == FieldDescriptor.Type.MESSAGE
        || descriptor.getType() == FieldDescriptor.Type.GROUP
        || descriptor.getContainingOneof() != null
        || descriptor.getFile().getSyntax() == Syntax.PROTO2;
  }

  public static boolean isInt52(FieldDescriptor fieldDescriptor) {
    if (fieldDescriptor.getJavaType() != FieldDescriptor.JavaType.LONG) {
      return false;
    }
    return fieldDescriptor.getOptions().getJstype() != JSType.JS_STRING;
  }

  public static boolean hasMessageId(Descriptor descriptor) {
    return false;
  }

  public static boolean isMessageSet(Descriptor descriptor) {
    return descriptor.getOptions().getMessageSetWireFormat();
  }

  public static boolean hasSubmessages(Descriptor descriptor) {
    return descriptor.getFields().stream()
        .anyMatch(field -> field.getType() == FieldDescriptor.Type.MESSAGE);
  }

  public static boolean isProto3(GenericDescriptor descriptor) {
    return descriptor.getFile().getSyntax().equals(Syntax.PROTO3);
  }

  private Descriptors() {}
}
