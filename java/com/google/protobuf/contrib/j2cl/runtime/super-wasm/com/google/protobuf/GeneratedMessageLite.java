/*
 * Copyright 2021 Google LLC
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Baseclass for all J2Wasm java protos. */
@SuppressWarnings("unchecked")
public abstract class GeneratedMessageLite<
        M extends GeneratedMessageLite<M, B>, B extends GeneratedMessageLite.Builder<M, B>>
    extends GeneratedMessageLiteOrBuilder<M> implements Message {

  /** Base class for all J2Wasm proto builders */
  public abstract static class Builder<
          M extends GeneratedMessageLite<M, B>, B extends Builder<M, B>>
      extends GeneratedMessageLiteOrBuilder<M> implements Message.Builder {

    public abstract M build();

    public abstract B clone();

    /**
     * Keeps the state if this builder's fields are shared with a message instance and hence should
     * not be modified without a copy first.
     */
    boolean immutable;

    protected Builder(M message) {
      super(message.fields);
      immutable = true;
    }

    protected Builder(B builder) {
      super(builder.fields.copy());
    }

    protected final B removeField(int fieldNumber) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      fields.remove(fieldNumber);
      return (B) this;
    }

    protected final <E> B setField(int fieldNumber, E value) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      fields.put(fieldNumber, checkNotNull(value));
      return (B) this;
    }

    protected final <E> B setFieldForEnumValue(int fieldNumber, E value, int intValue) {
      return setField(fieldNumber, value == null ? intValue : value);
    }

    protected final <E> B addRepeatedField(int fieldNumber, E value) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      fields.ensureRepeated(fieldNumber).add(checkNotNull(value));
      return (B) this;
    }

    protected final <E> B addRepeatedFieldForEnumValue(int fieldNumber, E value, int intValue) {
      return addRepeatedField(fieldNumber, value == null ? intValue : value);
    }

    protected final <E> B setRepeatedField(int fieldNumber, int index, E value) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      fields.ensureRepeated(fieldNumber).set(index, checkNotNull(value));
      return (B) this;
    }

    protected final <E> B setRepeatedFieldForEnumValue(
        int fieldNumber, int index, E value, int intValue) {
      return setRepeatedField(fieldNumber, index, value == null ? intValue : value);
    }

    protected final <E> B addAllRepeatedField(int fieldNumber, Iterable<E> values) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      ArrayList<E> list = fields.ensureRepeated(fieldNumber);
      for (E v : values) {
        list.add(checkNotNull(v));
      }
      return (B) this;
    }

    protected final <K, V> B putMapField(int fieldNumber, K key, V value) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      fields.ensureMap(fieldNumber).put(checkNotNull(key), checkNotNull(value));
      return (B) this;
    }

    protected final <K, V> B putAllMapField(int fieldNumber, Map<K, V> values) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      HashMap<K, V> map = fields.ensureMap(fieldNumber);
      if (CHECKS_ENABLED) {
        for (Map.Entry<K, V> entry : values.entrySet()) {
          map.put(checkNotNull(entry.getKey()), checkNotNull(entry.getValue()));
        }
      } else {
        map.putAll(values);
      }
      return (B) this;
    }

    protected final <K, V> B removeMapField(int fieldNumber, K key) {
      if (immutable) {
        immutable = false;
        fields = fields.copy();
      }
      fields.ensureMap(fieldNumber).remove(checkNotNull(key));
      return (B) this;
    }

    public final <E> B addExtension(ExtensionLite<M, List<E>> generatedExtension, E value) {
      addRepeatedField(generatedExtension.getNumber(), value);
      return (B) this;
    }

    public final B clearExtension(ExtensionLite<M, ?> generatedExtension) {
      removeField(generatedExtension.getNumber());
      return (B) this;
    }

    public final <E> B setExtension(ExtensionLite<M, E> generatedExtension, E value) {
      setField(generatedExtension.getNumber(), value);
      return (B) this;
    }

    public final <E> B setExtension(ExtensionLite<M, List<E>> generatedExtension, List<E> values) {
      setField(generatedExtension.getNumber(), new ArrayList<>(values));
      return (B) this;
    }

    public final <E> B setExtension(
        ExtensionLite<M, List<E>> generatedExtension, int index, E value) {
      setRepeatedField(generatedExtension.getNumber(), index, value);
      return (B) this;
    }
  }

  protected GeneratedMessageLite(int pivot) {
    super(FieldStorage.create(pivot));
  }

  protected GeneratedMessageLite(B builder) {
    super(builder.fields);
    builder.immutable = true;
  }

  @Override
  public abstract B toBuilder();

  @Override
  public abstract M getDefaultInstanceForType();

  @Override
  public boolean equals(final Object other) {
    if (other == this) {
      return true;
    }
    if (other == null) {
      return false;
    }
    if (!other.getClass().equals(getClass())) {
      return false;
    }
    final GeneratedMessageLite otherMessage = (GeneratedMessageLite) other;

    return fields.equals(otherMessage.fields);
  }

  private int hashCode = 0;

  @Override
  public int hashCode() {
    if (hashCode == 0) {
      hashCode = fields.hashCode();
      if (hashCode == 0) {
        // Avoid recalculation.
        hashCode = Integer.MAX_VALUE;
      }
    }
    return hashCode;
  }

  private static final boolean CHECKS_ENABLED = "TRUE".equals(System.getProperty("J2WASM_DEBUG"));

  private static <E> E checkNotNull(E value) {
    if (CHECKS_ENABLED && value == null) {
      throw new NullPointerException();
    }
    return value;
  }

  /** J2Wasm class for all extensions */
  public static class GeneratedExtension<M extends GeneratedMessageLite<M, ?>, E>
      extends ExtensionLite<M, E> {
    private final int fieldNumber;
    private final E defaultValue;

    public GeneratedExtension(int fieldNumber, E defaultValue) {
      this.fieldNumber = fieldNumber;
      this.defaultValue = defaultValue;
    }

    @Override
    public int getNumber() {
      return fieldNumber;
    }

    @Override
    public E getDefaultValue() {
      return defaultValue;
    }
  }

  /**
   * Collection of internal code.
   *
   * <p>DO NOT USE OUTSIDE OF PROTO CODE GENERATION!
   */
  public static class Internal_ {

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
