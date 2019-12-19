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
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.Descriptor;
import java.util.List;

/** Represents a protocol message */
@AutoValue
public abstract class TemplateMessageDescriptor extends AbstractTemplateTypeDescriptor {
  public static TemplateMessageDescriptor create(Descriptor descriptor) {
    return new AutoValue_TemplateMessageDescriptor(descriptor);
  }

  @Override
  abstract Descriptor descriptor();

  @Override
  Descriptor getContainingType() {
    return descriptor().getContainingType();
  }

  public boolean isTopLevelMessage() {
    return descriptor().getContainingType() == null;
  }

  public List<TemplateFieldDescriptor> getFields() {
    return descriptor()
        .getFields()
        .stream()
        .map(TemplateFieldDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getExtensions() {
    return descriptor().getExtensions().stream()
        .map(TemplateFieldDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public List<TemplateEnumDescriptor> getEnums() {
    return descriptor()
        .getEnumTypes()
        .stream()
        .map(TemplateEnumDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public List<TemplateMessageDescriptor> getMessages() {
    return descriptor()
        .getNestedTypes()
        .stream()
        .map(TemplateMessageDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateOneOfDescriptor> getOneOfs() {
    return descriptor().getOneofs().stream()
        .map(TemplateOneOfDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }
}
