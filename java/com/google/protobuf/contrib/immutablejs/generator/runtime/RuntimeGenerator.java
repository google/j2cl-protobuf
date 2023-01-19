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
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.protobuf.contrib.immutablejs.generator.Descriptors;
import com.google.protobuf.contrib.immutablejs.generator.ImportDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.TypeDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.TypeReferenceDescriptor;
import com.google.protobuf.contrib.immutablejs.generator.VelocityRenderer;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

final class RuntimeGenerator {
  private static final ImmutableSet<TypeDescriptor> primitiveDescriptors =
      ImmutableSet.of(
          TypeDescriptor.BOOLEAN,
          TypeDescriptor.STRING,
          TypeDescriptor.FLOAT,
          TypeDescriptor.INT,
          TypeDescriptor.UINT,
          TypeDescriptor.LONG,
          TypeDescriptor.UNSIGNED_LONG,
          TypeDescriptor.INT52_LONG,
          TypeDescriptor.BYTE_STRING);

  private static final ImmutableSet<TypeDescriptor> mapKeyDescriptors =
      ImmutableSet.of(
          TypeDescriptor.BOOLEAN,
          TypeDescriptor.STRING,
          TypeDescriptor.UINT,
          TypeDescriptor.INT,
          TypeDescriptor.LONG,
          TypeDescriptor.UNSIGNED_LONG,
          TypeDescriptor.INT52_LONG);

  private static final ImmutableSet<TypeDescriptor> mapValueDescriptors =
      ImmutableSet.of(
          TypeDescriptor.BOOLEAN,
          TypeDescriptor.STRING,
          TypeDescriptor.FLOAT,
          TypeDescriptor.UINT,
          TypeDescriptor.INT,
          TypeDescriptor.LONG,
          TypeDescriptor.UNSIGNED_LONG,
          TypeDescriptor.INT52_LONG,
          TypeDescriptor.BYTE_STRING);

  private final RuntimeGeneratorOptions options;
  private final VelocityRenderer velocityRenderer = new VelocityRenderer(getClass());

  private RuntimeGenerator(RuntimeGeneratorOptions options) {
    this.options = options;
  }

  public void generate() throws IOException {
    ImmutableSet<TypeReferenceDescriptor> primitiveTypes =
        primitiveDescriptors.stream()
            .map(options.getRuntimeClass()::createTypeReferenceFor)
            .collect(toImmutableSet());
    ImmutableSet<TypeReferenceDescriptor> mapKeyTypes =
        mapKeyDescriptors.stream()
            .map(options.getRuntimeClass()::createTypeReferenceFor)
            .collect(toImmutableSet());
    ImmutableSet<TypeReferenceDescriptor> mapValueTypes =
        mapValueDescriptors.stream()
            .map(options.getRuntimeClass()::createTypeReferenceFor)
            .collect(toImmutableSet());
    ImmutableSet<TypeReferenceDescriptor> allDescriptors =
        ImmutableSet.<TypeReferenceDescriptor>builder()
            .addAll(primitiveTypes)
            .addAll(mapKeyTypes)
            .addAll(mapValueTypes)
            .build();
    ImmutableList<ImportDescriptor> imports =
        Descriptors.calculateImportsForTypes(allDescriptors.stream());
    ImmutableMap<String, Object> velocityContext =
        ImmutableMap.of(
            "primitiveTypes", primitiveTypes,
            "mapKeyTypes", mapKeyTypes,
            "mapValueTypes", mapValueTypes,
            "imports", imports);

    try (BufferedWriter writer = Files.newBufferedWriter(Paths.get(options.getOutput()), UTF_8)) {
      writer.write(
          velocityRenderer.renderTemplate(
              options.getRuntimeClass().getTemplate(), velocityContext));
    }
  }

  public static void main(String[] args) throws Exception {
    RuntimeGeneratorOptions options = RuntimeGeneratorOptions.create(args);
    RuntimeGenerator generator = new RuntimeGenerator(options);
    generator.generate();
  }
}
