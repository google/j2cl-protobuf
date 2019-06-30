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
