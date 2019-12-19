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
package com.google.protobuf.contrib.immutablejs.generator;

import com.google.common.collect.ImmutableSet;
import com.google.protobuf.contrib.immutablejs.testing.GoldenFilesBaseTest;
import com.google.testing.testsize.MediumTest;
import com.google.testing.testsize.MediumTestAttribute;

/** Run tests that compares the generated files against golden files. */
@MediumTest(MediumTestAttribute.FILE)
public class GoldenFileTest extends GoldenFilesBaseTest {

  @Override
  protected ImmutableSet<GeneratedFile> loadGoldenFiles(String protoName) throws Exception {
    return loadFilesFromDir("../protos/" + protoName + "-improto");
  }

  public void testAccessors() throws Exception {
    doGoldenTest("accessors");
  }

  public void testAmbiguousFields() throws Exception {
    doGoldenTest("ambiguous_fields");
  }

  public void testComments() throws Exception {
    doGoldenTest("comments");
  }

  public void testCycleReference() throws Exception {
    doGoldenTest("cycle_reference");
  }

  public void testEmptyPackage() throws Exception {
    doGoldenTest("empty_package");
  }

  public void testExtensions() throws Exception {
    doGoldenTest("extensions");
  }

  public void testFieldNames() throws Exception {
    doGoldenTest("field_names");
  }

  public void testOneOfs() throws Exception {
    doGoldenTest("oneofs");
  }

  public void testParent() throws Exception {
    doGoldenTest("parent");
  }

  public void testPivot() throws Exception {
    doGoldenTest("pivot");
  }

  public void testProtoWithDashes() throws Exception {
    doGoldenTest("proto-with-dashes");
  }
}
