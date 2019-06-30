package com.google.protobuf.contrib.immutablejs.generator;

import static com.google.common.base.Preconditions.checkState;

import com.google.apps.jspb.Jspb;
import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableList;
import com.google.protobuf.Descriptors.Descriptor;
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
    return descriptor().getOneofs().stream()
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

  public String getMessageId() {
    // I know this looks weird, but that is whats implemented in apps jpsb :(
    // http://google3/net/proto2/compiler/js/internal/generator.cc?dr&l=2180
    String messageId = descriptor().getOptions().getExtension(Jspb.messageId);
    if (!messageId.isEmpty()) {
      return "'" + messageId + "'";
    }

    return isResponse(descriptor()) ? "" : "0";
  }

  private static boolean isResponse(Descriptor descriptor) {
    if (descriptor.getContainingType() == null
        && descriptor.getFile().getOptions().getExtension(Jspb.responseProto)) {
      return true;
    }

    return !descriptor.getOptions().getExtension(Jspb.messageId).isEmpty();
  }

  public int getPivot() {
    int defaultPivot = 500;

    // find max field number
    Optional<Integer> optionalMaxField =
        descriptor().getFields().stream().map(f -> f.getNumber()).max(Integer::compare);

    if (!optionalMaxField.isPresent()) {
      return defaultPivot;
    }

    int maxField = optionalMaxField.get();

    if (descriptor().isExtendable() || maxField >= defaultPivot) {
      return ((maxField + 1) < defaultPivot) ? maxField + 1 : defaultPivot;
    }

    return -1;
  }

  private static Stream<Descriptor> getAllMessagesDescriptors(Descriptor message) {
    return Stream.concat(
        Stream.of(message),
        message
            .getNestedTypes()
            .stream()
            .flatMap(TemplateMessageDescriptor::getAllMessagesDescriptors));
  }

  public String getProtoFileComments() {
    return Descriptors.getProtoFileComments(descriptor());
  }
}
