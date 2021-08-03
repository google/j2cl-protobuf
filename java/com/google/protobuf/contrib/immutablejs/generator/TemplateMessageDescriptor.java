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

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;
import java.util.Optional;
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
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateMessageDescriptor> getAllMessages() {
    checkState(getType().isTopLevel());
    return getAllMessagesDescriptors(descriptor())
        .map(TemplateMessageDescriptor::create)
        .filter(not(TemplateMessageDescriptor::isMapEntry))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getFields() {
    return descriptor().getFields().stream()
        .map(f -> TemplateFieldDescriptor.create(getType(), f))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getExtensions() {
    return descriptor().getExtensions().stream()
        .map(f -> TemplateFieldDescriptor.create(getType(), f))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<TemplateOneOfDescriptor> getOneOfs() {
    return descriptor().getRealOneofs().stream()
        .map(o -> TemplateOneOfDescriptor.create(getType(), o))
        .collect(ImmutableList.toImmutableList());
  }

  public ImmutableList<ImportDescriptor> getImports() {
    checkState(getType().isTopLevel());
    return Descriptors.calculateImports(
        getAllMessagesDescriptors(descriptor())
            .flatMap(d -> Stream.concat(d.getFields().stream(), d.getExtensions().stream()))
            .map(f -> TemplateFieldDescriptor.create(getType(), f)));
  }

  public boolean hasMessageId() {
    return false;
  }

  public String getMessageId() {
    return "0";
  }

  public int getPivot() {
    int defaultPivot = 500;

    // find max field number
    Optional<Integer> optionalMaxField =
        descriptor().getFields().stream().map(FieldDescriptor::getNumber).max(Integer::compare);

    if (!optionalMaxField.isPresent()) {
      return defaultPivot;
    }

    int maxField = optionalMaxField.get();
    if (descriptor().isExtendable() || maxField >= defaultPivot) {
      return Math.min(maxField + 1, defaultPivot);
    }

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
