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
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.EnumValueDescriptor;
import java.util.List;

/** Represents a proto buffer enum */
@AutoValue
public abstract class TemplateEnumDescriptor {

  public static TemplateEnumDescriptor create(EnumDescriptor descriptor) {
    return new AutoValue_TemplateEnumDescriptor(descriptor, TypeDescriptor.create(descriptor));
  }

  abstract EnumDescriptor descriptor();

  public abstract TypeDescriptor getType();

  public List<EnumValueDescriptor> getEnumValues() {
    return descriptor().getValues();
  }

  public String getProtoFileComments() {
    return Descriptors.getProtoFileComments(descriptor());
  }
}
