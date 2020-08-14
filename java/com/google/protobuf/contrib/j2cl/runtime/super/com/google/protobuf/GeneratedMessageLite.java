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
package com.google.protobuf;

import com.google.protobuf.GeneratedMessageLite.Internal_.ExtensionFieldInfo;
import com.google.protobuf.GeneratedMessageLite.Internal_.ListView;
import com.google.protobuf.GeneratedMessageLite.Internal_.TypeConverter;
import java.util.AbstractList;
import java.util.Collections;
import java.util.List;
import java.util.RandomAccess;
import jsinterop.annotations.JsOverlay;
import jsinterop.annotations.JsType;
import jsinterop.base.Js;

/** Baseclass for all J2CL protos */
@SuppressWarnings("unchecked")
@JsType(isNative = true, name = "Message", namespace = "proto.im")
public abstract class GeneratedMessageLite<
        M extends GeneratedMessageLite<M, B>, B extends GeneratedMessageLite.Builder<M, B>>
    implements Message {

  /** Base class for all J2CL proto builders */
  @JsType(isNative = true)
  public abstract static class Builder<
          M extends GeneratedMessageLite<M, B>, B extends Builder<M, B>>
      implements Message.Builder {

    public native M build();

    public native B clone();

    private native Object getExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo);

    @JsOverlay
    public final <E> E getExtension(ExtensionLite<M, E> generatedExtension) {
      // Casting here will work since extensions use this instance all the time.
      return ((GeneratedExtension<M, E>) generatedExtension).getExtension(this);
    }

    private native Object getExtensionAtIndex(
        ExtensionFieldInfo<M, ?> extensionFieldInfo, int index);

    @JsOverlay
    public final <E> E getExtension(ExtensionLite<M, List<E>> generatedExtension, int index) {
      // Casting here will work since repeated extensions use this instance all the time.
      return ((GeneratedRepeatedExtension<M, E>) generatedExtension)
          .getExtensionAtIndex(this, index);
    }

    private native int getExtensionCount(ExtensionFieldInfo<M, ?> extensionFieldInfo);

    @JsOverlay
    public final <E> int getExtensionCount(ExtensionLite<M, List<E>> generatedExtension) {
      // Casting here will work since repeated extensions use this instance all the time.
      return ((GeneratedRepeatedExtension<M, E>) generatedExtension).getExtensionCount(this);
    }

    private native <E> boolean hasExtension(ExtensionFieldInfo<M, E> extensionFieldInfo);

    @JsOverlay
    public final boolean hasExtension(ExtensionLite<M, ?> generatedExtension) {
      // Casting here will work since extensions use this instance all the time.
      return ((GeneratedExtension<M, ?>) generatedExtension).hasExtension(this);
    }

    private native void addExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo, Object value);

    @JsOverlay
    public final <E> B addExtension(ExtensionLite<M, List<E>> generatedExtension, E value) {
      // Casting here will work since repeated extensions use this instance all the time.
      ((GeneratedRepeatedExtension<M, E>) generatedExtension).addExtension(this, value);
      return (B) this;
    }

    private native B clearExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo);

    @JsOverlay
    public final B clearExtension(ExtensionLite<M, ?> generatedExtension) {
      // Casting here will work since extensions use this instance all the time.
      ((GeneratedExtension<M, ?>) generatedExtension).clearExtension(this);
      return (B) this;
    }

    private native B setExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo, Object value);

    @JsOverlay
    public final <E> B setExtension(ExtensionLite<M, E> generatedExtension, E value) {
      // Casting here will work since extensions use this instance all the time.
      ((GeneratedExtension<M, E>) generatedExtension).setExtension(this, value);
      return (B) this;
    }

    private native B setExtensionAtIndex(
        ExtensionFieldInfo<M, ?> extensionFieldInfo, int index, Object value);

    @JsOverlay
    public final <E> B setExtension(
        ExtensionLite<M, List<E>> generatedExtension, int index, E value) {
      // Casting here will work since repeated extensions use this instance all the time.
      ((GeneratedRepeatedExtension<M, E>) generatedExtension)
          .setExtensionAtIndex(this, index, value);
      return (B) this;
    }
  }

  @Override
  public native B toBuilder();

  private native Object getExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo);

  @JsOverlay
  public final <E> E getExtension(ExtensionLite<M, E> generatedExtension) {
    // Casting here will work since extensions use this instance all the time.
    return ((GeneratedExtension<M, E>) generatedExtension).getExtension(this);
  }

  private native Object getExtensionAtIndex(ExtensionFieldInfo<M, ?> extensionFieldInfo, int index);

  @JsOverlay
  public final <E> E getExtension(ExtensionLite<M, List<E>> generatedExtension, int index) {
    // Casting here will work since repeated extensions use this instance all the time.
    return ((GeneratedRepeatedExtension<M, E>) generatedExtension).getExtensionAtIndex(this, index);
  }

  private native int getExtensionCount(ExtensionFieldInfo<M, ?> extensionFieldInfo);

  @JsOverlay
  public final <E> int getExtensionCount(ExtensionLite<M, List<E>> generatedExtension) {
    // Casting here will work since repeated extensions use this instance all the time.
    return ((GeneratedRepeatedExtension<M, E>) generatedExtension).getExtensionCount(this);
  }

  private native boolean hasExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo);

  @JsOverlay
  public final boolean hasExtension(ExtensionLite<M, ?> generatedExtension) {
    // Casting here will work since extensions use this instance all the time.
    return ((GeneratedExtension<M, ?>) generatedExtension).hasExtension(this);
  }

  /** J2CL base class for all extensions */
  private static class GeneratedExtension<M extends GeneratedMessageLite<M, ?>, E>
      extends ExtensionLite<M, E> {

    final ExtensionFieldInfo<M, ?> extensionFieldInfo;
    final TypeConverter<Object, E> readConverter;
    final TypeConverter<E, Object> writeConverter;

    private GeneratedExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      this(extensionFieldInfo, val -> (E) val, val -> val);
    }

    private GeneratedExtension(
        ExtensionFieldInfo<M, ?> extensionFieldInfo,
        TypeConverter<Object, E> readConverter,
        TypeConverter<E, Object> writeConverter) {
      this.extensionFieldInfo = extensionFieldInfo;
      this.readConverter = readConverter;
      this.writeConverter = writeConverter;
    }

    E getExtension(GeneratedMessageLite<M, ?> message) {
      return readConverter.convert(message.getExtension(this.extensionFieldInfo));
    }

    E getExtension(GeneratedMessageLite.Builder<M, ?> builder) {
      return readConverter.convert(builder.getExtension(this.extensionFieldInfo));
    }

    boolean hasExtension(GeneratedMessageLite<M, ?> message) {
      return message.hasExtension(this.extensionFieldInfo);
    }

    boolean hasExtension(GeneratedMessageLite.Builder<M, ?> builder) {
      return builder.hasExtension(this.extensionFieldInfo);
    }

    void setExtension(GeneratedMessageLite.Builder<M, ?> builder, E value) {
      builder.setExtension(extensionFieldInfo, writeConverter.convert(value));
    }

    void clearExtension(GeneratedMessageLite.Builder<M, ?> builder) {
      builder.clearExtension(extensionFieldInfo);
    }
  }

  private static class GeneratedRepeatedExtension<M extends GeneratedMessageLite<M, ?>, E>
      extends GeneratedExtension<M, List<E>> {
    final TypeConverter<Object, E> indexReadConverter;
    final TypeConverter<E, Object> indexWriteConverter;

    GeneratedRepeatedExtension(ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      this(extensionFieldInfo, val -> (E) val, val -> val);
    }

    GeneratedRepeatedExtension(
        ExtensionFieldInfo<M, ?> extensionFieldInfo,
        TypeConverter<Object, E> indexReadConverter,
        TypeConverter<E, Object> indexWriteConverter) {
      super(
          extensionFieldInfo,
          val -> Internal_.createList((ListView<E>) val, indexReadConverter),
          null /* setExtension is overridden so never called (see below). */);
      this.indexReadConverter = indexReadConverter;
      this.indexWriteConverter = indexWriteConverter;
    }

    void addExtension(GeneratedMessageLite.Builder<M, ?> builder, E value) {
      builder.addExtension(extensionFieldInfo, indexWriteConverter.convert(value));
    }

    E getExtensionAtIndex(GeneratedMessageLite<M, ?> message, int index) {
      return indexReadConverter.convert(
          message.getExtensionAtIndex(this.extensionFieldInfo, index));
    }

    E getExtensionAtIndex(GeneratedMessageLite.Builder<M, ?> builder, int index) {
      return indexReadConverter.convert(
          builder.getExtensionAtIndex(this.extensionFieldInfo, index));
    }

    int getExtensionCount(GeneratedMessageLite<M, ?> message) {
      return message.getExtensionCount(this.extensionFieldInfo);
    }

    int getExtensionCount(GeneratedMessageLite.Builder<M, ?> builder) {
      return builder.getExtensionCount(this.extensionFieldInfo);
    }

    @Override
    void setExtension(GeneratedMessageLite.Builder<M, ?> builder, List<E> value) {
      // Since we can not create a ListView instance in Java we can not use the common logic in the
      // parent. This class for this reason overwrites the setExtension method and manually adds all
      // instance of the list.
      clearExtension(builder);
      for (E val : value) {
        addExtension(builder, val);
      }
    }

    void setExtensionAtIndex(GeneratedMessageLite.Builder<M, ?> builder, int index, E value) {
      builder.setExtensionAtIndex(extensionFieldInfo, index, indexWriteConverter.convert(value));
    }
  }

  /**
   * Collection of internal classes.
   *
   * <p>DO NOT USE OUTSIDE OF PROTO CODE GENERATION!
   */
  public static class Internal_ {

    /** Immutable JS proto's representation of extension info. */
    @JsType(isNative = true, name = "Message.ExtensionFieldInfo", namespace = "proto.im")
    public static class ExtensionFieldInfo<M extends GeneratedMessageLite<M, ?>, J> {}

    /** Simple add function used to implemented addAll in a generic way. */
    public interface AddFunction<T> {
      void add(T value);
    }

    public static <T> void addAll(Iterable<T> iterable, AddFunction<T> addFunction) {
      for (T t : iterable) {
        addFunction.add(t);
      }
    }

    /** Immutable JS proto's representation of a repeated field */
    @JsType(isNative = true, namespace = "proto.im")
    public interface ListView<T> {
      T get(int index);

      int size();
    }

    private abstract static class RandomAccessList<T> extends AbstractList<T>
        implements RandomAccess {}

    public static final <T> List<T> createList(final ListView<T> listView) {
      return Collections.unmodifiableList(
          new RandomAccessList<T>() {
            @Override
            public T get(int index) {
              return listView.get(index);
            }

            @Override
            public int size() {
              return listView.size();
            }
          });
    }

    /** Converts between unboxed and boxed types */
    public interface TypeConverter<T, B> {
      B convert(T t);
    }

    public static final TypeConverter<Object, Float> FLOAT_TYPE_CONVERTER =
        d -> Float.valueOf(Js.asFloat(d));
    public static final TypeConverter<Float, Object> FLOAT_WRITE_TYPE_CONVERTER =
        d -> Js.asAny(d.floatValue());
    public static final TypeConverter<Object, Integer> INT_TYPE_CONVERTER =
        d -> Integer.valueOf(Js.asInt(d));
    public static final TypeConverter<Integer, Object> INT_WRITE_TYPE_CONVERTER =
        d -> (double) d.intValue();
    public static final TypeConverter<Object, Long> LONG_TYPE_CONVERTER =
        d -> Long.valueOf(Js.asLong(d));
    public static final TypeConverter<Long, Object> LONG_WRITE_TYPE_CONVERTER =
        d -> Js.asAny(d.longValue());

    public static final <T, B> List<B> createList(
        final ListView<T> listView, TypeConverter<? super T, B> converter) {
      return Collections.unmodifiableList(
          new RandomAccessList<B>() {
            @Override
            public B get(int index) {
              return converter.convert(listView.get(index));
            }

            @Override
            public int size() {
              return listView.size();
            }
          });
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, Boolean> createSingleBooleanExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, Boolean>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, List<Boolean>> createRepeatedBooleanExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, Boolean>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, ByteString> createSingleByteStringExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, ByteString>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, List<ByteString>> createRepeatedByteStringExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, ByteString>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, Double> createSingleDoubleExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, Double>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, List<Double>> createRepeatedDoubleExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, Double>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>, E>
        ExtensionLite<M, E> createSingleEnumExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo,
            TypeConverter<Object, E> readConverter,
            TypeConverter<E, Object> writeConverter) {
      return new GeneratedExtension<M, E>(extensionFieldInfo, readConverter, writeConverter);
    }

    public static <M extends GeneratedMessageLite<M, ?>, E>
        ExtensionLite<M, List<E>> createRepeatedEnumExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo,
            TypeConverter<Object, E> readConverter,
            TypeConverter<E, Object> writeConverter) {
      return new GeneratedRepeatedExtension<M, E>(
          extensionFieldInfo, readConverter, writeConverter);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, Float> createSingleFloatExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, Float>(
          extensionFieldInfo, Internal_.FLOAT_TYPE_CONVERTER, Internal_.FLOAT_WRITE_TYPE_CONVERTER);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, List<Float>> createRepeatedFloatExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, Float>(
          extensionFieldInfo, Internal_.FLOAT_TYPE_CONVERTER, Internal_.FLOAT_WRITE_TYPE_CONVERTER);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, Integer> createSingleIntExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, Integer>(
          extensionFieldInfo, Internal_.INT_TYPE_CONVERTER, Internal_.INT_WRITE_TYPE_CONVERTER);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, List<Integer>> createRepeatedIntExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, Integer>(
          extensionFieldInfo, Internal_.INT_TYPE_CONVERTER, Internal_.INT_WRITE_TYPE_CONVERTER);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, Long> createSingleLongExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, Long>(
          extensionFieldInfo, Internal_.LONG_TYPE_CONVERTER, Internal_.LONG_WRITE_TYPE_CONVERTER);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, List<Long>> createRepeatedLongExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, Long>(
          extensionFieldInfo, Internal_.LONG_TYPE_CONVERTER, Internal_.LONG_WRITE_TYPE_CONVERTER);
    }

    public static <M extends GeneratedMessageLite<M, ?>, E>
        ExtensionLite<M, E> createSingleMessageExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, E>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>, E>
        ExtensionLite<M, List<E>> createRepeatedMessageExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, E>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, String> createSingleStringExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedExtension<M, String>(extensionFieldInfo);
    }

    public static <M extends GeneratedMessageLite<M, ?>>
        ExtensionLite<M, List<String>> createRepeatedStringExtension(
            ExtensionFieldInfo<M, ?> extensionFieldInfo) {
      return new GeneratedRepeatedExtension<M, String>(extensionFieldInfo);
    }

    /**
     * Assumes that the given value is the value of a proto3 enum, if the value corresponds to the
     * {@code UNRECOGNIZED} value then this method will throw an exception.
     */
    public static void checkUnrecognized(int value) {
      if (value == -1) {
        throw new IllegalArgumentException("Can't get the number of an unknown enum value.");
      }
    }
  }
}
