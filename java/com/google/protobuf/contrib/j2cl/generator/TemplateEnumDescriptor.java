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

import static com.google.common.collect.ImmutableList.toImmutableList;

import com.google.auto.value.AutoValue;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.EnumValueDescriptor;
import com.google.protos.protobuf.contrib.j2cl.options.JsEnum;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** Represents a proto buffer enum */
@AutoValue
public abstract class TemplateEnumDescriptor extends AbstractTemplateTypeDescriptor {
  public static TemplateEnumDescriptor create(EnumDescriptor enumDescriptor) {
    return new AutoValue_TemplateEnumDescriptor(enumDescriptor);
  }

  @Override
  abstract EnumDescriptor descriptor();

  @Override
  Descriptor getContainingType() {
    return descriptor().getContainingType();
  }

  public List<TemplateEnumValueDescriptor> getValues() {
    Set<Integer> seen = new HashSet<>();
    return descriptor().getValues().stream()
        .map(e -> createEnumValue(e, !seen.add(e.getNumber())))
        .collect(toImmutableList());
  }

  private static TemplateEnumValueDescriptor createEnumValue(EnumValueDescriptor e, boolean alias) {
    return TemplateEnumValueDescriptor.create(e.getName(), e.getNumber(), alias);
  }

  public boolean isJsEnum() {
    return descriptor().getOptions().getExtension(JsEnum.generateJsEnum);
  }

  public boolean isDense() {
    List<TemplateEnumValueDescriptor> values = getValues();
    for (int i = 0; i < values.size(); i++) {
      if (values.get(i).getNumber() != i) {
        return false;
      }
    }
    return true;
  }
}
