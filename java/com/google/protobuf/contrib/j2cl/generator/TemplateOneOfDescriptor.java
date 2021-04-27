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


import com.google.auto.value.AutoValue;
import com.google.common.base.Ascii;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.OneofDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.JavaQualifiedNames;
import com.google.protos.j2cl.Options;
import com.google.protos.protobuf.contrib.j2cl.options.JsEnum;
import java.util.ArrayList;
import java.util.List;

/** Represents a protocol buffer union */
@AutoValue
public abstract class TemplateOneOfDescriptor extends AbstractTemplateTypeDescriptor {

  public static TemplateOneOfDescriptor create(OneofDescriptor oneofDescriptor) {
    return new AutoValue_TemplateOneOfDescriptor(oneofDescriptor);
  }

  @Override
  abstract OneofDescriptor descriptor();

  @Override
  Descriptor getContainingType() {
    return descriptor().getContainingType();
  }

  @Override
  public String getName() {
    return JavaQualifiedNames.underscoresToCamelCase(descriptor().getName(), true) + "Case";
  }

  public boolean isDense() {
    // TODO(b/143500098): support dense in oneofs.
    return false;
  }

  public boolean isJsEnum() {
    return descriptor().getOptions().getExtension(JsEnum.generateJsCaseEnum)
        || descriptor().getOptions().getExtension(Options.oneofOptions).getGenerateJsEnum();
  }

  public List<FieldDescriptor> getFields() {
    return descriptor().getFields();
  }

  public List<TemplateEnumValueDescriptor> getValues() {
    List<TemplateEnumValueDescriptor> values = new ArrayList<>();
    String defaultValueName = getDefaultValueName();
    values.add(TemplateEnumValueDescriptor.create(defaultValueName, 0));
    descriptor().getFields().forEach(e -> values.add(createEnumValue(e)));
    return values;
  }

  private static TemplateEnumValueDescriptor createEnumValue(FieldDescriptor fd) {
    return TemplateEnumValueDescriptor.create(getEnumValueName(fd), fd.getNumber());
  }

  public static String getEnumValueName(FieldDescriptor oneOfField) {
    return Ascii.toUpperCase(oneOfField.getName());
  }

  private String getDefaultValueName() {
    return Ascii.toUpperCase(descriptor().getName().replace("_", "")) + "_NOT_SET";
  }

  public String getDefaultValue() {
    return getName() + "." + getDefaultValueName();
  }

  /** Represents a protocol buffer union's getter field */
  @AutoValue
  public abstract static class OneOfField {
    abstract TemplateOneOfDescriptor oneOf();

    public String getName() {
      return oneOf().getName();
    }

    public String getJsName() {
      // Doesn't have the risk of collision due to 'Case' suffix so we can simply return name.
      return getName();
    }

    // TODO(goktug): Rename to getType.
    public String getUnboxedType() {
      return oneOf().getName();
    }

    public boolean isRepeated() {
      return false;
    }

    public boolean isEnum() {
      return true;
    }

    public String getDefaultValue() {
      return oneOf().getDefaultValue();
    }
  }

  public OneOfField asField() {
    return new AutoValue_TemplateOneOfDescriptor_OneOfField(this);
  }

  /** Always returns {@code false} because oneof enums don't have an UNRECOGNIZED value. */
  public boolean hasUnrecognizedValue() {
    return false;
  }
}
