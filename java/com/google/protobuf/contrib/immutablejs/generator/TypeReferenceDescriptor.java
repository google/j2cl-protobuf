package com.google.protobuf.contrib.immutablejs.generator;

import com.google.auto.value.AutoValue;

/** Holds a reference from a type (context) to another type (target). */
@AutoValue
public abstract class TypeReferenceDescriptor {

  abstract TypeDescriptor context();

  abstract TypeDescriptor target();

  public boolean needsImport() {
    return !target().getModuleName().isEmpty() && !target().hasSameParent(context());
  }

  public String getExpression() {
    return needsImport() ? target().getImportName() : target().getLocalName();
  }

  public String getCycleSafeExpression() {
    return needsImport() ? target().getModuleGetName() : target().getLocalName();
  }
}
