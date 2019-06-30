package com.google.protobuf.contrib.j2cl.generator;

import com.google.auto.value.AutoValue;
import com.google.protobuf.Descriptors.EnumValueDescriptor;

/** Represents a value of a protocol buffer enum. */
@AutoValue
public abstract class TemplateEnumValueDescriptor {

  public static TemplateEnumValueDescriptor create(
      EnumValueDescriptor enumValueDescriptor, boolean isAlias) {
    return new AutoValue_TemplateEnumValueDescriptor(enumValueDescriptor, isAlias);
  }

  protected abstract EnumValueDescriptor enumValueDescriptor();

  public abstract boolean isAlias();

  public String getName() {
    return enumValueDescriptor().getName();
  }

  public int getNumber() {
    return enumValueDescriptor().getNumber();
  }
}
