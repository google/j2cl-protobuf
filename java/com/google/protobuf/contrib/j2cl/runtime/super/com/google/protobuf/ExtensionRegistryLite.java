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
 * DO NOT USE, only here for migration purposes and will be deleted soon, see comment on build file.
 */
public class ExtensionRegistryLite {

  private static final ExtensionRegistryLite SINGLETON = new ExtensionRegistryLite();

  public static ExtensionRegistryLite newInstance() {
    return SINGLETON;
  }

  ExtensionRegistryLite() {}

  public static ExtensionRegistryLite getEmptyRegistry() {
    return SINGLETON;
  }

  public ExtensionRegistryLite getUnmodifiable() {
    return this;
  }

  public final void add(final ExtensionLite<?, ?> extension) {}
}
