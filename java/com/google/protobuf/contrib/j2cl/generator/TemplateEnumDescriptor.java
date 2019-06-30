package com.google.protobuf.contrib.j2cl.generator;

import static com.google.common.base.Preconditions.checkState;
import static com.google.common.collect.ImmutableList.toImmutableList;

import com.google.auto.value.AutoValue;
import com.google.protobuf.Descriptors.Descriptor;
import com.google.protobuf.Descriptors.EnumDescriptor;
import com.google.protobuf.contrib.JavaQualifiedNames;
import com.google.protos.protobuf.contrib.j2cl.options.JsEnum;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/** Represents a proto buffer enum */
@AutoValue
public abstract class TemplateEnumDescriptor {
  public static TemplateEnumDescriptor create(EnumDescriptor enumDescriptor) {
    return new AutoValue_TemplateEnumDescriptor(enumDescriptor);
  }

  abstract EnumDescriptor enumDescriptor();

  public String getName() {
    return enumDescriptor().getName();
  }

  public String getPackage() {
    checkState(isTopLevelClass());
    return JavaQualifiedNames.getPackage(enumDescriptor().getFile());
  }

  public List<TemplateEnumValueDescriptor> getValues() {
    Set<Integer> seen = new HashSet<>();
    return enumDescriptor().getValues().stream()
        .map(e -> TemplateEnumValueDescriptor.create(e, !seen.add(e.getNumber())))
        .collect(toImmutableList());
  }

  public boolean isTopLevelClass() {
    return TemplateFileDescriptor.create(enumDescriptor().getFile()).getMultipleFiles()
        && enumDescriptor().getContainingType() == null;
  }

  public String getFileName() {
    checkState(isTopLevelClass());
    return Descriptors.calculateFileName(getPackage(), getName());
  }

  public boolean isJsEnum() {
    return enumDescriptor().getOptions().getExtension(JsEnum.generateJsEnum);
  }

  public boolean isDense() {
    List<TemplateEnumValueDescriptor> values = getValues();
    for (int i = 0; i < values.size(); i++) {
      if (values.get(i).getNumber() != i) {
        return false;
      }
    }
    return true;
  }

  public String getJsName() {
    Deque<String> list = new ArrayDeque<>();
    list.addFirst(enumDescriptor().getName());
    Descriptor descriptor = enumDescriptor().getContainingType();

    while (descriptor != null) {
      list.addFirst(descriptor.getName());
      descriptor = descriptor.getContainingType();
    }
    return list.stream().collect(Collectors.joining("."));
  }

  public String getJsNameSpace() {
    return TemplateFileDescriptor.create(enumDescriptor().getFile()).getJsNameSpace();
  }
}
