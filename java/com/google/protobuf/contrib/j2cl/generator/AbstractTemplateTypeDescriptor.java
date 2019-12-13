package com.google.protobuf.contrib.j2cl.generator;

import static com.google.common.base.Preconditions.checkState;

import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.GenericDescriptor;
import com.google.protobuf.contrib.JavaQualifiedNames;

/** A base class for proto template type descriptors. */
abstract class AbstractTemplateTypeDescriptor {

  abstract GenericDescriptor descriptor();

  abstract Descriptor getContainingType();

  public String getName() {
    return descriptor().getName();
  }

  public String getPackage() {
    checkState(isTopLevelClass());
    return JavaQualifiedNames.getPackage(descriptor().getFile());
  }

  public String getFileName() {
    checkState(isTopLevelClass());
    return Descriptors.calculateFileName(getPackage(), getName());
  }

  public boolean isTopLevelClass() {
    return TemplateFileDescriptor.create(descriptor().getFile()).getMultipleFiles()
        && getContainingType() == null;
  }

  public String getJsName() {
    return getContainingType() == null
        ? getName()
        : TemplateMessageDescriptor.create(getContainingType()).getJsName() + "." + getName();
  }

  public String getJsNameSpace() {
    return TemplateFileDescriptor.create(descriptor().getFile()).getJsNameSpace();
  }
}
