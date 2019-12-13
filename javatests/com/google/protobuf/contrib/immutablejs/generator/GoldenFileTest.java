// Copyright 2011 Google Inc. All Rights Reserved.

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
