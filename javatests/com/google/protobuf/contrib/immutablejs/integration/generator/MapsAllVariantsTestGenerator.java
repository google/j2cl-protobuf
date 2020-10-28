/*
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.protobuf.contrib.immutablejs.integration.generator;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.FieldDescriptor.Type;
import com.google.protobuf.contrib.immutablejs.generator.VelocityUtil;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;

/**
 * Generates test cases for all possible map key/value combinations.
 *
 * <p>There are currently 66 possible combinations per test case so codegen is used to make
 * maintaining all the possible cases easier. This also makes debugging the test easier as all the
 * data is clearly presented in the generated test cases, avoiding complex runtime reflection-like
 * behavior.
 */
final class MapsAllVariantsTestGenerator {
  private static final ImmutableList<Type> keyTypes =
      ImmutableList.of(Type.INT32, Type.UINT32, Type.INT64, Type.UINT64, Type.STRING, Type.BOOL);
  private static final ImmutableList<Type> valueTypes =
      ImmutableList.of(
          Type.INT32,
          Type.UINT32,
          Type.INT64,
          Type.UINT64,
          Type.STRING,
          Type.BOOL,
          Type.BYTES,
          Type.ENUM,
          Type.MESSAGE,
          Type.DOUBLE,
          Type.FLOAT);

  private final Options options;
  private final VelocityEngine velocityEngine = VelocityUtil.createEngine();

  private MapsAllVariantsTestGenerator(Options options) {
    this.options = options;
  }

  void generate() throws IOException {
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put(
        "keyTypes",
        keyTypes.stream().map(ProtobufTestValueProvider::forType).collect(toImmutableList()));
    velocityContext.put(
        "valueTypes",
        valueTypes.stream().map(ProtobufTestValueProvider::forType).collect(toImmutableList()));

    try (BufferedWriter writer = Files.newBufferedWriter(Paths.get(options.output), UTF_8)) {
      renderTemplate(velocityContext, "maps_all_variants_test.vm", writer);
    }
  }

  private final void renderTemplate(
      VelocityContext velocityContext, String templateName, Writer writer) {
    if (!velocityEngine.mergeTemplate(
        this.getClass().getPackage().getName().replace('.', '/') + "/templates/" + templateName,
        UTF_8.name(),
        velocityContext,
        writer)) {
      throw new IllegalStateException("Velocity failed to render template");
    }
  }

  private static final class Options {
    @Option(
        name = "-output",
        required = true,
        metaVar = "<output>",
        usage = "Specifies the file to write the generated output to.")
    String output;

    static Options create(String[] args) {
      Options options = new Options();
      try {
        CmdLineParser parser = new CmdLineParser(options);
        parser.parseArgument(args);
      } catch (CmdLineException ex) {
        throw new IllegalStateException("Failed to parse arguments", ex);
      }
      return options;
    }
  }

  public static void main(String[] args) throws IOException {
    new MapsAllVariantsTestGenerator(Options.create(args)).generate();
  }
}
