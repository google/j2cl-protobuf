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
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

/** Represents a protocol message */
@AutoValue
public abstract class TemplateMessageDescriptor {

  public static TemplateMessageDescriptor create(Descriptor descriptor) {
    return new AutoValue_TemplateMessageDescriptor(
        descriptor,
        TypeDescriptor.create(descriptor),
        DescriptorEncoder.forMessage(descriptor),
        Descriptors.getGroupFieldFromDescriptor(descriptor));
  }

  abstract Descriptor descriptor();

  public abstract TypeDescriptor getType();

  public abstract DescriptorEncoder getDescriptorEncoder();

  /** Returns the field that represents the group, if this message is a group message. */
  public abstract Optional<FieldDescriptor> getGroupField();

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
    Stream<FieldDescriptor> fieldsStream = fields.stream();
    if (isAny()) {
      fieldsStream = fieldsStream.filter(f -> !"value".equals(f.getName()));
    }
    return fieldsStream
        .filter(not(Descriptors::isIgnored))
        .map(f -> TemplateFieldDescriptor.create(getType(), f, nameResolver))
        .collect(toImmutableList());
  }

  public ImmutableList<TemplateFieldDescriptor> getSortedFields() {
    return ImmutableList.sortedCopyOf(
        Comparator.comparingInt(TemplateFieldDescriptor::getNumber), getFields());
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
    return Descriptors.hasMessageId(descriptor());
  }

  public String getMessageId() {
    return "0";
  }

  public int getPivot() {
    if (isGroup()) {
      // Group fields should never apply a pivot.
      return -1;
    }

    int defaultPivot = 500;

    // find max field number, or 0 if there is none.
    int maxField =
        descriptor().getFields().stream()
            .map(FieldDescriptor::getNumber)
            .max(Integer::compare)
            .orElse(0);
    if (isExtendable() || maxField >= defaultPivot) {
      return min(maxField + 1, defaultPivot);
    }

    // We don't have a suggested pivot this message as it's not extendable and its max field number
    // is smaller than the default pivot.
    return -1;
  }

  public boolean isExtendable() {
    return descriptor().isExtendable();
  }

  public boolean isMessageSet() {
    return Descriptors.isMessageSet(descriptor());
  }

  public boolean isGroup() {
    return getGroupField().isPresent();
  }

  public int getGroupFieldNumber() {
    checkState(isGroup(), "Cannot get the field number for a non-group submessage.");
    return getGroupField().get().getNumber();
  }

  public boolean hasSubmessages() {
    return Descriptors.hasSubmessages(descriptor());
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

  public boolean isAny() {
    return descriptor().getFullName().equals("google.protobuf.Any");
  }
}
