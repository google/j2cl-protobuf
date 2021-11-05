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
package com.google.protobuf.contrib.immutablejs.generator;

import static com.google.common.base.Preconditions.checkState;
import static com.google.common.base.Predicates.not;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.lang.Math.min;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import java.util.List;
import java.util.stream.Stream;

/** Represents a protocol message */
@AutoValue
public abstract class TemplateMessageDescriptor {

  public static TemplateMessageDescriptor create(Descriptor descriptor) {
    return new AutoValue_TemplateMessageDescriptor(descriptor, TypeDescriptor.create(descriptor));
  }

  abstract Descriptor descriptor();

  public abstract TypeDescriptor getType();

  public ImmutableList<TemplateEnumDescriptor> getAllEnums() {
    checkState(getType().isTopLevel());
    return getAllMessagesDescriptors(descriptor())
        .flatMap(d -> d.getEnumTypes().stream())
        .map(TemplateEnumDescriptor::create)
        .collect(toImmutableList());
  }

  public ImmutableList<TemplateMessageDescriptor> getAllMessages() {
    checkState(getType().isTopLevel());
    return getAllMessagesDescriptors(descriptor())
        .map(TemplateMessageDescriptor::create)
        .filter(not(TemplateMessageDescriptor::isMapEntry))
        .collect(toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getFields() {
    List<FieldDescriptor> fields = descriptor().getFields();
    NameResolver nameResolver = NameResolver.of(fields);
    return fields.stream()
        .map(f -> TemplateFieldDescriptor.create(getType(), f, nameResolver))
        .collect(toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getExtensions() {
    List<FieldDescriptor> extensions = descriptor().getExtensions();
    NameResolver nameResolver = NameResolver.of(extensions);
    return extensions.stream()
        .map(f -> TemplateFieldDescriptor.create(getType(), f, nameResolver))
        .collect(toImmutableList());
  }

  public ImmutableList<TemplateOneOfDescriptor> getOneOfs() {
    return descriptor().getRealOneofs().stream()
        .map(o -> TemplateOneOfDescriptor.create(getType(), o))
        .collect(toImmutableList());
  }

  public ImmutableList<ImportDescriptor> getImports() {
    checkState(getType().isTopLevel());
    return Descriptors.calculateImports(
        getAllMessagesDescriptors(descriptor())
            .map(TemplateMessageDescriptor::create)
            .flatMap(d -> Stream.concat(d.getFields().stream(), d.getExtensions().stream())));
  }

  public boolean hasMessageId() {
    return false;
  }

  public String getMessageId() {
    return "0";
  }

  public int getPivot() {
    int defaultPivot = 500;

    // find max field number, or 0 if there is none.
    int maxField =
        descriptor().getFields().stream()
            .map(FieldDescriptor::getNumber)
            .max(Integer::compare)
            .orElse(0);
    if (descriptor().isExtendable() || maxField >= defaultPivot) {
      return min(maxField + 1, defaultPivot);
    }

    // We don't have a suggested pivot this message as it's not extendable and its max field number
    // is smaller than the default pivot.
    return -1;
  }

  private static Stream<Descriptor> getAllMessagesDescriptors(Descriptor message) {
    return Stream.concat(
        Stream.of(message),
        message.getNestedTypes().stream()
            .flatMap(TemplateMessageDescriptor::getAllMessagesDescriptors));
  }

  public String getProtoFileComments() {
    return Descriptors.getProtoFileComments(descriptor());
  }

  public boolean isDeprecated() {
    return descriptor().getOptions().getDeprecated();
  }

  private boolean isMapEntry() {
    return descriptor().getOptions().getMapEntry();
  }
}
