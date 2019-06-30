package com.google.protobuf.contrib.immutablejs.generator;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.OneofDescriptor;
import com.google.protobuf.contrib.JavaQualifiedNames;

/** Represents a protocol buffer union. */
@AutoValue
public abstract class TemplateOneOfDescriptor {

  /** Represents an entry in a protocol buffer union. */
  @AutoValue
  public abstract static class OneOfEntry {
    public static OneOfEntry create(FieldDescriptor fieldDescriptor) {
      return new AutoValue_TemplateOneOfDescriptor_OneOfEntry(fieldDescriptor);
    }

    abstract FieldDescriptor fieldDescriptor();

    public String getName() {
      return fieldDescriptor().getName().toUpperCase();
    }

    public int getNumber() {
      return fieldDescriptor().getNumber();
    }
  }

  public static TemplateOneOfDescriptor create(
      TypeDescriptor enclosingType, OneofDescriptor oneofDescriptor) {
    return new AutoValue_TemplateOneOfDescriptor(enclosingType, oneofDescriptor);
  }

  abstract TypeDescriptor enclosingType();

  abstract OneofDescriptor descriptor();

  public String getLocalTypeName() {
    return enclosingType().getLocalName() + "." + getSimpleName();
  }

  public String getSimpleName() {
    return JavaQualifiedNames.underscoresToCamelCase(descriptor().getName(), true) + "Case";
  }

  public String getDefaultOneOfEntry() {
    return descriptor().getName().replace("_", "").toUpperCase() + "_NOT_SET";
  }

  public ImmutableList<OneOfEntry> getFields() {
    return descriptor()
        .getFields()
        .stream()
        .map(OneOfEntry::create)
        .collect(ImmutableList.toImmutableList());
  }

  public String getProtoFileComments() {
    return Descriptors.getProtoFileComments(descriptor());
  }
}
