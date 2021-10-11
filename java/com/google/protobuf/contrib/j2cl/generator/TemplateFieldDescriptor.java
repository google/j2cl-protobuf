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
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.protobuf.contrib.immutablejs.generator.SourceCodeEscapers.javaCharEscaper;

import com.google.auto.value.AutoValue;
import com.google.common.base.Defaults;
import com.google.protobuf.ByteString;
import com.google.protobuf.Descriptors.EnumValueDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor.JavaType;
import com.google.protobuf.Descriptors.FileDescriptor.Syntax;
import com.google.protobuf.contrib.immutablejs.generator.JavaQualifiedNames;
import com.google.protobuf.contrib.immutablejs.generator.JavaScriptQualifiedNames;

/** Describes a protobuf field type. */
@AutoValue
public abstract class TemplateFieldDescriptor {

  public static TemplateFieldDescriptor create(FieldDescriptor descriptor) {
    return calculateType(descriptor);
  }

  private static TemplateFieldDescriptor create(
      FieldDescriptor descriptor, String stem, String qualifiedName) {
    return create(descriptor, stem, qualifiedName, qualifiedName);
  }

  private static TemplateFieldDescriptor create(
      FieldDescriptor descriptor, String stem, String qualifiedName, String unboxedName) {
    return new AutoValue_TemplateFieldDescriptor(descriptor, stem, qualifiedName, unboxedName);
  }

  private static TemplateFieldDescriptor calculateType(FieldDescriptor fieldDescriptor) {
    switch (fieldDescriptor.getJavaType()) {
      case MESSAGE:
        return create(
            fieldDescriptor,
            "Message",
            JavaQualifiedNames.getQualifiedName(fieldDescriptor.getMessageType()));
      case BOOLEAN:
        return create(fieldDescriptor, "Boolean", "java.lang.Boolean", "boolean");
      case BYTE_STRING:
        return create(fieldDescriptor, "ByteString", "com.google.protobuf.ByteString");
      case DOUBLE:
        return create(fieldDescriptor, "Double", "java.lang.Double", "double");
      case ENUM:
        return create(
            fieldDescriptor,
            "Enum",
            JavaQualifiedNames.getQualifiedName(fieldDescriptor.getEnumType()));
      case FLOAT:
        return create(fieldDescriptor, "Float", "java.lang.Float", "float");
      case INT:
        return create(fieldDescriptor, "Int", "java.lang.Integer", "int");
      case LONG:
        return create(fieldDescriptor, "Long", "java.lang.Long", "long");
      case STRING:
        return create(fieldDescriptor, "String", "java.lang.String");
    }
    throw new IllegalStateException("Should never get here");
  }

  abstract FieldDescriptor fieldDescriptor();

  public abstract String stem();

  public abstract String getBoxedType();

  public abstract String getUnboxedType();

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
    return JavaQualifiedNames.getFieldName(fieldDescriptor(), !fieldDescriptor().isExtension());
  }

  public String getJsName() {
    return JavaScriptQualifiedNames.getFieldName(
        fieldDescriptor(), !fieldDescriptor().isExtension());
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

  public boolean isMessage() {
    return fieldDescriptor().getJavaType() == JavaType.MESSAGE;
  }

  public boolean isNullable() {
    return getBoxedType().equals(getUnboxedType());
  }

  public String getDefaultValue() {
    Object defaultValue =
        fieldDescriptor().hasDefaultValue() ? fieldDescriptor().getDefaultValue() : null;

    switch (fieldDescriptor().getJavaType()) {
      case BOOLEAN:
        return String.valueOf(nullToDefault(defaultValue, boolean.class));
      case INT:
        return String.valueOf(nullToDefault(defaultValue, int.class));
      case LONG:
        return nullToDefault(defaultValue, long.class) + "L";
      case DOUBLE:
        return nullToDefault(defaultValue, double.class) + "d";
      case FLOAT:
        return nullToDefault(defaultValue, float.class) + "f";
      case STRING:
        return "\"" + javaCharEscaper().escape(nullToEmpty((String) defaultValue)) + "\"";
      case ENUM:
        String defaultEnumName =
            TemplateEnumDescriptor.create(fieldDescriptor().getEnumType())
                .getDefaultValueName((EnumValueDescriptor) defaultValue);
        return getUnboxedType() + "." + defaultEnumName;
      case BYTE_STRING:
        ByteString defaultByteString = (ByteString) defaultValue;
        if (defaultByteString != null) {
          return getUnboxedType() + ".copyFromUtf8(\"" + defaultByteString.toStringUtf8() + "\")";
        }
        return "com.google.protobuf.ByteString.EMPTY";
      case MESSAGE:
        return getUnboxedType() + ".getDefaultInstance()";
    }

    throw new AssertionError("Unsupported java type: " + fieldDescriptor().getJavaType());
  }

  private Object nullToDefault(Object value, Class<?> defaultValueClass) {
    return value == null ? Defaults.defaultValue(defaultValueClass) : value;
  }

  public String getExtendedMessage() {
    checkState(fieldDescriptor().isExtension());
    return JavaQualifiedNames.getQualifiedName(fieldDescriptor().getContainingType());
  }

  public String getFieldConverterNativeType() {
    return needsConversion() ? "java.lang.Object" : getBoxedType();
  }

  private boolean needsConversion() {
    return !stemForConvertedFields().isEmpty() || isEnum();
  }

  public String getFieldConverter() {
    if (isEnum()) {
      return String.format(
          ", (d) -> %s.Internal_ClosureEnum.toEnum(d, %s)", getUnboxedType(), getDefaultValue());
    }
    return "";
  }

  public String getExtensionFieldConverter() {
    if (isEnum()) {
      String enumReadConverter = getFieldConverter();
      String enumWriteConverter =
          String.format("v -> %s.Internal_ClosureEnum.toClosureValue(v)", getUnboxedType());
      return String.format("%s, %s", enumReadConverter, enumWriteConverter);
    }
    return "";
  }

  public TemplateFieldDescriptor getKeyField() {
    checkState(isMap(), "Field key type only exists for map fields.");
    return create(fieldDescriptor().getMessageType().findFieldByName("key"));
  }

  public TemplateFieldDescriptor getValueField() {
    checkState(isMap(), "Field value type only exists for map fields.");
    return create(fieldDescriptor().getMessageType().findFieldByName("value"));
  }
}
