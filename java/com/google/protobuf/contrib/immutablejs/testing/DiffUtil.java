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
package com.google.protobuf.contrib.immutablejs.testing;

import static java.nio.charset.StandardCharsets.US_ASCII;

import com.google.common.io.ByteStreams;
import com.google.common.io.Files;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** Calculates diffs of files or Strings using the 'diff' commandline tool. */
class DiffUtil {
  /**
   * Diffs the files with the given names using the {@code diff} commandline
   * tool.
   *
   * @param diffOptions Optional list of options, such as "-u", to be passed to
   * the diff command line. May be null.
   */
  static String diffFiles(String filename1, String filename2, List<String> diffOptions)
      throws IOException, InterruptedException {

    List<String> args = new ArrayList<String>();
    args.add("/usr/bin/diff");
    if (diffOptions != null) {
      args.addAll(diffOptions);
    }
    args.add(filename1);
    args.add(filename2);

    Process diffProc = Runtime.getRuntime().exec(args.toArray(new String[0]));
    InputStream diffStream = diffProc.getInputStream();
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ByteStreams.copy(diffStream, bos);
    diffProc.waitFor();
    return new String(bos.toByteArray());
  }

  /**
   * Diffs the given strings using the {@code diff} commandline tool.
   *
   * @param diffOptions Optional list of options, such as "-u", to be passed to
   * the diff command line. May be null.
   */
  static String diff(String expected, String actual, List<String> diffOptions)
      throws IOException, InterruptedException {
    File expectedFile = null;
    File actualFile = null;
    try {
      if (Objects.equals(expected, actual)) {
        return "";
      } else {
        expectedFile = File.createTempFile("expected", ".txt");
        Files.asCharSink(expectedFile, US_ASCII).write(expected);
        actualFile = File.createTempFile("actual", ".txt");
        Files.asCharSink(actualFile, US_ASCII).write(actual);

        String diff = diffFiles(expectedFile.getAbsolutePath(),
                                actualFile.getAbsolutePath(),
                                diffOptions);

        return diff;
      }
    } finally {
      if (expectedFile != null) {
        expectedFile.delete();
      }
      if (actualFile != null) {
        actualFile.delete();
      }
    }
  }

  /**
   * Diffs the given strings using the {@code diff} commandline tool.
   */
  static String diff(String expected, String actual)
      throws IOException, InterruptedException {
    return diff(expected, actual, null);
  }
}
