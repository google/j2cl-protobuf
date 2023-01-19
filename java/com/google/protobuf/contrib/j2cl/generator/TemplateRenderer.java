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

import com.google.common.collect.ImmutableMap;
import com.google.protobuf.Descriptors.FileDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.VelocityRenderer;
import com.google.protobuf.contrib.j2cl.generator.J2CLProtobufCompiler.ProtoImplementation;
import java.io.IOException;
import java.io.UncheckedIOException;

/** Renders protos using veloctiy templates. */
// Class should be package protected, but this breaks velocity templating.
public class TemplateRenderer {

  private final FileDescriptor fileDescriptor;
  private final CodeWriter writer;
  private final String templateNameSuffix;
  private final VelocityRenderer velocityRenderer = new VelocityRenderer(getClass());

  public TemplateRenderer(
      CodeWriter writer, FileDescriptor fileDescriptor, ProtoImplementation implementation) {
    this.writer = writer;
    this.fileDescriptor = fileDescriptor;
    this.templateNameSuffix = implementation.getTemplateSuffix();
  }

  /** Generates a J2CL Java class from this generator's given protocol buffer FileDescriptor. */
  public void generateCode() throws IOException {
    TemplateFileDescriptor descriptor = TemplateFileDescriptor.create(fileDescriptor);
    renderFile(descriptor);

    if (descriptor.getMultipleFiles()) {
      descriptor.getMessages().forEach(this::renderMessage);
      descriptor.getEnums().forEach(this::renderEnum);
    }
  }

  private void renderMessage(TemplateMessageDescriptor descriptor) {
    ImmutableMap<String, Object> velocityContext =
        ImmutableMap.of(
            "templateNameSuffix", templateNameSuffix,
            "descriptor", descriptor);
    generate(velocityContext, "message", descriptor.getFileName());
  }

  private void renderEnum(TemplateEnumDescriptor descriptor) {
    ImmutableMap<String, Object> velocityContext = ImmutableMap.of("enumDescriptor", descriptor);
    generate(velocityContext, "enum", descriptor.getFileName());
  }

  private void renderFile(TemplateFileDescriptor descriptor) {
    ImmutableMap<String, Object> velocityContext =
        ImmutableMap.of(
            "templateNameSuffix", templateNameSuffix,
            "fileDescriptor", descriptor);
    generate(velocityContext, "file", descriptor.getFileName());
  }

  private void generate(
      ImmutableMap<String, ?> velocityContext, String templateName, String fileName) {
    String renderedTemplate;
    try {
      renderedTemplate =
          velocityRenderer.renderTemplate(
              String.format("%s%s.vm", templateName, templateNameSuffix), velocityContext);
    } catch (IOException ex) {
      throw new UncheckedIOException("Velocity failed to render template", ex);
    }

    writer.putNextEntry(fileName);
    writer.print(renderedTemplate);
    writer.closeEntry();
  }
}
