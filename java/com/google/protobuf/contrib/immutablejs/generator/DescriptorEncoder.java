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
package com.google.protobuf.contrib.immutablejs.generator;

import static com.google.common.base.Preconditions.checkArgument;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.FieldDescriptor;

/**
 * Encodes message type information in a minified format optimal for client applications.
 *
 * <p>Full encoding specification: go/minidescriptor-encoding
 */
public abstract class DescriptorEncoder {
  static DescriptorEncoder forMessage(Descriptor descriptor) {
    return new MessageDescriptorEncoder(descriptor);
  }

  static DescriptorEncoder forField(FieldDescriptor field) {
    checkArgument(!Descriptors.isIgnored(field));
    if (field.isMapField()) {
      return forMessage(field.getMessageType());
    } else {
      return new FieldDescriptorEncoder(field);
    }
  }

  private DescriptorEncoder() {}

  /**
   * Whether the encoded descriptor can be represented by a simple string.
   *
   * <p>For example, a field or message that is/has submessage(s) requires extra information about
   * each submessage descriptor and thus cannot be encoded with just a string.
   */
  public abstract boolean canUseConciseEncoding();

  public abstract String getEncodedDescriptor();

  private static final class MessageDescriptorEncoder extends DescriptorEncoder {
    private final Descriptor descriptor;

    private MessageDescriptorEncoder(Descriptor descriptor) {
      this.descriptor = descriptor;
    }

    @Override
    public boolean canUseConciseEncoding() {
      return !Descriptors.isMessageSet(descriptor)
          && !Descriptors.hasMessageId(descriptor)
          && !descriptor.isExtendable()
          && !Descriptors.hasSubmessages(descriptor);
    }

    @Override
    public String getEncodedDescriptor() {
      EncodedBase92Builder base92Builder = new EncodedBase92Builder();
      int lastFieldNumber = 0;
      for (FieldDescriptor field : ImmutableList.sortedCopyOf(descriptor.getFields())) {
        // Pretend like ignored fields don't exist.
        if (Descriptors.isIgnored(field)) {
          continue;
        }
        int fieldNumber = field.getNumber();
        int fieldNumberGap = fieldNumber - lastFieldNumber;
        if (fieldNumberGap > 1) {
          skipFields(base92Builder, fieldNumberGap);
        }
        encodeField(base92Builder, field);
        lastFieldNumber = fieldNumber;
      }
      return base92Builder.toString();
    }
  }

  private static final class FieldDescriptorEncoder extends DescriptorEncoder {
    private final FieldDescriptor fieldDescriptor;

    private FieldDescriptorEncoder(FieldDescriptor fieldDescriptor) {
      this.fieldDescriptor = fieldDescriptor;
    }

    @Override
    public boolean canUseConciseEncoding() {
      return fieldDescriptor.getType() != FieldDescriptor.Type.MESSAGE;
    }

    @Override
    public String getEncodedDescriptor() {
      EncodedBase92Builder base92Builder = new EncodedBase92Builder();
      encodeField(base92Builder, fieldDescriptor);
      return base92Builder.toString();
    }
  }

  private static final int SINGULAR_FIELDS_START = 0;
  private static final int REPEATED_FIELDS_START = 21;

  private static void encodeField(EncodedBase92Builder base92Builder, FieldDescriptor field) {
    FieldType fieldType = FieldType.fromField(field);
    int offset = field.isRepeated() ? REPEATED_FIELDS_START : SINGULAR_FIELDS_START;
    base92Builder.addValue(offset + fieldType.value);
    encodeModifiers(base92Builder, field);
  }

  private static final int MODIFIERS_START = 42;
  private static final int MODIFIERS_SHIFT_AMOUNT = 4;
  private static final int MODIFIERS_BITMASK = 0x0F;

  private static void encodeModifiers(EncodedBase92Builder base92Builder, FieldDescriptor field) {
    int modifiersValue = 0;
    for (Modifier modifier : Modifier.modifiersForField(field)) {
      modifiersValue |= modifier.bitmask;
    }
    while (modifiersValue != 0) {
      base92Builder.addValue((modifiersValue & MODIFIERS_BITMASK) + MODIFIERS_START);
      modifiersValue >>= MODIFIERS_SHIFT_AMOUNT;
    }
  }

  private static final int FIELD_SKIPS_START = 60;
  private static final int FIELD_SKIPS_SHIFT_AMOUNT = 5;
  private static final int FIELD_SKIPS_BITMASK = 0x1F;

  private static void skipFields(EncodedBase92Builder base92Builder, int skipAmount) {
    checkArgument(skipAmount > 1, "Field skip amount must be more than one.");
    while (skipAmount != 0) {
      base92Builder.addValue((skipAmount & FIELD_SKIPS_BITMASK) + FIELD_SKIPS_START);
      skipAmount >>= FIELD_SKIPS_SHIFT_AMOUNT;
    }
  }

  private enum FieldType {
    DOUBLE(0),
    FLOAT(1),
    FIXED32(2),
    FIXED64(3),
    SFIXED32(4),
    SFIXED64(5),
    INT32(6),
    UINT32(7),
    SINT32(8),
    INT64(9),
    UINT64(10),
    SINT64(11),
    ENUM(12),
    BOOL(13),
    BYTES(14),
    STRING(15),
    GROUP(16),
    MESSAGE(17);

    private final int value;

    FieldType(int value) {
      this.value = value;
    }

    static FieldType fromField(FieldDescriptor field) {
      return FieldType.valueOf(field.getType().name());
    }
  }

  enum Modifier {
    UNPACKED(1 << 0),
    JSPB_INT64_STRING(1 << 1);

    private final int bitmask;

    Modifier(int bitmask) {
      this.bitmask = bitmask;
    }

    static ImmutableSet<Modifier> modifiersForField(FieldDescriptor field) {
      ImmutableSet.Builder<Modifier> modifiers = ImmutableSet.builder();
      if (field.isPackable() && !field.isPacked()) {
        modifiers.add(UNPACKED);
      }
      // TODO(b/215693557): Once implementations tolerate string encoding of numbers we can remove
      // this modifier and just always convert to the optimal/correct representation.
      if (field.getJavaType() == FieldDescriptor.JavaType.LONG && !Descriptors.isInt52(field)) {
        modifiers.add(JSPB_INT64_STRING);
      }
      return modifiers.build();
    }
  }

  private static final class EncodedBase92Builder {
    private final StringBuilder sb = new StringBuilder();

    private static final int ASCII_LOWEST_PRINTABLE = 32;
    private static final ImmutableList<Integer> SKIP_ASCII_VALUES =
        ImmutableList.of(
            // These values must be in ascending order.
            34, // "
            39, // '
            92 // \
            );

    public EncodedBase92Builder addValue(int value) {
      checkArgument(value >= 0 && value < 92, "Value %s is not in range [0, 91]", value);
      int asciiValue = value + ASCII_LOWEST_PRINTABLE;
      // We skip over characters that would require escaping in various languages. To do this we'll
      // apply an offset based on how many characters we need to skip over.
      for (int skipAsciiValue : SKIP_ASCII_VALUES) {
        if (asciiValue >= skipAsciiValue) {
          asciiValue++;
        }
      }
      sb.append((char) asciiValue);
      return this;
    }

    public EncodedBase92Builder addValues(int... values) {
      for (int value : values) {
        addValue(value);
      }
      return this;
    }

    @Override
    public String toString() {
      return sb.toString();
    }
  }
}
