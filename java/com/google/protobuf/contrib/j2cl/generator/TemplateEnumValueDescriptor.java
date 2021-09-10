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

/** Represents a value of a protocol buffer enum. */
@AutoValue
public abstract class TemplateEnumValueDescriptor {

  public static TemplateEnumValueDescriptor create(String name, int number) {
    return create(name, number, name);
  }

  public static TemplateEnumValueDescriptor create(String name, int number, String originalName) {
    return new AutoValue_TemplateEnumValueDescriptor(name, number, originalName);
  }

  public abstract String getName();

  public abstract int getNumber();

  public abstract String getOriginalName();

  public boolean isAlias() {
    return !getName().equals(getOriginalName());
  }
}
