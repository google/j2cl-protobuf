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

  public void testAccessors() throws Exception {
    doGoldenTest("accessor");
  }

  public void testAccessorsMultipleFiles() throws Exception {
    doGoldenTest("accessor-multiple-files");
  }

  public void testAmbiguousFields() throws Exception {
    doGoldenTest("ambiguous_fields");
  }

  public void testEnumAlias() throws Exception {
    doGoldenTest("enum_alias");
  }

  public void testEnumAliasMultipleFiles() throws Exception {
    doGoldenTest("enum_alias-multiple-files");
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

  public void testNativeEnum() throws Exception {
    doGoldenTest("native_enum");
  }

  public void testNativeEnumMultipleFiles() throws Exception {
    doGoldenTest("native_enum-multiple-files");
  }

  public void testOneOfs() throws Exception {
    doGoldenTest("oneofs");
  }

  public void testOneOfsMultipleFiles() throws Exception {
    doGoldenTest("oneofs-multiple-files");
  }

  public void testSparse() throws Exception {
    doGoldenTest("sparse");
  }

  public void testSparseMultipleFiles() throws Exception {
    doGoldenTest("sparse-multiple-files");
  }
}
