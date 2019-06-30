package com.google.protobuf;

/**
 * DO NOT USE, only here for migration purposes and will be deleted soon, see comment on build file.
 */
public class ExtensionRegistry extends ExtensionRegistryLite {

  private static final ExtensionRegistry SINGLETON = new ExtensionRegistry();

  public static ExtensionRegistry newInstance() {
    return SINGLETON;
  }

  private ExtensionRegistry() {}

  @Override
  public ExtensionRegistry getUnmodifiable() {
    return this;
  }
}
