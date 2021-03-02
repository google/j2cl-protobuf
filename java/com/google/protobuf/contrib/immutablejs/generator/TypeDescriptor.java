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
import com.google.protobuf.DescriptorProtos.FieldOptions.JSType;
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

  public static final TypeDescriptor BOOLEAN = createPrimitive("boolean", "Boolean");
  public static final TypeDescriptor STRING = createPrimitive("string", "String");
  public static final TypeDescriptor FLOAT = createPrimitive("number", "Double");
  public static final TypeDescriptor INT = createPrimitive("number", "Int");
  public static final TypeDescriptor UINT = createPrimitive("number", "UInt");
  public static final TypeDescriptor LONG = createClosureType("goog.math.Long", "Long");
  public static final TypeDescriptor INT52_LONG = createClosureType("goog.math.Long", "Int52Long");
  public static final TypeDescriptor BYTE_STRING =
      createClosureType("proto.im.ByteString", "ByteString");
  public static final TypeDescriptor LIST_VIEW = createClosureType("proto.im.ListView", "List");
  public static final TypeDescriptor MAP_VIEW = createClosureType("proto.im.MapView", "Map");
  public static final TypeDescriptor INTERNAL_MESSAGE =
      createClosureType("proto.im.internal.InternalMessage", /* stem= */ "");
  public static final TypeDescriptor JSPB_KERNEL =
      createClosureType("proto.im.JspbKernel", /* stem= */ "");

  public static TypeDescriptor create(FieldDescriptor fieldDescriptor) {
    switch (fieldDescriptor.getJavaType()) {
      case BOOLEAN:
        return BOOLEAN;
      case STRING:
        return STRING;
      case DOUBLE:
      case FLOAT:
        return FLOAT;
      case INT:
        if (fieldDescriptor.getType() == FieldDescriptor.Type.UINT32) {
          return UINT;
        }
        return INT;
      case LONG:
        if (fieldDescriptor.getOptions().getJstype() != JSType.JS_STRING) {
          return INT52_LONG;
        }
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

  public static TypeDescriptor createClosureType(String closureType, String stem) {
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

  @Memoized
  public String getLocalName() {
    String localName =
        isTopLevel() ? getName() : getTopLevelTypeDescriptor().getLocalName() + getRelativeName();

    if (JsReservedWords.isReverved(localName) && !getModuleName().isEmpty()) {
      // Rename non-primtive types that may collide with Closure builtins.
      localName = "_" + localName;
    }

    return localName;
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
