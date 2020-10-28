/*
 * Copyright 2020 Google Inc.
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
package com.google.protobuf.contrib.immutablejs.integration.generator;

import static com.google.common.base.CaseFormat.UPPER_CAMEL;
import static com.google.common.base.CaseFormat.UPPER_UNDERSCORE;
import static java.nio.charset.StandardCharsets.US_ASCII;

import com.google.common.io.BaseEncoding;
import com.google.protobuf.Descriptors.FieldDescriptor.Type;
import java.util.function.Function;

/** Wraps a {@link Type} with a value provider/renderer for both Mutable JSPB and Immutable JSPB. */
public final class ProtobufTestValueProvider<T> {
  private static final String[] testStrings = new String[] {"alpha", "bravo"};

  private static final ProtobufTestValueProvider<String> STRING_PROVIDER =
      new ProtobufTestValueProvider<>(
          Type.STRING,
          testStrings,
          (value) -> String.format("'%s'", value),
          (value) -> String.format("'%s'", value));

  private static final ProtobufTestValueProvider<Double> DOUBLE_PROVIDER =
      new ProtobufTestValueProvider<>(Type.DOUBLE, new Double[] {1.333333, 2.66666});

  private static final ProtobufTestValueProvider<Float> FLOAT_PROVIDER =
      new ProtobufTestValueProvider<>(Type.FLOAT, new Float[] {1.333333f, 2.66666f});

  private static final ProtobufTestValueProvider<Integer> INT32_PROVIDER =
      new ProtobufTestValueProvider<>(
          Type.INT32, new Integer[] {Integer.MIN_VALUE, Integer.MAX_VALUE});

  private static final ProtobufTestValueProvider<Integer> UINT32_PROVIDER =
      // Use -1 to force the sign bit.

      new ProtobufTestValueProvider<>(Type.UINT32, new Integer[] {0, -1});

  private static final ProtobufTestValueProvider<Long> INT64_PROVIDER =
      new ProtobufTestValueProvider<>(
          Type.INT64,
          // Shift sufficiently to be out of int32 range.
          new Long[] {-(1L << 50), 1L << 50},
          String::valueOf,
          (value) -> String.format("Long.fromString('%d')", value));

  private static final ProtobufTestValueProvider<Long> UINT64_PROVIDER =
      new ProtobufTestValueProvider<>(
          Type.UINT64,
          // Use -1 to force the sign bit.
          new Long[] {1L, -1L},
          String::valueOf,
          (value) -> String.format("Long.fromString('%s')", value));

  private static final ProtobufTestValueProvider<Boolean> BOOLEAN_PROVIDER =
      new ProtobufTestValueProvider<>(Type.BOOL, new Boolean[] {true, false});

  private static final ProtobufTestValueProvider<String> MESSAGE_PROVIDER =
      new ProtobufTestValueProvider<>(
          Type.MESSAGE,
          testStrings,
          (value) -> String.format("(new MutableProto.NestedMessage()).setFoo('%s')", value),
          (value) ->
              String.format(
                  "ImmutableProto.NestedMessage.newBuilder().setFoo('%s').build()", value));

  private static final ProtobufTestValueProvider<String> BYTES_PROVIDER =
      new ProtobufTestValueProvider<>(
          Type.BYTES,
          testStrings,
          (value) -> String.format("'%s'", BaseEncoding.base64().encode(value.getBytes(US_ASCII))),
          (value) ->
              String.format(
                  "ByteString.fromBase64String('%s')",
                  BaseEncoding.base64().encode(value.getBytes(US_ASCII))));

  private static final ProtobufTestValueProvider<Integer> ENUM_PROVIDER =
      new ProtobufTestValueProvider<>(
          Type.ENUM,
          new Integer[] {1, 2},
          (value) ->
              String.format(
                  "/** @type {!MutableProto.TestEnum} */ (%d %%"
                      + " Object.keys(MutableProto.TestEnum).length)",
                  value),
          (value) ->
              String.format(
                  "/** @type {!ImmutableProto.TestEnum} */ (%d %%"
                      + " Object.keys(ImmutableProto.TestEnum).length)",
                  value));

  public static ProtobufTestValueProvider<?> forType(Type type) {
    switch (type) {
      case DOUBLE:
        return DOUBLE_PROVIDER;
      case FLOAT:
        return FLOAT_PROVIDER;
      case UINT32:
        return UINT32_PROVIDER;
      case INT32:
        return INT32_PROVIDER;
      case UINT64:
        return UINT64_PROVIDER;
      case INT64:
        return INT64_PROVIDER;
      case BOOL:
        return BOOLEAN_PROVIDER;
      case STRING:
        return STRING_PROVIDER;
      case MESSAGE:
        return MESSAGE_PROVIDER;
      case BYTES:
        return BYTES_PROVIDER;
      case ENUM:
        return ENUM_PROVIDER;
      case SINT32:
      case FIXED32:
      case SFIXED32:
      case SFIXED64:
      case FIXED64:
      case SINT64:
        throw new IllegalArgumentException("Type is covered by by other tests cases");
      case GROUP:
        throw new IllegalArgumentException("Unsupported type");
    }
    throw new IllegalStateException("Switch was exhaustive.");
  }

  private final Type type;
  private final T[] testValues;
  private final Function<T, String> mutableValueRenderer;
  private final Function<T, String> immutableValueRenderer;

  private ProtobufTestValueProvider(
      Type type,
      T[] testValues,
      Function<T, String> mutableValueRenderer,
      Function<T, String> immutableValueRenderer) {
    this.type = type;
    this.testValues = testValues;
    this.mutableValueRenderer = mutableValueRenderer;
    this.immutableValueRenderer = immutableValueRenderer;
  }

  private ProtobufTestValueProvider(Type type, T[] testValues) {
    this(type, testValues, String::valueOf, String::valueOf);
  }

  public String getStem() {
    return UPPER_UNDERSCORE.to(UPPER_CAMEL, type.name());
  }

  public String renderMutableValue(int index) {
    return mutableValueRenderer.apply(testValues[index]);
  }

  public String renderImmutableValue(int index) {
    return immutableValueRenderer.apply(testValues[index]);
  }
}
