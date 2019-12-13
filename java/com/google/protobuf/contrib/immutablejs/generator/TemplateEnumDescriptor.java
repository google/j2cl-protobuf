package com.google.protobuf.contrib.immutablejs.generator;

import com.google.auto.value.AutoValue;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.EnumValueDescriptor;
import java.util.List;

/** Represents a proto buffer enum */
@AutoValue
public abstract class TemplateEnumDescriptor {

  public static TemplateEnumDescriptor create(EnumDescriptor descriptor) {
    return new AutoValue_TemplateEnumDescriptor(descriptor, TypeDescriptor.create(descriptor));
  }

  abstract EnumDescriptor descriptor();

  public abstract TypeDescriptor getType();

  public List<EnumValueDescriptor> getEnumValues() {
    return descriptor().getValues();
  }

  public String getProtoFileComments() {
    return Descriptors.getProtoFileComments(descriptor());
  }
}
