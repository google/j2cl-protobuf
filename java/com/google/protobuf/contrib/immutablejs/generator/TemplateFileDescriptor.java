package com.google.protobuf.contrib.immutablejs.generator;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.FileDescriptor;
import java.util.List;

/** Represents a protobuf file descriptor. */
@AutoValue
public abstract class TemplateFileDescriptor {

  public static TemplateFileDescriptor create(FileDescriptor descriptor) {
    return new AutoValue_TemplateFileDescriptor(descriptor, TypeDescriptor.create(descriptor));
  }

  abstract FileDescriptor fileDescriptor();

  public abstract TypeDescriptor getType();

  public List<TemplateFieldDescriptor> getExtensions() {
    return fileDescriptor().getExtensions().stream()
        .map(f -> TemplateFieldDescriptor.create(getType(), f))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<ImportDescriptor> getImports() {
    return Descriptors.calculateImports(getExtensions().stream());
  }
}
