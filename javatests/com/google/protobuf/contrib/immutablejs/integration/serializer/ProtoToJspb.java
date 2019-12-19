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
package com.google.protobuf.contrib.immutablejs.integration.serializer;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.apps.jspb.Serializer;
import com.google.protobuf.ExtensionRegistry;
import com.google.protobuf.Message;
import com.google.protobuf.TextFormat;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import org.kohsuke.args4j.Argument;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;

/** Converts a binary proto into a JSPB proto. */
public class ProtoToJspb {

  @Argument(metaVar = "<data_file>", required = true)
  protected String file;

  @Option(name = "--proto", usage = "Name of the top level proto.", required = true)
  protected String protoName;

  public static void main(String[] args) {
    ProtoToJspb protoToJspb = ProtoToJspb.parse(args);
    try {
      String jspb = protoToJspb.generateJspb();
      System.out.println(jspb);
    } catch (Exception e) {
      e.printStackTrace();
      System.exit(-2);
    }
  }

  /** Parses the given args list and updates values. */
  private static ProtoToJspb parse(String[] args) {
    ProtoToJspb protoToJspb = new ProtoToJspb();
    CmdLineParser parser = new CmdLineParser(protoToJspb);

    final String usage = "Usage: ProtoToJspb --proto <proto_name> <data_file>";

    try {
      parser.parseArgument(args);
    } catch (CmdLineException e) {
      e.printStackTrace();
      System.err.println(usage);
      System.exit(-1);
      return null;
    }

    return protoToJspb;
  }

  private String generateJspb() throws Exception {
    TextFormat.Parser parser = TextFormat.getParser();

    try (FileInputStream f = new FileInputStream(new File(file))) {
      InputStreamReader reader = new InputStreamReader(f, UTF_8);
      Message.Builder builder = getBuilder();
      parser.merge(reader, ExtensionRegistry.getGeneratedRegistry(), builder);
      Message m = builder.build();

      return new Serializer().serializeMessage(m).toString();
    }
  }

  private Message.Builder getBuilder() throws Exception {
    Class<?> aClass = Class.forName(protoName);
    return (Message.Builder) aClass.getMethod("newBuilder").invoke(null);
  }
}
