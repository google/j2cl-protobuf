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

import com.google.protobuf.contrib.immutablejs.testing.GoldenFilesBaseTest;
import com.google.testing.testsize.MediumTest;
import com.google.testing.testsize.MediumTestAttribute;

/**
 * Run tests that compares the generated files against golden files. Please keep in mind that the
 * class hierarchies and naming must exactly match that of the original protobuf Java compiler!
 */
@MediumTest(MediumTestAttribute.FILE)
public class GoldenFileTest extends GoldenFilesBaseTest {

  @Override
  protected String getProtoOutputDir(String protoName) {
    return "../protos/" + protoName + "_j2cl_proto_for_testing_do_not_use";
  }

  public void testAccessors() throws Exception {
    doGoldenTest("accessor");
  }

  public void testAccessorsMultipleFiles() throws Exception {
    doGoldenTest("accessor-multiple-files");
  }

  public void testAmbiguousFields() throws Exception {
    doGoldenTest("ambiguous_fields");
  }

  public void testEmptyPackage() throws Exception {
    doGoldenTest("empty_package");
  }

  public void testEnums() throws Exception {
    doGoldenTest("enums");
  }

  public void testEnumsMultipleFiles() throws Exception {
    doGoldenTest("enums-multiple-files");
  }

  public void testExtensions() throws Exception {
    doGoldenTest("extensions");
  }

  public void testExtensionsMultipleFiles() throws Exception {
    doGoldenTest("extensions-multiple-files");
  }

  public void testFieldNames() throws Exception {
    doGoldenTest("field_names");
  }

  public void testMaps() throws Exception {
    doGoldenTest("maps");
  }

  public void testOneOfs() throws Exception {
    doGoldenTest("oneofs");
  }

  public void testOneOfsMultipleFiles() throws Exception {
    doGoldenTest("oneofs-multiple-files");
  }

  public void testProto3Enums() throws Exception {
    doGoldenTest("proto3_enums");
  }

  public void testProto3EnumsMultipleFiles() throws Exception {
    doGoldenTest("proto3_enums-multiple-files");
  }

  public void testProto3Oneofs() throws Exception {
    doGoldenTest("proto3_oneofs");
  }

  public void testProto3OneofsMultipleFiles() throws Exception {
    doGoldenTest("proto3_oneofs-multiple-files");
  }

  public void testProto3Optional() throws Exception {
    doGoldenTest("proto3_optional");
  }

  public void testProto3OptionalMultipleFiles() throws Exception {
    doGoldenTest("proto3_optional-multiple-files");
  }
}
