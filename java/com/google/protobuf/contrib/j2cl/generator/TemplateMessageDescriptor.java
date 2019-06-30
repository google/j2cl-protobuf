package com.google.protobuf.contrib.j2cl.generator;

import static com.google.common.base.Preconditions.checkState;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.contrib.JavaQualifiedNames;
import java.util.List;

/** Represents a protocol message */
@AutoValue
public abstract class TemplateMessageDescriptor {
  public static TemplateMessageDescriptor create(Descriptor descriptor) {
    return new AutoValue_TemplateMessageDescriptor(descriptor);
  }

  abstract Descriptor descriptor();

  public String getName() {
    return descriptor().getName();
  }

  public String getPackage() {
    checkState(isTopLevelClass());
    return JavaQualifiedNames.getPackage(descriptor().getFile());
  }

  public boolean isTopLevelClass() {
    return descriptor().getFile().getOptions().getJavaMultipleFiles()
        && descriptor().getContainingType() == null;
  }

  public String getJsName() {
    checkState(isTopLevelMessage());
    return getName();
  }

  public boolean isTopLevelMessage() {
    return descriptor().getContainingType() == null;
  }

  public String getJsNameSpace() {
    checkState(isTopLevelMessage());
    return TemplateFileDescriptor.create(descriptor().getFile()).getJsNameSpace();
  }

  public List<TemplateFieldDescriptor> getFields() {
    return descriptor()
        .getFields()
        .stream()
        .map(TemplateFieldDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getExtensions() {
    return descriptor().getExtensions().stream()
        .map(TemplateFieldDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public List<TemplateEnumDescriptor> getEnums() {
    return descriptor()
        .getEnumTypes()
        .stream()
        .map(TemplateEnumDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public List<TemplateMessageDescriptor> getMessages() {
    return descriptor()
        .getNestedTypes()
        .stream()
        .map(TemplateMessageDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateOneOfDescriptor> getOneOfs() {
    return descriptor()
        .getOneofs()
        .stream()
        .map(o -> TemplateOneOfDescriptor.create(this, o))
        .collect(ImmutableList.toImmutableList());
  }

  public String getFileName() {
    return Descriptors.calculateFileName(getPackage(), getName());
  }
}
