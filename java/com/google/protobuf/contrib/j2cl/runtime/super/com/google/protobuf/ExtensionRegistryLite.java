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
package com.google.protobuf;

/**
 * Emulated ExtensionRegistryLite that provides no implementation for J2CL.
 *
 * <p>ImmutableJS maintains its own extension registry that is populated on file load. This acts as
 * a generated registry that J2CL does not explicitly need to interact with. Therefore we can create
 * a stub generated registry to provide API compatability to callers while maintaining similar
 * runtime semantics.
 *
 * <p>The getEmptyRegistry() is not emulated as J2CL cannot force ImmutableJS to ignore its own
 * registry which in turn would provide misleading behavior.
 */
public class ExtensionRegistryLite {

  private static final ExtensionRegistryLite INSTANCE = new ExtensionRegistryLite();

  private ExtensionRegistryLite() {}

  public static ExtensionRegistryLite getGeneratedRegistry() {
    return INSTANCE;
  }
}
