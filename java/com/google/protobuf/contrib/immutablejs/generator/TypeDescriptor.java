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

import com.google.auto.value.AutoValue;
import com.google.auto.value.extension.memoized.Memoized;
import com.google.common.io.Files;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.FileDescriptor;
import java.util.Optional;

/**
 * A container for a type.
 *
 * <p>Types are either primitives, closure classes, Messages or Enums.
 */
@AutoValue
public abstract class TypeDescriptor {

  private static final String MODULE_NAME_PREFIX = "improto.";

  static final TypeDescriptor LONG = createClosureType("goog.math.Long", "Long");
  static final TypeDescriptor INT52_LONG = createClosureType("goog.math.Long", "Int52Long");
  static final TypeDescriptor BYTE_STRING = createClosureType("proto.im.ByteString", "ByteString");
  static final TypeDescriptor LIST_VIEW = createClosureType("proto.im.ListView", "List");

  public static TypeDescriptor create(FieldDescriptor fieldDescriptor) {
    switch (fieldDescriptor.getJavaType()) {
      case BOOLEAN:
        return createPrimitive("boolean", "Boolean");
      case STRING:
        return createPrimitive("string", "String");
      case DOUBLE:
      case FLOAT:
        return createPrimitive("number", "Double");
      case INT:
        return createPrimitive("number", "Int");
      case LONG:
        return LONG;
      case BYTE_STRING:
        return BYTE_STRING;
      case ENUM:
        return create(fieldDescriptor.getEnumType());
      case MESSAGE:
        return create(fieldDescriptor.getMessageType());
    }

    throw new AssertionError(fieldDescriptor);
  }

  public static TypeDescriptor create(Descriptor descriptor) {
    return newBuilder()
        .setStem("Message")
        .setName(descriptor.getName())
        .setModuleName(MODULE_NAME_PREFIX + descriptor.getFullName())
        .setParent(Optional.ofNullable(descriptor.getContainingType()))
        .build();
  }

  public static TypeDescriptor create(EnumDescriptor descriptor) {
    return newBuilder()
        .setStem("Int")
        .setName(descriptor.getName())
        .setModuleName(MODULE_NAME_PREFIX + descriptor.getFullName())
        .setParent(Optional.ofNullable(descriptor.getContainingType()))
        .build();
  }

  public static TypeDescriptor create(FileDescriptor descriptor) {
    String pkg = descriptor.getPackage().isEmpty() ? "" : (descriptor.getPackage() + ".");
    String fullName = pkg + Files.getNameWithoutExtension(descriptor.getName()).replace('-', '_');
    return newBuilder()
        .setStem("")
        .setName(descriptor.getName())
        .setModuleName(MODULE_NAME_PREFIX + fullName)
        .build();
  }

  private static TypeDescriptor createPrimitive(String primitiveType, String stem) {
    return newBuilder().setStem(stem).setName(primitiveType).setModuleName("").build();
  }

  private static TypeDescriptor createClosureType(String closureType, String stem) {
    return newBuilder().setStem(stem).setName(closureType).setModuleName(closureType).build();
  }

  private static Builder newBuilder() {
    return new AutoValue_TypeDescriptor.Builder();
  }

  @AutoValue.Builder
  abstract static class Builder {
    abstract Builder setStem(String type);

    abstract Builder setName(String stem);

    abstract Builder setModuleName(String stem);

    abstract Builder setParent(Optional<Descriptor> parent);

    abstract TypeDescriptor build();
  }

  public abstract String getStem();

  public abstract String getName();

  public abstract String getModuleName();

  abstract Optional<Descriptor> getParent();

  @Memoized
  TypeDescriptor getTopLevelTypeDescriptor() {
    return getParent().map(p -> create(p).getTopLevelTypeDescriptor()).orElse(this);
  }

  public final String getLocalName() {
    return getTopLevelTypeDescriptor().getName() + getRelativeName();
  }

  public final String getImportName() {
    return getTopLevelTypeDescriptor().getModuleName().replace('.', '_') + getRelativeName();
  }

  public final String getModuleGetName() {
    return String.format("goog.module.get('%s')", getTopLevelTypeDescriptor().getModuleName())
        + getRelativeName();
  }

  private final String getRelativeName() {
    return getModuleName().substring(getTopLevelTypeDescriptor().getModuleName().length());
  }

  public final boolean isTopLevel() {
    return !getParent().isPresent();
  }

  public final boolean hasSameParent(TypeDescriptor other) {
    return other.getTopLevelTypeDescriptor().equals(getTopLevelTypeDescriptor());
  }

  public final ImportDescriptor createImport() {
    return new AutoValue_ImportDescriptor(
        getTopLevelTypeDescriptor().getModuleName(), getTopLevelTypeDescriptor().getImportName());
  }

  public final TypeReferenceDescriptor createReference(TypeDescriptor context) {
    return new AutoValue_TypeReferenceDescriptor(context, this);
  }
}
