package com.google.protobuf.contrib.j2cl.generator;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.common.io.Files;
import com.google.protobuf.Descriptors.FileDescriptor;
import com.google.protobuf.contrib.JavaQualifiedNames;
import java.util.List;

/** Represents a protobuf file descriptor. */
@AutoValue
public abstract class TemplateFileDescriptor {
  public static TemplateFileDescriptor create(FileDescriptor fileDescriptor) {
    return new AutoValue_TemplateFileDescriptor(fileDescriptor);
  }

  abstract FileDescriptor fileDescriptor();

  public String getPackage() {
    return JavaQualifiedNames.getPackage(fileDescriptor());
  }

  public String getClassName() {
    return JavaQualifiedNames.getOuterClassname(fileDescriptor());
  }

  public boolean getMultipleFiles() {
    return fileDescriptor().getOptions().getJavaMultipleFiles();
  }

  public String getJsNameSpace() {
    String pkg = fileDescriptor().getPackage();
    return pkg.isEmpty() ? "improto" : "improto." + pkg;
  }

  public String getJsName() {
    return Files.getNameWithoutExtension(fileDescriptor().getName()).replace('-', '_');
  }

  public List<TemplateMessageDescriptor> getMessages() {
    return fileDescriptor()
        .getMessageTypes()
        .stream()
        .map(TemplateMessageDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public List<TemplateEnumDescriptor> getEnums() {
    return fileDescriptor()
        .getEnumTypes()
        .stream()
        .map(TemplateEnumDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getExtensions() {
    return fileDescriptor().getExtensions().stream()
        .map(TemplateFieldDescriptor::create)
        .collect(ImmutableList.toImmutableList());
  }

  public String getFileName() {
    return Descriptors.calculateFileName(getPackage(), getClassName());
  }
}
