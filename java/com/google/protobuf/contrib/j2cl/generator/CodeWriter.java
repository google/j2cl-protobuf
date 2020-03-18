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

import com.google.protobuf.compiler.PluginProtos.CodeGeneratorResponse;

/**
 * Writer that is able to handle multiple file in a common base directory or zip file and provides
 * support for indenting lines.
 */
class CodeWriter {

  private final CodeGeneratorResponse.Builder response;

  private StringBuilder writer;
  private String currentFileName;

  /** Write generated files to the given base directory */
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
