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

import static com.google.common.collect.ImmutableSet.toImmutableSet;
import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import com.google.protobuf.contrib.immutablejs.generator.Descriptors;
import com.google.protobuf.contrib.immutablejs.generator.ImportDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.TypeDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.TypeReferenceDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.VelocityUtil;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

final class RuntimeGenerator {
  private static final ImmutableSet<TypeDescriptor> primitiveDescriptors =
      ImmutableSet.of(
          TypeDescriptor.BOOLEAN,
          TypeDescriptor.STRING,
          TypeDescriptor.FLOAT,
          TypeDescriptor.INT,
          TypeDescriptor.LONG,
          TypeDescriptor.INT52_LONG,
          TypeDescriptor.BYTE_STRING);

  private final RuntimeGeneratorOptions options;
  private final VelocityEngine velocityEngine = VelocityUtil.createEngine();

  private RuntimeGenerator(RuntimeGeneratorOptions options) {
    this.options = options;
  }

  public void generate() throws IOException {
    ImmutableSet<TypeReferenceDescriptor> primitiveTypes =
        primitiveDescriptors.stream()
            .map(options.getRuntimeClass()::createTypeReferenceFor)
            .collect(toImmutableSet());
    ImmutableSet<TypeReferenceDescriptor> allDescriptors = primitiveTypes;
    ImmutableList<ImportDescriptor> imports =
        Descriptors.calculateImportsForTypes(allDescriptors.stream());
    VelocityContext velocityContext = new VelocityContext();
    velocityContext.put("primitiveTypes", primitiveTypes);
    velocityContext.put("imports", imports);

    try (BufferedWriter writer = Files.newBufferedWriter(Paths.get(options.getOutput()), UTF_8)) {
      renderTemplate(velocityContext, options.getRuntimeClass().getTemplate(), writer);
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

  public static void main(String[] args) throws Exception {
    RuntimeGeneratorOptions options = RuntimeGeneratorOptions.create(args);
    RuntimeGenerator generator = new RuntimeGenerator(options);
    generator.generate();
  }
}
