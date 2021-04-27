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

import com.google.protobuf.Descriptors.FileDescriptor;
import com.google.protobuf.contrib.j2cl.generator.J2CLProtobufCompiler.ProtoImplementation;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

/** Renders protos using veloctiy templates. */
// Class should be package protected, but this breaks velocity templating.
public class TemplateRenderer {

  private final FileDescriptor fileDescriptor;
  private final CodeWriter writer;
  private final String templateNameSuffix;

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
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("templateNameSuffix", templateNameSuffix);
    velocityContext.put("descriptor", descriptor);
    generate(velocityContext, "message", descriptor.getFileName());
  }

  private void renderEnum(TemplateEnumDescriptor descriptor) {
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("enumDescriptor", descriptor);
    generate(velocityContext, "enum", descriptor.getFileName());
  }

  private void renderFile(TemplateFileDescriptor descriptor) {
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("templateNameSuffix", templateNameSuffix);
    velocityContext.put("fileDescriptor", descriptor);
    generate(velocityContext, "file", descriptor.getFileName());
  }

  private void generate(VelocityContext velocityContext, String templateName, String fileName) {
    VelocityEngine velocityEngine = VelocityUtil.createEngine();
    StringWriter outputBuffer = new StringWriter();

    String templatePath =
        TemplateRenderer.class.getPackage().getName().replace('.', '/')
            + "/templates/"
            + templateName
            + templateNameSuffix
            + ".vm";
    if (!velocityEngine.mergeTemplate(
        templatePath, StandardCharsets.UTF_8.name(), velocityContext, outputBuffer)) {
      throw new RuntimeException("Velocity failed to render template");
    }

    writer.putNextEntry(fileName);
    writer.print(outputBuffer.toString());
    writer.closeEntry();
  }
}
