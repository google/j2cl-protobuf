/*
 * Copyright 2021 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.protobuf.contrib.immutablejs.generator;

import com.google.common.collect.ImmutableSet;

/** All JavaScript keywords and Closure predefined types. */
final class JsReservedWords {
  private static final ImmutableSet<String> RESERVED =
      ImmutableSet.of(

          // Names of common externs / Closure types.
          "boolean",
          "number",
          "goog",
          "string",
          "undefined",
          "window",
          "Array",
          "Object",
          "Infinity",
          "Function",
          "Map",
          "NaN",
          "String",

          // Javascript keywords.
          "abstract",
          "arguments",
          "async",
          "await",
          "boolean",
          "break",
          "byte",
          "case",
          "catch",
          "char",
          "class",
          "const",
          "continue",
          "debugger",
          "default",
          "delete",
          "do",
          "double",
          "else",
          "enum",
          "eval",
          "export",
          "exports",
          "extends",
          "false",
          "final",
          "finally",
          "float",
          "for",
          "function",
          "goto",
          "if",
          "implements",
          "import",
          "in",
          "instanceof",
          "int",
          "interface",
          "let",
          "long",
          "native",
          "new",
          "null",
          "package",
          "private",
          "protected",
          "public",
          "return",
          "short",
          "static",
          "super",
          "switch",
          "synchronized",
          "this",
          "throw",
          "throws",
          "transient",
          "true",
          "try",
          "typeof",
          "var",
          "void",
          "volatile",
          "while",
          "with",
          "yield");

  static boolean isReverved(String s) {
    return RESERVED.contains(s);
  }

  private JsReservedWords() {}
}
