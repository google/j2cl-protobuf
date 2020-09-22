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
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.OneofDescriptor;

/** Represents a protocol buffer union. */
@AutoValue
public abstract class TemplateOneOfDescriptor {

  /** Represents an entry in a protocol buffer union. */
  @AutoValue
  public abstract static class OneOfEntry {
    public static OneOfEntry create(FieldDescriptor fieldDescriptor) {
      return new AutoValue_TemplateOneOfDescriptor_OneOfEntry(fieldDescriptor);
    }

    abstract FieldDescriptor fieldDescriptor();

    public String getName() {
      return fieldDescriptor().getName().toUpperCase();
    }

    public int getNumber() {
      return fieldDescriptor().getNumber();
    }

    public boolean isDeprecated() {
      return fieldDescriptor().getOptions().getDeprecated();
    }
  }

  public static TemplateOneOfDescriptor create(
      TypeDescriptor enclosingType, OneofDescriptor oneofDescriptor) {
    return new AutoValue_TemplateOneOfDescriptor(enclosingType, oneofDescriptor);
  }

  abstract TypeDescriptor enclosingType();

  abstract OneofDescriptor descriptor();

  public String getLocalTypeName() {
    return enclosingType().getLocalName() + "." + getSimpleName();
  }

  public String getSimpleName() {
    return JavaQualifiedNames.underscoresToCamelCase(descriptor().getName(), true) + "Case";
  }

  public String getDefaultOneOfEntry() {
    return descriptor().getName().replace("_", "").toUpperCase() + "_NOT_SET";
  }

  public ImmutableList<OneOfEntry> getFields() {
    return descriptor()
        .getFields()
        .stream()
        .map(OneOfEntry::create)
        .collect(ImmutableList.toImmutableList());
  }

  public String getProtoFileComments() {
    return Descriptors.getProtoFileComments(descriptor());
  }
}
