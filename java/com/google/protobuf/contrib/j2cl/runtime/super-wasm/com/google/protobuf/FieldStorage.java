/*
 * Copyright 2022 Google LLC
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/** A collection that efficiently stores proto fields indexed by number. */
final class FieldStorage {

  static FieldStorage create(int pivot) {
    return new FieldStorage(pivot);
  }

  private final int pivot;
  private int size;
  private Object[] array;
  private HashMap<Integer, Object> expansion;

  private FieldStorage(int pivot) {
    this.pivot = pivot;
    this.array = new Object[5]; // Create with an inital size to avoid immediate resizing.
  }

  private FieldStorage(Object[] array, HashMap<Integer, Object> expansion, int pivot, int size) {
    this.pivot = pivot;
    this.size = size;
    this.array = array;
    this.expansion = expansion;
  }

  private HashMap<Integer, Object> ensureExpension() {
    return expansion == null ? expansion = new HashMap<>() : expansion;
  }

  private Object getFromArray(int fieldNumber) {
    int index = fieldNumber - 1;
    return index < size ? array[index] : null;
  }

  private void setInArray(int fieldNumber, Object value) {
    ensureArrayCapacity(fieldNumber)[fieldNumber - 1] = value;
    size = Math.max(size, fieldNumber);
  }

  private Object[] ensureArrayCapacity(int capacity) {
    int oldCapacity = array.length;
    if (capacity > oldCapacity) {
      // Limit growth since we never use the array for fields larger than pivot.
      int newCapacity = Math.min(pivot, Math.max(capacity, oldCapacity + (oldCapacity >> 1)) + 1);
      Object[] newArray = new Object[newCapacity];
      System.arraycopy(array, 0, newArray, 0, size);
      array = newArray;
    }
    return array;
  }

  <E> E get(int fieldNumber, E defaultValue) {
    if (fieldNumber < pivot) {
      E value = (E) getFromArray(fieldNumber);
      return value != null ? value : defaultValue;
    }

    return expansion == null ? defaultValue : (E) expansion.getOrDefault(fieldNumber, defaultValue);
  }

  <E> ArrayList<E> ensureRepeated(int fieldNumber) {
    if (fieldNumber < pivot) {
      ArrayList<E> value = (ArrayList<E>) getFromArray(fieldNumber);
      if (value == null) {
        value = new ArrayList<>();
        setInArray(fieldNumber, value);
      }
      return value;
    }

    return (ArrayList<E>) ensureExpension().computeIfAbsent(fieldNumber, k -> new ArrayList<>());
  }

  <K, V> HashMap<K, V> ensureMap(int fieldNumber) {
    if (fieldNumber < pivot) {
      HashMap<K, V> value = (HashMap<K, V>) getFromArray(fieldNumber);
      if (value == null) {
        value = new HashMap<>();
        setInArray(fieldNumber, value);
      }
      return value;
    }

    return (HashMap<K, V>) ensureExpension().computeIfAbsent(fieldNumber, k -> new HashMap<>());
  }

  boolean has(int fieldNumber) {
    if (fieldNumber < pivot) {
      return getFromArray(fieldNumber) != null;
    }

    return expansion != null && expansion.containsKey(fieldNumber);
  }

  void put(int fieldNumber, Object value) {
    if (fieldNumber < pivot) {
      setInArray(fieldNumber, value);
      return;
    }

    ensureExpension().put(fieldNumber, value);
  }

  void remove(int fieldNumber) {
    if (fieldNumber < pivot) {
      int index = fieldNumber - 1;
      if (index < size) {
        array[index] = null;
      }
      return;
    }

    if (expansion != null) {
      expansion.remove(fieldNumber);
    }
  }

  FieldStorage copy() {
    int copySize = size;
    Object[] copy = Arrays.copyOf(array, copySize);
    for (int i = 0; i < copySize; i++) {
      Object field = array[i];
      if (field instanceof HashMap) {
        array[i] = (new HashMap<>((HashMap<?, ?>) field));
      } else if (field instanceof ArrayList) {
        array[i] = (new ArrayList<>((ArrayList<?>) field));
      }
      // other fields are immutable
    }
    return new FieldStorage(copy, copyOfExpension(), pivot, copySize);
  }

  private HashMap<Integer, Object> copyOfExpension() {
    if (expansion == null) {
      return expansion;
    }
    HashMap<Integer, Object> copy = new HashMap<>(expansion);
    for (Map.Entry<Integer, Object> entry : copy.entrySet()) {
      Object field = entry.getValue();
      if (field instanceof HashMap) {
        entry.setValue(new HashMap<>((HashMap<?, ?>) field));
      } else if (field instanceof ArrayList) {
        entry.setValue(new ArrayList<>((ArrayList<?>) field));
      }
      // other fields are immutable
    }
    return copy;
  }

  public boolean equals(FieldStorage other) {
    int thisSize = size;
    int otherSize = other.size;
    int minArraySize = Math.min(thisSize, otherSize);
    for (int i = 0; i < minArraySize; i++) {
      if (!Objects.equals(array[i], other.array[i])) {
        return false;
      }
    }
    for (int i = minArraySize; i < thisSize; i++) {
      if (array[i] != null) {
        return false;
      }
    }
    for (int i = minArraySize; i < otherSize; i++) {
      if (other.array[i] != null) {
        return false;
      }
    }
    if (expansion == null || expansion.isEmpty()) {
      return other.expansion == null || other.expansion.isEmpty();
    }

    return other.expansion != null && expansion.equals(other.expansion);
  }

  public int hashCode() {
    int hashCode = 1;
    for (int i = 0; i < size; i++) {
      Object e = array[i];
      // We don't want nulls to contribute hashCode since trailing null doesn't effect equality.
      if (e != null) {
        hashCode = 31 * hashCode + e.hashCode();
      }
    }
    int expensionHashCode = (expansion == null || expansion.isEmpty()) ? 0 : expansion.hashCode();
    return 31 * hashCode + expensionHashCode;
  }
}
