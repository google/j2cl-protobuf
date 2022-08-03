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

import java.util.AbstractList;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.RandomAccess;
import java.util.Set;
import java.util.stream.Collectors;

/** Base class for implementing getters for fields and extension. */
public abstract class GeneratedMessageLiteOrBuilder<M extends MessageLite> {

  protected final Map<Integer, Object> fields;

  protected GeneratedMessageLiteOrBuilder(Map<Integer, Object> fields) {
    this.fields = copyFields(fields);
  }

  private Map<Integer, Object> copyFields(Map<Integer, Object> original) {
    return original.entrySet().stream()
        .collect(Collectors.toMap(Map.Entry::getKey, e -> copyField(e.getValue())));
  }

  private Object copyField(Object field) {
    if (field instanceof Map) {
      return new HashMap<>((Map<?, ?>) field);
    }
    if (field instanceof List) {
      return new ArrayList<>((List<?>) field);
    }
    // other field are immutable
    return field;
  }

  protected final <E> E getField(int fieldNumber, E defaultValue) {
    return hasField(fieldNumber) ? (E) fields.get(fieldNumber) : defaultValue;
  }

  protected final <E> E getFieldForEnum(int fieldNumber, E defaultValue, E unrecognizedValue) {
    return getEnumOrUnrecognized(getField(fieldNumber, defaultValue), unrecognizedValue);
  }

  protected final int getFieldForEnumValue(int fieldNumber, ProtocolMessageEnum defaultValue) {
    return getEnumValue(getField(fieldNumber, defaultValue));
  }

  protected final boolean hasField(int fieldNumber) {
    return fields.containsKey(fieldNumber);
  }

  protected final <E> List<E> getFieldList(int fieldNumber) {
    return Collections.unmodifiableList(new InternalListView<>(fieldNumber));
  }

  protected final <E> List<E> getFieldListForEnum(int fieldNumber, E unrecognizedValue) {
    return Collections.unmodifiableList(
        new InternalListViewForEnum<>(fieldNumber, unrecognizedValue));
  }

  protected final <E> E getRepeatedField(int fieldNumber, int index) {
    List<E> fields = getField(fieldNumber, Collections.EMPTY_LIST);
    return fields.get(index);
  }

  protected final <E> E getRepeatedFieldForEnum(int fieldNumber, int index, E unrecognizedValue) {
    List<E> fields = getField(fieldNumber, Collections.EMPTY_LIST);
    return getEnumOrUnrecognized(fields.get(index), unrecognizedValue);
  }

  protected final int getRepeatedFieldForEnumValue(int fieldNumber, int index) {
    List<?> fields = getField(fieldNumber, Collections.EMPTY_LIST);
    return getEnumValue(fields.get(index));
  }

  protected final int getRepeatedFieldCount(int fieldNumber) {
    return getField(fieldNumber, Collections.EMPTY_LIST).size();
  }

  protected final <K, V> Map<K, V> getFieldMap(int fieldNumber) {
    return Collections.unmodifiableMap(new InternalMapView<>(fieldNumber));
  }

  protected final <K, V> V getOrThrow(int fieldNumber, K key) {
    Map<K, V> map = getField(fieldNumber, Collections.EMPTY_MAP);
    V value = map.get(key);
    if (value == null) {
      throw new IllegalArgumentException("Unknown key");
    }
    return value;
  }

  protected final <K, V> V getOrDefault(int fieldNumber, K key, V defaultValue) {
    if (key == null) {
      throw new NullPointerException();
    }
    Map<K, V> map = getField(fieldNumber, Collections.EMPTY_MAP);
    return map.getOrDefault(key, defaultValue);
  }

  public final <E> E getExtension(ExtensionLite<M, E> generatedExtension) {
    return getField(generatedExtension.getNumber(), generatedExtension.getDefaultValue());
  }

  public final <E> E getExtension(ExtensionLite<M, List<E>> generatedExtension, int index) {
    return getRepeatedField(generatedExtension.getNumber(), index);
  }

  public final <E> int getExtensionCount(ExtensionLite<M, List<E>> generatedExtension) {
    return getRepeatedFieldCount(generatedExtension.getNumber());
  }

  public final boolean hasExtension(ExtensionLite<M, ?> generatedExtension) {
    return hasField(generatedExtension.getNumber());
  }

  private static final int getEnumValue(Object enumOrIntValue) {
    if (enumOrIntValue instanceof Integer) {
      return ((Integer) enumOrIntValue).intValue();
    }
    return ((ProtocolMessageEnum) enumOrIntValue).getNumber();
  }

  private static final <E> E getEnumOrUnrecognized(Object enumOrIntValue, E unrecognizedValue) {
    if (enumOrIntValue instanceof Integer) {
      // It is an unrecognized value, return unrecognized placeholder instead.
      return unrecognizedValue;
    }
    return (E) enumOrIntValue;
  }

  private class InternalListView<E> extends AbstractList<E> implements RandomAccess {
    private final int fieldNumber;

    private InternalListView(int fieldNumber) {
      this.fieldNumber = fieldNumber;
    }

    @Override
    public E get(int index) {
      return getRepeatedField(fieldNumber, index);
    }

    @Override
    public int size() {
      return getRepeatedFieldCount(fieldNumber);
    }
  }

  private class InternalListViewForEnum<E> extends AbstractList<E> implements RandomAccess {
    private final int fieldNumber;
    private final E unrecognizedValue;

    private InternalListViewForEnum(int fieldNumber, E unrecognizedValue) {
      this.fieldNumber = fieldNumber;
      this.unrecognizedValue = unrecognizedValue;
    }

    @Override
    public E get(int index) {
      return getRepeatedFieldForEnum(fieldNumber, index, unrecognizedValue);
    }

    @Override
    public int size() {
      return getRepeatedFieldCount(fieldNumber);
    }
  }

  private class InternalMapView<K, V> extends AbstractMap<K, V> {
    private final int fieldNumber;

    private InternalMapView(int fieldNumber) {
      this.fieldNumber = fieldNumber;
    }

    @Override
    public Set<Entry<K, V>> entrySet() {
      return getFieldMap().entrySet();
    }

    @Override
    public boolean containsKey(Object key) {
      return getFieldMap().containsKey(key);
    }

    @Override
    public V get(Object key) {
      return getFieldMap().get(key);
    }

    private Map<K, V> getFieldMap() {
      return getField(fieldNumber, Collections.EMPTY_MAP);
    }
  }
}
