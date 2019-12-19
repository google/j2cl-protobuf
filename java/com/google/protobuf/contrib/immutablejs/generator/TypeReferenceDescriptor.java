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

/** Holds a reference from a type (context) to another type (target). */
@AutoValue
public abstract class TypeReferenceDescriptor {

  abstract TypeDescriptor context();

  abstract TypeDescriptor target();

  public boolean needsImport() {
    return !target().getModuleName().isEmpty() && !target().hasSameParent(context());
  }

  public String getExpression() {
    return needsImport() ? target().getImportName() : target().getLocalName();
  }

  public String getCycleSafeExpression() {
    return needsImport() ? target().getModuleGetName() : target().getLocalName();
  }
}
