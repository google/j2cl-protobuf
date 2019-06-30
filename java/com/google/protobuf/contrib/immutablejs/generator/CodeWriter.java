package com.google.protobuf.contrib.immutablejs.generator;

import com.google.protos.proto2.compiler.Plugin.CodeGeneratorResponse;

/** Writer that is able to handle multiple file in a common base directory or zip file. */
final class CodeWriter {

  private final CodeGeneratorResponse.Builder response;

  private StringBuilder writer;
  private String currentFileName;

  public CodeWriter(CodeGeneratorResponse.Builder response) {
    this.response = response;
  }

  /**
   * Start a new entry (file).
   *
   * @param name file name
   */
  public void putNextEntry(String name) {
    currentFileName = name;
    writer = new StringBuilder();
  }

  public void closeEntry() {
    response.addFileBuilder().setName(currentFileName).setContent(writer.toString());
  }

  public void print(String s) {
    writer.append(s);
  }
}
