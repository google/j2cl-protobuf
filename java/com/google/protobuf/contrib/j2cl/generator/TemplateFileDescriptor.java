/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.protobuf.contrib.j2cl.generator;

import static com.google.common.base.Predicates.not;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.common.io.Files;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Descriptors.FileDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.JavaQualifiedNames;
import com.google.protobuf.contrib.immutablejs.generator.NameResolver;
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
    return fileDescriptor().getMessageTypes().stream()
        .map(TemplateMessageDescriptor::create)
        .filter(not(TemplateMessageDescriptor::isMapEntry))
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
    List<FieldDescriptor> extensions = fileDescriptor().getExtensions();
    NameResolver nameResolver = NameResolver.of(extensions);
    return extensions.stream()
        .map(f -> TemplateFieldDescriptor.create(f, nameResolver))
        .collect(ImmutableList.toImmutableList());
  }

  public boolean hasExtensions() {
    List<FieldDescriptor> extensions = fileDescriptor().getExtensions();
    return extensions != null && !extensions.isEmpty();
  }

  public String getFileName() {
    return Descriptors.calculateFileName(getPackage(), getClassName());
  }
}
