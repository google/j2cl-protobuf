/*
 * Copyright 2021 Google LLC
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

import com.google.auto.value.AutoValue;
import com.google.common.base.Function;
import com.google.common.collect.ImmutableSet;
import com.google.protobuf.Descriptors.FieldDescriptor;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Helper class for resolving name conflict for JS/J2CL field names. This resolving logic mimics
 * official java proto that append the field number to the field name to avoid conflict
 */
@AutoValue
public abstract class NameResolver {

  private static final ImmutableSet<String> JS_RESERVED_FIELD_NAMES =
      ImmutableSet.of("Extension", "ExtensionCount", "ExtensionAtIndex");

  /**
   * Returns a NameResolver instance for single FieldDescriptor.
   *
   * <p>This instance does not handle conflicts and should not be used if the name of the proto
   * field may conflict with another field after the underscoresToCamelCase transformation of the
   * latter. This instance does not apply any transformation to the proto field name and reuse it as
   * is for resolving the java and javascript field names.
   */
  public static NameResolver identity() {
    return create(FieldDescriptor::getName, FieldDescriptor::getName);
  }

  /** Returns a NameResolver instance for list of fieldDescriptors */
  public static NameResolver of(List<FieldDescriptor> fieldsDescriptors) {
    return create(
        getNameResolver(fieldsDescriptors, ImmutableSet.of()),
        getNameResolver(fieldsDescriptors, JS_RESERVED_FIELD_NAMES));
  }

  private static NameResolver create(
      Function<FieldDescriptor, String> resolvedJavaFieldNames,
      Function<FieldDescriptor, String> resolvedJsFieldNames) {
    return new AutoValue_NameResolver(resolvedJavaFieldNames, resolvedJsFieldNames);
  }

  abstract Function<FieldDescriptor, String> resolvedJavaFieldNames();

  abstract Function<FieldDescriptor, String> resolvedJsFieldNames();

  /** Returns the unique Java name for a proto field. */
  public String getJavaFieldName(FieldDescriptor field) {
    return resolvedJavaFieldNames().apply(field);
  }

  /** Returns the unique JavaScript name for a proto field. */
  public String getJsFieldName(FieldDescriptor field) {
    return resolvedJsFieldNames().apply(field);
  }

  private static Function<FieldDescriptor, String> getNameResolver(
      List<FieldDescriptor> fieldsDescriptors, Set<String> reservedNames) {
    Set<FieldDescriptor> conflictingFields = getConflictingFields(fieldsDescriptors, reservedNames);
    return (FieldDescriptor field) -> resolveFieldName(field, conflictingFields.contains(field));
  }

  private static String resolveFieldName(FieldDescriptor field, boolean isConflicting) {
    String fieldName = getFieldName(field);
    return isConflicting ? fieldName + field.getNumber() : fieldName;
  }

  private static Set<FieldDescriptor> getConflictingFields(
      List<FieldDescriptor> fieldsDescriptors, Set<String> reservedNames) {
    Map<String, Object> fieldsByConflictingName =
        reservedNames.stream().collect(Collectors.toMap(n -> n, n -> new Object()));
    Set<FieldDescriptor> conflictingFields = new HashSet<>();

    for (FieldDescriptor field : fieldsDescriptors) {
      String name = getFieldName(field);
      checkFieldNameConflict(name, field, fieldsByConflictingName, conflictingFields);
      if (field.isRepeated()) {
        checkFieldNameConflict(name + "Count", field, fieldsByConflictingName, conflictingFields);
        checkFieldNameConflict(name + "List", field, fieldsByConflictingName, conflictingFields);
      }
    }
    return conflictingFields;
  }

  private static String getFieldName(FieldDescriptor field) {
    // Group fields are special as it simultaneously defines both a field name and a type name. The
    // field name will always be in Upperfirstcase despite the case of the type name (typically
    // CamelCase). The Java API is generated using the type name rather than the field names, which
    // is unlike every other field type.
    if (field.getType() == FieldDescriptor.Type.GROUP) {
      return JavaQualifiedNames.underscoresToCamelCase(
          field.getMessageType().getName(), /* capitalizeNextLetter= */ true);
    }
    return JavaQualifiedNames.getFieldName(field, !field.isExtension());
  }

  private static void checkFieldNameConflict(
      String reservedName,
      FieldDescriptor field,
      Map<String, Object> fieldsByConflictingName,
      Set<FieldDescriptor> conflictingFields) {
    Object conflictingField = fieldsByConflictingName.put(reservedName, field);

    if (conflictingField != null) {
      if (conflictingField instanceof FieldDescriptor) {
        conflictingFields.add((FieldDescriptor) conflictingField);
      }
      conflictingFields.add(field);
    }
  }
}
