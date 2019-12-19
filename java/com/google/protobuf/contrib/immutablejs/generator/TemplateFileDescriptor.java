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
import com.google.protobuf.Descriptors.FileDescriptor;
import java.util.List;

/** Represents a protobuf file descriptor. */
@AutoValue
public abstract class TemplateFileDescriptor {

  public static TemplateFileDescriptor create(FileDescriptor descriptor) {
    return new AutoValue_TemplateFileDescriptor(descriptor, TypeDescriptor.create(descriptor));
  }

  abstract FileDescriptor fileDescriptor();

  public abstract TypeDescriptor getType();

  public List<TemplateFieldDescriptor> getExtensions() {
    return fileDescriptor().getExtensions().stream()
        .map(f -> TemplateFieldDescriptor.create(getType(), f))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<ImportDescriptor> getImports() {
    return Descriptors.calculateImports(getExtensions().stream());
  }
}
