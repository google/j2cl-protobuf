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

import com.google.auto.value.AutoValue;
import com.google.common.base.Ascii;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor.JavaType;
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

  public boolean isRepeated() {
    return fieldDescriptor().isRepeated() && !isMap();
  }

  public boolean isMap() {
    return fieldDescriptor().isMapField();
  }

  public String getterTemplate() {
    if (isMap()) {
      return "getter_map.vm";
    } else if (isRepeated()) {
      return "getter_repeated.vm";
    } else {
      return "getter_single.vm";
    }
  }

  public String builderTemplate() {
    if (isMap()) {
      return "builder_map.vm";
    } else if (isRepeated()) {
      return "builder_repeated.vm";
    } else {
      return "builder_single.vm";
    }
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

  public boolean isMessage() {
    return fieldDescriptor().getJavaType() == JavaType.MESSAGE;
  }

  public boolean isNullable() {
    return getBoxedType().equals(getUnboxedType());
  }

  public boolean needsConversion() {
    switch (getUnboxedType()) {
      case "float":
      case "int":
      case "long":
        return true;
      default:
        return isEnum();
    }
  }

  public String getExtendedMessage() {
    checkState(fieldDescriptor().isExtension());
    return JavaQualifiedNames.getQualifiedName(fieldDescriptor().getContainingType());
  }

  public String getFieldConverterNativeType() {
    return needsConversion() ? "java.lang.Object" : getBoxedType();
  }

  public String getFieldConverter() {
    if (!needsConversion()) {
      return "";
    } else if (isEnum()) {
      return String.format("(d) -> %s.Internal_ClosureEnum.toEnum(d)", getUnboxedType());
    } else {
      return String.format(
          "com.google.protobuf.GeneratedMessageLite.Internal_.%s_TYPE_CONVERTER",
          Ascii.toUpperCase(getUnboxedType()));
    }
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
