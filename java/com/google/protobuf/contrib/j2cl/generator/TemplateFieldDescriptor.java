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
package com.google.protobuf.contrib.j2cl.generator;

import static com.google.common.base.Preconditions.checkState;
import static com.google.protobuf.contrib.immutablejs.generator.SourceCodeEscapers.javaCharEscaper;

import com.google.auto.value.AutoValue;
import com.google.protobuf.ByteString;
import com.google.protobuf.Descriptors.EnumValueDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor.JavaType;
import com.google.protobuf.Descriptors.FileDescriptor.Syntax;
import com.google.protobuf.contrib.immutablejs.generator.Descriptors;
import com.google.protobuf.contrib.immutablejs.generator.JavaQualifiedNames;
import com.google.protobuf.contrib.immutablejs.generator.NameResolver;

/** Describes a protobuf field type. */
@AutoValue
public abstract class TemplateFieldDescriptor {

  public static TemplateFieldDescriptor create(
      FieldDescriptor descriptor, NameResolver nameResolver) {
    return calculateType(descriptor, nameResolver);
  }

  private static TemplateFieldDescriptor create(
      FieldDescriptor descriptor, String stem, String qualifiedName, NameResolver nameResolver) {
    return create(descriptor, stem, qualifiedName, qualifiedName, nameResolver);
  }

  private static TemplateFieldDescriptor create(
      FieldDescriptor descriptor,
      String stem,
      String qualifiedName,
      String unboxedName,
      NameResolver nameResolver) {
    return new AutoValue_TemplateFieldDescriptor(
        descriptor, stem, qualifiedName, unboxedName, nameResolver);
  }

  private static TemplateFieldDescriptor calculateType(
      FieldDescriptor fieldDescriptor, NameResolver nameResolver) {
    switch (fieldDescriptor.getJavaType()) {
      case MESSAGE:
        return create(
            fieldDescriptor,
            "Message",
            JavaQualifiedNames.getQualifiedName(fieldDescriptor.getMessageType()),
            nameResolver);
      case BOOLEAN:
        return create(fieldDescriptor, "Boolean", "java.lang.Boolean", "boolean", nameResolver);
      case BYTE_STRING:
        return create(
            fieldDescriptor, "ByteString", "com.google.protobuf.ByteString", nameResolver);
      case DOUBLE:
        return create(fieldDescriptor, "Double", "java.lang.Double", "double", nameResolver);
      case ENUM:
        return create(
            fieldDescriptor,
            "Enum",
            JavaQualifiedNames.getQualifiedName(fieldDescriptor.getEnumType()),
            nameResolver);
      case FLOAT:
        return create(fieldDescriptor, "Float", "java.lang.Float", "float", nameResolver);
      case INT:
        return create(fieldDescriptor, "Int", "java.lang.Integer", "int", nameResolver);
      case LONG:
        return create(fieldDescriptor, "Long", "java.lang.Long", "long", nameResolver);
      case STRING:
        return create(fieldDescriptor, "String", "java.lang.String", nameResolver);
    }
    throw new IllegalStateException("Should never get here");
  }

  abstract FieldDescriptor fieldDescriptor();

  public abstract String stem();

  public abstract String getBoxedType();

  public abstract String getUnboxedType();

  public abstract NameResolver nameResolver();

  public String stemForConvertedFields() {
    switch (getUnboxedType()) {
      case "float":
      case "int":
      case "long":
        return stem();
      default:
        return "";
    }
  }

  public String getJsBoxedType() {
    boolean needsJsBoxTypeConversion = !stemForConvertedFields().isEmpty() || isEnum();
    return needsJsBoxTypeConversion ? "java.lang.Object" : getBoxedType();
  }

  public boolean isRepeated() {
    return fieldDescriptor().isRepeated() && !isMap();
  }

  public boolean isMap() {
    return fieldDescriptor().isMapField();
  }

  public boolean isOneOf() {
    return fieldDescriptor().getRealContainingOneof() != null;
  }

  public String getOneOfName() {
    checkState(isOneOf());
    return TemplateOneOfDescriptor.create(fieldDescriptor().getRealContainingOneof()).getName();
  }

  public String getterTemplate(String templateNameSuffix) {
    return String.format("getter_%s%s.vm", getTemplateKind(), templateNameSuffix);
  }

  public String builderTemplate(String templateNameSuffix) {
    return String.format("builder_%s%s.vm", getTemplateKind(), templateNameSuffix);
  }

  private String getTemplateKind() {
    return isMap() ? "map" : isRepeated() ? "repeated" : "single";
  }

  public String getName() {
    return nameResolver().getJavaFieldName(fieldDescriptor());
  }

  public String getJsName() {
    return nameResolver().getJsFieldName(fieldDescriptor());
  }

  public String getFieldNumberName() {
    return fieldDescriptor().getName().toUpperCase();
  }

  public int getNumber() {
    return fieldDescriptor().getNumber();
  }

  public boolean isEnum() {
    return fieldDescriptor().getJavaType() == JavaType.ENUM;
  }

  public boolean hasEnumValueAccessors() {
    return isEnum() && fieldDescriptor().getFile().getSyntax().equals(Syntax.PROTO3);
  }

  public boolean hasHasser() {
    return Descriptors.hasHasser(fieldDescriptor());
  }

  public boolean isMessage() {
    return fieldDescriptor().getJavaType() == JavaType.MESSAGE;
  }

  public boolean isNullable() {
    return getBoxedType().equals(getUnboxedType());
  }

  public String getUnrecognizedEnumValue() {
    EnumValueDescriptor defaultValue =
        isRepeated()
            ? fieldDescriptor().getEnumType().getValues().get(0)
            : (EnumValueDescriptor) fieldDescriptor().getDefaultValue();

    // If both the reference and the enum itself are proto3 then we use the implicit UNRECOGNIZED,
    // otherwise we use the default value.
    String name =
        Descriptors.isProto3(fieldDescriptor())
                && TemplateEnumDescriptor.create(fieldDescriptor().getEnumType())
                    .hasUnrecognizedValue()
            ? "UNRECOGNIZED"
            : defaultValue.getName();
    return getUnboxedType() + "." + name;
  }

  public String getDefaultValue() {
    switch (fieldDescriptor().getJavaType()) {
      case BOOLEAN:
      case INT:
      case DOUBLE:
        return getDefaultForSimpleType();
      case LONG:
        return getDefaultForSimpleType() + "L";
      case FLOAT:
        return getDefaultForSimpleType() + "f";
      case STRING:
        return "\"" + javaCharEscaper().escape(getDefaultForSimpleType()) + "\"";
      case ENUM:
        EnumValueDescriptor defaultEnum = (EnumValueDescriptor) fieldDescriptor().getDefaultValue();
        return getUnboxedType() + "." + defaultEnum.getName();
      case BYTE_STRING:
        ByteString defaultByteString = (ByteString) fieldDescriptor().getDefaultValue();
        if (defaultByteString.isEmpty()) {
          return getUnboxedType() + ".EMPTY";
        }
        return getUnboxedType() + ".copyFromUtf8(\"" + defaultByteString.toStringUtf8() + "\")";
      case MESSAGE:
        return getUnboxedType() + ".getDefaultInstance()";
    }

    throw new AssertionError("Unsupported java type: " + fieldDescriptor().getJavaType());
  }

  private String getDefaultForSimpleType() {
    return String.valueOf(fieldDescriptor().getDefaultValue());
  }

  public String getExtendedMessage() {
    checkState(fieldDescriptor().isExtension());
    return JavaQualifiedNames.getQualifiedName(fieldDescriptor().getContainingType());
  }

  public TemplateFieldDescriptor getKeyField() {
    checkState(isMap(), "Field key type only exists for map fields.");
    FieldDescriptor keyField = fieldDescriptor().getMessageType().findFieldByName("key");
    return create(keyField, NameResolver.identity());
  }

  public TemplateFieldDescriptor getValueField() {
    checkState(isMap(), "Field value type only exists for map fields.");
    FieldDescriptor valueField = fieldDescriptor().getMessageType().findFieldByName("value");
    return create(valueField, NameResolver.identity());
  }
}
