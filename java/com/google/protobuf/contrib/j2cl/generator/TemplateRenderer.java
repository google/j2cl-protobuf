package com.google.protobuf.contrib.j2cl.generator;

import com.google.protobuf.Descriptors.FileDescriptor;
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

  public TemplateRenderer(CodeWriter writer, FileDescriptor fileDescriptor) {
    this.writer = writer;
    this.fileDescriptor = fileDescriptor;
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
    velocityContext.put("descriptor", descriptor);
    generate(velocityContext, "message.vm", descriptor.getFileName());
  }

  private void renderEnum(TemplateEnumDescriptor descriptor) {
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("enumDescriptor", descriptor);
    generate(velocityContext, "enum.vm", descriptor.getFileName());
  }

  private void renderFile(TemplateFileDescriptor descriptor) {
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("fileDescriptor", descriptor);
    generate(velocityContext, "file.vm", descriptor.getFileName());
  }

  private void generate(VelocityContext velocityContext, String templateName, String fileName) {
    VelocityEngine velocityEngine = VelocityUtil.createEngine();
    StringWriter outputBuffer = new StringWriter();
    String templatePath =
        TemplateRenderer.class.getPackage().getName().replace('.', '/')
            + "/templates/"
            + templateName;
    if (!velocityEngine.mergeTemplate(
        templatePath, StandardCharsets.UTF_8.name(), velocityContext, outputBuffer)) {
      throw new RuntimeException("Velocity failed to render template");
    }

    writer.putNextEntry(fileName);
    writer.print(outputBuffer.toString());
    writer.closeEntry();
  }
}
