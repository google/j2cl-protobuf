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
package com.google.protobuf.contrib.j2cl.integration;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertThrows;

import com.google.protobuf.contrib.j2cl.protos.Maps.MapTestProto;
import java.util.AbstractMap.SimpleImmutableEntry;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class MapsTest {
  @Test
  public void testMap_containsKey_whenPresent_returnsTrue() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().containsKey("foo")).isTrue();
  }

  @Test
  public void testMap_containsKey_whenNotPresent_returnsFalse() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().containsKey("buzz")).isFalse();
  }

  @Test
  public void testMap_containsKey_withNullKey_returnsFalse() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().containsKey(null)).isFalse();
  }

  @Test
  public void testMap_containsValue_whenPresent_returnsTrue() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().containsValue("bar")).isTrue();
  }

  @Test
  public void testMap_containsValue_whenNotPresent_returnsFalse() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().containsValue("buzz")).isFalse();
  }

  @Test
  public void testMap_containsValue_withNullKey_returnsFalse() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().containsValue(null)).isFalse();
  }

  @Test
  public void testMap_size_whenPopulated_returnsEntryCount() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().size()).isEqualTo(1);
  }

  @Test
  public void testMap_size_whenEmpty_returnsZero() {
    MapTestProto proto = MapTestProto.getDefaultInstance();
    assertThat(proto.getStringKeyStringValueMap().size()).isEqualTo(0);
  }

  @Test
  public void testMap_isEmpty_whenPopulated_returnsFalse() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().isEmpty()).isFalse();
  }

  @Test
  public void testMap_isEmpty_whenEmpty_returnsTrue() {
    MapTestProto proto = MapTestProto.getDefaultInstance();
    assertThat(proto.getStringKeyStringValueMap().isEmpty()).isTrue();
  }

  @Test
  public void testMap_get_whenKeyPresent_returnsValue() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().get("foo")).isEqualTo("bar");
  }

  @Test
  public void testMap_get_whenKeyNotPresent_returnsNull() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().get("buzz")).isNull();
  }

  @Test
  public void testMap_get_withNullKey_returnsNull() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThat(proto.getStringKeyStringValueMap().get(null)).isNull();
  }

  @Test
  public void testMap_put_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().put("buzz", "bazz"));
  }

  @Test
  public void testMap_putIfAbsent_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().putIfAbsent("buzz", "bazz"));
  }

  @Test
  public void testMap_putAll_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    HashMap<String, String> valueMap = new HashMap<>();
    valueMap.put("buzz", "bazz");
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().putAll(valueMap));
  }

  @Test
  public void testMap_replaceKey_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().replace("foo", "bazz"));
  }

  @Test
  public void testMap_replace_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().replace("foo", "bar", "bazz"));
  }

  @Test
  public void testMap_replaceAll_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().replaceAll((key, value) -> value));
  }

  @Test
  public void testMap_removeKey_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().remove("foo"));
  }

  @Test
  public void testMap_remove_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class,
        () -> proto.getStringKeyStringValueMap().remove("foo", "bar"));
  }


  @Test
  public void testMap_clear_throwsUnsupportedOperationException() {
    MapTestProto proto = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar").build();
    assertThrows(
        UnsupportedOperationException.class, () -> proto.getStringKeyStringValueMap().clear());
  }

  @Test
  public void testMap_keySet_returnsAllKeys() {
    MapTestProto proto =
        MapTestProto.newBuilder()
            .putStringKeyStringValue("foo", "bar")
            .putStringKeyStringValue("buzz", "bazz")
            .build();
    assertThat(proto.getStringKeyStringValueMap().keySet()).containsExactly("foo", "buzz");
  }

  @Test
  public void testMap_values_returnsAllValues() {
    MapTestProto proto =
        MapTestProto.newBuilder()
            .putStringKeyStringValue("foo", "bar")
            .putStringKeyStringValue("buzz", "bazz")
            .putStringKeyStringValue("dupe", "bar")
            .build();
    assertThat(proto.getStringKeyStringValueMap().values()).containsExactly("bar", "bazz", "bar");
  }

  @Test
  public void testMap_entrySet_returnsAllEntries() {
    MapTestProto proto =
        MapTestProto.newBuilder()
            .putStringKeyStringValue("foo", "bar")
            .putStringKeyStringValue("buzz", "bazz")
            .putStringKeyStringValue("dupe", "bar")
            .build();
    assertThat(proto.getStringKeyStringValueMap().entrySet())
        .containsExactly(
            new SimpleImmutableEntry<>("foo", "bar"),
            new SimpleImmutableEntry<>("buzz", "bazz"),
            new SimpleImmutableEntry<>("dupe", "bar"));
  }

  @Test
  public void testMapBuilder_keySet_updatesWithMutations() {
    MapTestProto.Builder builder =
        MapTestProto.newBuilder()
            .putStringKeyStringValue("foo", "bar")
            .putStringKeyStringValue("buzz", "bazz");
    Set<String> keySet = builder.getStringKeyStringValueMap().keySet();

    assertThat(keySet).containsExactly("foo", "buzz");

    builder.removeStringKeyStringValue("foo").putStringKeyStringValue("newKey", "newValue");

    assertThat(keySet).containsExactly("newKey", "buzz");
  }

  @Test
  public void testMapBuilder_values_updatesWithMutations() {
    MapTestProto.Builder builder =
        MapTestProto.newBuilder()
            .putStringKeyStringValue("foo", "bar")
            .putStringKeyStringValue("buzz", "bazz");
    Collection<String> values = builder.getStringKeyStringValueMap().values();

    assertThat(values).containsExactly("bar", "bazz");

    builder.removeStringKeyStringValue("foo").putStringKeyStringValue("newKey", "newValue");

    assertThat(values).containsExactly("newValue", "bazz");
  }

  @Test
  public void testMapBuilder_entrySet_updatesWithMutations() {
    MapTestProto.Builder builder =
        MapTestProto.newBuilder()
            .putStringKeyStringValue("foo", "bar")
            .putStringKeyStringValue("buzz", "bazz")
            .putStringKeyStringValue("dupe", "bar");
    Set<Map.Entry<String, String>> entrySet = builder.getStringKeyStringValueMap().entrySet();
    assertThat(entrySet)
        .containsExactly(
            new SimpleImmutableEntry<>("foo", "bar"),
            new SimpleImmutableEntry<>("buzz", "bazz"),
            new SimpleImmutableEntry<>("dupe", "bar"));

    builder.removeStringKeyStringValue("foo").putStringKeyStringValue("newKey", "newValue");

    assertThat(entrySet)
        .containsExactly(
            new SimpleImmutableEntry<>("newKey", "newValue"),
            new SimpleImmutableEntry<>("buzz", "bazz"),
            new SimpleImmutableEntry<>("dupe", "bar"));
  }

  @Test
  public void testMapBuilder_getMap_returnsImmutableMap() {
    MapTestProto.Builder builder = MapTestProto.newBuilder().putStringKeyStringValue("foo", "bar");
    Map<String, String> mapField = builder.getStringKeyStringValueMap();

    assertThrows(Exception.class, () -> mapField.put("buzz", "bazz"));
    assertThrows(Exception.class, () -> mapField.remove("foo"));
  }

  @Test
  public void testMap_toBuilder_originalIsNotModified() {
    MapTestProto original = MapTestProto.newBuilder().putInt32KeyInt32Value(1, 1).build();

    assertThat(original.getInt32KeyInt32ValueMap()).containsExactly(1, 1);
    assertThat(original.toBuilder().putInt32KeyInt32Value(1, 2).build().getInt32KeyInt32ValueMap())
        .containsExactly(1, 2);
    assertThat(original.getInt32KeyInt32ValueMap()).containsExactly(1, 1);
  }
}
