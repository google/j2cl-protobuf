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

import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.Descriptors.FileDescriptor;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

/** Renders protos using veloctiy templates. */
public class TemplateRenderer {

  private final FileDescriptor fileDescriptor;
  private final CodeWriter writer;

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
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("descriptor", messageDescriptor);
    mergeTemplate(velocityContext, "message.vm", messageDescriptor.getType().getModuleName());
  }

  private void renderFileTopLevel(FileDescriptor fileDescriptor) {
    TemplateFileDescriptor descriptor = TemplateFileDescriptor.create(fileDescriptor);
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("descriptor", descriptor);
    mergeTemplate(velocityContext, "file.vm", descriptor.getType().getModuleName() + ".proto");
  }

  private void generateEnum(EnumDescriptor enumDescriptor) {
    checkArgument(enumDescriptor.getContainingType() == null, "Should be top level enum");
    TemplateEnumDescriptor descriptor = TemplateEnumDescriptor.create(enumDescriptor);
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("enumDescriptor", descriptor);
    mergeTemplate(velocityContext, "enum.vm", descriptor.getType().getModuleName());
  }

  private void mergeTemplate(
      VelocityContext velocityContext, String templateName, String fileName) {
    VelocityEngine velocityEngine = VelocityUtil.createEngine();
    StringWriter outputBuffer = new StringWriter();
    if (!velocityEngine.mergeTemplate(
        TemplateRenderer.class.getPackage().getName().replace('.', '/')
            + "/templates/"
            + templateName,
        StandardCharsets.UTF_8.name(),
        velocityContext,
        outputBuffer)) {
      throw new RuntimeException("Velocity failed to render template");
    }

    writer.putNextEntry(fileName + ".js");
    writer.print(outputBuffer.toString());
    writer.closeEntry();
  }
}
