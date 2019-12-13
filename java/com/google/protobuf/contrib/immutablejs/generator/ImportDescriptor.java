package com.google.protobuf.contrib.immutablejs.generator;


import com.google.auto.value.AutoValue;

/** References an import. */
@AutoValue
public abstract class ImportDescriptor {

  public abstract String getModuleName();

  public abstract String getImportName();
}
