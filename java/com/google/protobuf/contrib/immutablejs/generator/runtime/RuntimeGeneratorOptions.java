/*
 * Copyright 2020 Google LLC
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
package com.google.protobuf.contrib.immutablejs.generator.runtime;

import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;

final class RuntimeGeneratorOptions {
  @Option(
      name = "-output",
      required = true,
      metaVar = "<output>",
      usage = "Specifies the file to write the generated output to.")
  String output;

  @Option(
      name = "-runtimeClass",
      required = true,
      metaVar = "<runtimeClass>",
      usage = "The runtime class to generate.")
  RuntimeClass runtimeClass;

  private RuntimeGeneratorOptions() {}

  public String getOutput() {
    return output;
  }

  public RuntimeClass getRuntimeClass() {
    return runtimeClass;
  }

  static RuntimeGeneratorOptions create(String[] args) {
    RuntimeGeneratorOptions options = new RuntimeGeneratorOptions();
    try {
      CmdLineParser parser = new CmdLineParser(options);
      parser.parseArgument(args);
    } catch (CmdLineException ex) {
      throw new IllegalStateException("Failed to parse arguments", ex);
    }
    return options;
  }
}
