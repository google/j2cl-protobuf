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

import static com.google.common.base.Preconditions.checkState;

import com.google.auto.value.AutoValue;
import com.google.common.base.Ascii;
import com.google.common.collect.ImmutableSet;
import com.google.common.io.BaseEncoding;
import com.google.protobuf.ByteString;
import com.google.protobuf.Descriptors.EnumValueDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.FieldDescriptor.JavaType;
import java.util.stream.Stream;

/** Represents a field in protobuf. */
@AutoValue
public abstract class TemplateFieldDescriptor {

  public static TemplateFieldDescriptor create(
      TypeDescriptor enclosingType, FieldDescriptor fieldDescriptor, NameResolver nameResolver) {
    TypeReferenceDescriptor reference =
        TypeDescriptor.create(fieldDescriptor).createReference(enclosingType);
    return new AutoValue_TemplateFieldDescriptor(
        fieldDescriptor, enclosingType, nameResolver, reference);
  }

  abstract FieldDescriptor protoFieldDescriptor();

  abstract TypeDescriptor enclosingType();

  abstract NameResolver nameResolver();

  public abstract TypeReferenceDescriptor getType();

  public String getStem() {
    return getType().target().getStem();
  }

  public int getNumber() {
    return protoFieldDescriptor().getNumber();
  }

  public String getName() {
    return nameResolver().getJsFieldName(protoFieldDescriptor());
  }

  public String getFieldNumberName() {
    return Ascii.toUpperCase(protoFieldDescriptor().getName());
  }

  public boolean isRepeated() {
    return protoFieldDescriptor().isRepeated() && !isMap();
  }

  public boolean isMap() {
    return protoFieldDescriptor().isMapField();
  }

  public boolean isMessage() {
    return protoFieldDescriptor().getJavaType() == JavaType.MESSAGE;
  }

  public boolean isEnum() {
    return protoFieldDescriptor().getJavaType() == JavaType.ENUM;
  }

  public boolean isOneOf() {
    return protoFieldDescriptor().getRealContainingOneof() != null;
  }

  public String getOneOfName() {
    checkState(isOneOf());
    return TemplateOneOfDescriptor.create(
            enclosingType(), protoFieldDescriptor().getRealContainingOneof())
        .getSimpleName();
  }

  public boolean hasDefaultValue() {
    return protoFieldDescriptor().hasDefaultValue();
  }

  public String getDefaultValue() {
    Object defaultValue = protoFieldDescriptor().getDefaultValue();
    switch (protoFieldDescriptor().getJavaType()) {
      case BYTE_STRING:
        return calculateDefaultByteStringValue((ByteString) defaultValue);
      case DOUBLE:
        return calculateDefaultDoubleValue((Double) defaultValue);
      case FLOAT:
        return calculateDefaultFloatValue(((Float) defaultValue));
      case ENUM:
        return String.valueOf(((EnumValueDescriptor) defaultValue).getNumber());
      case BOOLEAN:
      case INT:
        return String.valueOf(defaultValue);
      case LONG:
        return calculateDefaultLongValue((Long) defaultValue);
      case STRING:
        return "'" + SourceCodeEscapers.javascriptEscaper().escape((String) defaultValue) + "'";
      default:
        throw new IllegalStateException(
            "Type " + protoFieldDescriptor().getJavaType() + " is not supported");
    }
  }

  public Stream<TypeReferenceDescriptor> getImports() {
    ImmutableSet.Builder<TypeReferenceDescriptor> imports =
        ImmutableSet.<TypeReferenceDescriptor>builder().add(getType());
    if (protoFieldDescriptor().isExtension()) {
      // Extension objects are typed with the proto they extend, so that extension can only be
      // used on protos they actually extend. In order for the JsDoc to be correct we need to
      // import the type of the extended proto.
      imports.add(createExtensionReference());
    }

    if (isMap()) {
      imports.add(
          TypeDescriptor.MAP_VIEW.createReference(enclosingType()),
          getMapKey().getType(),
          getMapValue().getType());
    }
    if (isRepeated()) {
      imports.add(TypeDescriptor.LIST_VIEW.createReference(enclosingType()));
    }

    return imports.build().stream();
  }

  private static String calculateDefaultByteStringValue(ByteString defaultValue) {
    String importName = TypeDescriptor.BYTE_STRING.getImportName();

    if (defaultValue.isEmpty()) {
      return importName + ".EMPTY";
    }

    String value = BaseEncoding.base64().encode(defaultValue.toByteArray());
    return importName + ".fromBase64String('" + value + "')";
  }

  private static String calculateDefaultDoubleValue(double defaultValue) {
    if (defaultValue == Double.POSITIVE_INFINITY) {
      return "Infinity";
    } else if (defaultValue == Double.NEGATIVE_INFINITY) {
      return "-Infinity";
    } else if (Double.isNaN(defaultValue)) {
      return "NaN";
    } else {
      return "" + defaultValue;
    }
  }

  private static String calculateDefaultFloatValue(float defaultValue) {
    if (defaultValue == Float.POSITIVE_INFINITY) {
      return "Infinity";
    } else if (defaultValue == Float.NEGATIVE_INFINITY) {
      return "-Infinity";
    } else if (Float.isNaN(defaultValue)) {
      return "NaN";
    } else {
      return "" + defaultValue;
    }
  }

  private static String calculateDefaultLongValue(long defaultValue) {
    String importName = TypeDescriptor.LONG.getImportName();
    return importName + ".fromString('" + defaultValue + "')";
  }

  public String getJsDoc() {
    // Map fields are typed dramatically different as they cannot be repeated or participate in
    // extensions. Handle them specially first.
    if (isMap()) {
      return String.format(
          "!%s<!%s, !%s>",
          TypeDescriptor.MAP_VIEW.createReference(enclosingType()).getExpression(),
          getMapKey().getType().getExpression(),
          getMapValue().getType().getExpression());
    }

    StringBuilder builder = new StringBuilder();
    if (protoFieldDescriptor().isExtension()) {
      builder.append("!").append(createExtensionReference().getExpression());
      builder.append(", ");
    }

    if (isRepeated()) {
      builder
          .append("!")
          .append(TypeDescriptor.LIST_VIEW.createReference(enclosingType()).getExpression());
      builder.append("<");
    }

    builder.append("!").append(getType().getExpression());

    if (isRepeated()) {
      builder.append(">");
    }
    return builder.toString();
  }

  public String getElementJsDoc() {
    checkState(isRepeated());
    return "!" + getType().getExpression();
  }

  public String getTemplate() {
    if (isMap()) {
      return "getter_map.vm";
    } else if (isRepeated()) {
      return "getter_repeated.vm";
    } else {
      return "getter_single.vm";
    }
  }

  public TemplateFieldDescriptor getMapKey() {
    checkState(isMap());
    FieldDescriptor keyfield = protoFieldDescriptor().getMessageType().findFieldByName("key");
    return TemplateFieldDescriptor.create(enclosingType(), keyfield, NameResolver.identity());
  }

  public TemplateFieldDescriptor getMapValue() {
    checkState(isMap());
    FieldDescriptor valueField = protoFieldDescriptor().getMessageType().findFieldByName("value");
    return TemplateFieldDescriptor.create(enclosingType(), valueField, NameResolver.identity());
  }

  private TypeReferenceDescriptor createExtensionReference() {
    checkState(protoFieldDescriptor().isExtension());
    return TypeDescriptor.create(protoFieldDescriptor().getContainingType())
        .createReference(enclosingType());
  }

  public String getProtoFileComments() {
    return Descriptors.getProtoFileComments(protoFieldDescriptor());
  }

  public boolean isDeprecated() {
    return protoFieldDescriptor().getOptions().getDeprecated();
  }

  public boolean hasHasser() {
    return Descriptors.hasHasser(protoFieldDescriptor());
  }

  /** Returns true if setter should ignore default value */
  public boolean shouldClearDefaultValue() {
    return isProto3() && !isRepeated() && !hasHasser();
  }

  private boolean isProto3() {
    return Descriptors.isProto3(protoFieldDescriptor());
  }
}
