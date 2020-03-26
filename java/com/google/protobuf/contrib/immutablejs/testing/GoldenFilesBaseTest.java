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
package com.google.protobuf.contrib.immutablejs.testing;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.common.collect.Sets.SetView;
import com.google.common.io.ByteStreams;
import com.google.common.io.MoreFiles;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Set;
import java.util.stream.StreamSupport;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import junit.framework.TestCase;

/** Base class for golden file tests */
public abstract class GoldenFilesBaseTest extends TestCase {

  /** Represents a generated file */
  @AutoValue
  protected abstract static class GeneratedFile {

    public static GeneratedFile create(String path, String content) {
      return new AutoValue_GoldenFilesBaseTest_GeneratedFile(path, content);
    }

    abstract String getPath();

    abstract String getContent();
  }

  protected ImmutableSet<GeneratedFile> loadGoldenFiles(String protoName) throws Exception {
    return loadZipFiles(protoName, getClass());
  }

  protected void doGoldenTest(String protoName) throws Exception {
    ImmutableSet<GeneratedFile> generatedFiles = loadGoldenFiles(protoName);
    ImmutableSet<GeneratedFile> goldenFiles =
        loadFilesFromDir("golden_files/" + protoName + "/", ".txt");

    StringWriter writer = new StringWriter();
    if (hasDiff(generatedFiles, goldenFiles, writer)) {
      fail(writer.toString());
    }
  }

  private static boolean hasDiff(
      ImmutableSet<GeneratedFile> filesInZip, ImmutableSet<GeneratedFile> filesInDir, Writer writer)
      throws Exception {

    SetView<GeneratedFile> difference = Sets.symmetricDifference(filesInZip, filesInDir);

    if (difference.isEmpty()) {
      return false;
    }

    ImmutableMap<String, GeneratedFile> filesInZipAsMap =
        Maps.uniqueIndex(filesInZip, GeneratedFile::getPath);

    ImmutableMap<String, GeneratedFile> filesInDirAsMap =
        Maps.uniqueIndex(filesInDir, GeneratedFile::getPath);

    Set<String> pathNamesInZip = filesInZipAsMap.keySet();
    Set<String> pathNamesInDir = filesInDirAsMap.keySet();
    SetView<String> pathDifference = Sets.symmetricDifference(pathNamesInZip, pathNamesInDir);

    if (!pathDifference.isEmpty()) {
      // path names are different so we have new / deleted files
      for (String path : pathDifference) {
        if (pathNamesInZip.contains(path)) {
          writer.append("File in generated files present, but missing in golden files: " + path);
          writer.append("\n\n");
        } else {
          writer.append("Generate generated file missing, but present in golden files: " + path);
          writer.append("\n\n");
        }
      }
    }

    // Output files that are present in both
    ImmutableList<String> pathInDiff =
        difference.stream().map(GeneratedFile::getPath).collect(ImmutableList.toImmutableList());

    for (String path : pathInDiff) {
      if (filesInDirAsMap.containsKey(path) && filesInZipAsMap.containsKey(path)) {

        String dirContent = filesInDirAsMap.get(path).getContent();
        String zipContent = filesInZipAsMap.get(path).getContent();
        String diff = DiffUtil.diff(dirContent, zipContent);
        writer.append("Difference in file: " + path);
        writer.append("\n");
        writer.append(diff);
        writer.append("\n\n");
      }
    }
    return true;
  }

  protected ImmutableSet<GeneratedFile> loadFilesFromDir(String relativePath) throws Exception {
    return loadFilesFromDir(relativePath, "");
  }

  private ImmutableSet<GeneratedFile> loadFilesFromDir(String relativePath, String postfix)
      throws Exception {
    Path path = getRunfileLocation(getClass(), relativePath);
    try (DirectoryStream<Path> stream = Files.newDirectoryStream(path)) {
      return StreamSupport.stream(stream.spliterator(), false)
          .map(p -> readFile(p, postfix))
          .collect(ImmutableSet.toImmutableSet());
    }
  }

  private static GeneratedFile readFile(Path p, String postfix) {
    try {
      String content = MoreFiles.asCharSource(p, UTF_8).read();
      String name = p.toFile().getName();
      assertTrue(name, name.endsWith(postfix));
      name = name.substring(0, name.length() - postfix.length());
      return GeneratedFile.create(name, content);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static ImmutableSet<GeneratedFile> loadZipFiles(String protoName, Class<?> testClass)
      throws IOException {
    Path path = getRunfileLocation(testClass, protoName + ".zip");
    try (ZipFile zipFile = new ZipFile(path.toFile())) {
      return Collections.list(zipFile.entries()).stream()
          .map(e -> readZipContent(zipFile, e))
          .collect(ImmutableSet.toImmutableSet());
    }
  }

  private static GeneratedFile readZipContent(ZipFile zipFile, ZipEntry entry) {
    try {
      byte[] bytes = ByteStreams.toByteArray(zipFile.getInputStream(entry));
      String content = new String(bytes, UTF_8);
      return GeneratedFile.create(entry.getName(), content);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static Path getRunfileLocation(Class<?> clazz, String relativePath) {
    String packagePath = clazz.getPackage().getName().replace('.', '/');
    return getTestRootLocation().resolve(Paths.get(packagePath, relativePath));
  }

  private static Path getTestRootLocation() {
    try {
      return Paths.get(
          com.google.devtools.build.runfiles.Runfiles.create().rlocation("javatests"));
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }
}
