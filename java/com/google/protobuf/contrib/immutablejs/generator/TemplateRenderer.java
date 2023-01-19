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
package com.google.protobuf.contrib.immutablejs.generator;

import static com.google.common.base.Preconditions.checkArgument;

import com.google.common.collect.ImmutableMap;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.FileDescriptor;
import java.io.IOException;
import java.io.UncheckedIOException;

/** Renders protos using velocity templates. */
public class TemplateRenderer {

  private final FileDescriptor fileDescriptor;
  private final CodeWriter writer;
  private final VelocityRenderer velocityRenderer = new VelocityRenderer(getClass());

  public TemplateRenderer(CodeWriter writer, FileDescriptor fileDescriptor) {
    this.writer = writer;
    this.fileDescriptor = fileDescriptor;
  }

  /** Generates JavaScript classes from this generator's given protocol buffer FileDescriptor. */
  public void generateCode() {
    fileDescriptor.getMessageTypes().forEach(this::generateType);
    fileDescriptor.getEnumTypes().forEach(this::generateEnum);
    renderFileTopLevel(fileDescriptor);
  }

  private void generateType(Descriptor descriptor) {
    checkArgument(descriptor.getContainingType() == null, "Should be top level descriptor");
    TemplateMessageDescriptor messageDescriptor = TemplateMessageDescriptor.create(descriptor);
    generate(
        ImmutableMap.of("descriptor", messageDescriptor),
        "message.vm",
        messageDescriptor.getType().getModuleName());
  }

  private void renderFileTopLevel(FileDescriptor fileDescriptor) {
    TemplateFileDescriptor descriptor = TemplateFileDescriptor.create(fileDescriptor);
    generate(
        ImmutableMap.of("descriptor", descriptor),
        "file.vm",
        descriptor.getType().getModuleName() + ".proto");
  }

  private void generateEnum(EnumDescriptor enumDescriptor) {
    checkArgument(enumDescriptor.getContainingType() == null, "Should be top level enum");
    TemplateEnumDescriptor descriptor = TemplateEnumDescriptor.create(enumDescriptor);
    generate(
        ImmutableMap.of("enumDescriptor", descriptor),
        "enum.vm",
        descriptor.getType().getModuleName());
  }

  private void generate(
      ImmutableMap<String, ?> velocityContext, String templateName, String fileName) {
    String renderedTemplate;
    try {
      renderedTemplate = velocityRenderer.renderTemplate(templateName, velocityContext);
    } catch (IOException ex) {
      throw new UncheckedIOException("Velocity failed to render template", ex);
    }

    writer.putNextEntry(fileName + ".js");
    writer.print(renderedTemplate);
    writer.closeEntry();
  }
}
