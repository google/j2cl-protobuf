package com.google.protobuf.contrib.j2cl.generator;

import com.google.auto.value.AutoValue;

/** Represents a value of a protocol buffer enum. */
@AutoValue
public abstract class TemplateEnumValueDescriptor {

  public static TemplateEnumValueDescriptor create(String name, int number) {
    return create(name, number, false);
  }

  public static TemplateEnumValueDescriptor create(String name, int number, boolean isAlias) {
    return new AutoValue_TemplateEnumValueDescriptor(name, number, isAlias);
  }

  public abstract String getName();

  public abstract int getNumber();

  public abstract boolean isAlias();
}
