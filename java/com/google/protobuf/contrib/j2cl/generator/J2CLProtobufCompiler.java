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

import static com.google.common.base.Preconditions.checkNotNull;

import com.google.common.base.Ascii;
import com.google.common.collect.Maps;
import com.google.protobuf.DescriptorProtos.FileDescriptorProto;
import com.google.protobuf.Descriptors.DescriptorValidationException;
import com.google.protobuf.Descriptors.FileDescriptor;
import com.google.protobuf.ExtensionRegistry;
import com.google.protobuf.compiler.PluginProtos.CodeGeneratorRequest;
import com.google.protobuf.compiler.PluginProtos.CodeGeneratorResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Protobuf compiler plugin that generates J2CL protobuf emulations. It reads a {@link
 * CodeGeneratorRequest} from stdin and writes a {@link CodeGeneratorResponse} to stdout.
 */
public class J2CLProtobufCompiler {

  public static void main(String[] args) throws IOException, DescriptorValidationException {
    CodeGeneratorRequest request =
        CodeGeneratorRequest.parseFrom(System.in);

    Map<String, FileDescriptor> fileDescriptors = Maps.newHashMap();
    CodeGeneratorResponse.Builder response = CodeGeneratorResponse.newBuilder();
    response.setSupportedFeatures(CodeGeneratorResponse.Feature.FEATURE_PROTO3_OPTIONAL_VALUE);
    CodeWriter codeWriter = new CodeWriter(response);

    List<String> fileToGenerateList = request.getFileToGenerateList();
    ProtoImplementation implementation =
        ProtoImplementation.fromRequestParameter(request.getParameter());

    for (FileDescriptorProto fileDescriptorProto : request.getProtoFileList()) {
      // Look up the imported files from previous file descriptors.  It is sufficient to look at
      // only previous file descriptors because CodeGeneratorRequest guarantees that the files
      // are sorted in topological order.
      FileDescriptor[] deps = new FileDescriptor[fileDescriptorProto.getDependencyCount()];
      for (int i = 0; i < fileDescriptorProto.getDependencyCount(); i++) {
        String name = fileDescriptorProto.getDependency(i);
        FileDescriptor dependee = checkNotNull(fileDescriptors.get(name),
            "Missing file descriptor for [%s]", name);
        deps[i] = dependee;
      }

      // Build and cache the current file descriptor.
      FileDescriptor fileDescriptor = FileDescriptor.buildFrom(fileDescriptorProto, deps);
      fileDescriptors.put(fileDescriptor.getName(), fileDescriptor);

      // In J2cl we only generate output for protos that we see on the command line not their
      // dependencies. This is necessary to make strict deps work.
      if (!fileToGenerateList.contains(fileDescriptorProto.getName())) {
        continue;
      }

      // Generate code based on the current file descriptor.
      new TemplateRenderer(codeWriter, fileDescriptor, implementation).generateCode();
    }
    response.build().writeTo(System.out);
  }

  /** Proto implementation options. */
  public enum ProtoImplementation {
    JSINTEROP(""),
    JAVA("_java");

    private final String templateSuffix;

    ProtoImplementation(String templateSuffix) {
      this.templateSuffix = templateSuffix;
    }

    public String getTemplateSuffix() {
      return templateSuffix;
    }

    private static ProtoImplementation fromRequestParameter(String parameter) {
      if (parameter == null) {
        return JSINTEROP;
      }

      return ProtoImplementation.valueOf(Ascii.toUpperCase(parameter));
    }
  }
}
