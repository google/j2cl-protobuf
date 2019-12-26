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

import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.GenericDescriptor;
import com.google.protobuf.contrib.JavaQualifiedNames;

/** A base class for proto template type descriptors. */
abstract class AbstractTemplateTypeDescriptor {

  abstract GenericDescriptor descriptor();

  abstract Descriptor getContainingType();

  public String getName() {
    return descriptor().getName();
  }

  public String getPackage() {
    checkState(isTopLevelClass());
    return JavaQualifiedNames.getPackage(descriptor().getFile());
  }

  public String getFileName() {
    checkState(isTopLevelClass());
    return Descriptors.calculateFileName(getPackage(), getName());
  }

  public boolean isTopLevelClass() {
    return TemplateFileDescriptor.create(descriptor().getFile()).getMultipleFiles()
        && getContainingType() == null;
  }

  public String getJsName() {
    return getContainingType() == null
        ? getName()
        : TemplateMessageDescriptor.create(getContainingType()).getJsName() + "." + getName();
  }

  public String getJsNameSpace() {
    return TemplateFileDescriptor.create(descriptor().getFile()).getJsNameSpace();
  }
}
