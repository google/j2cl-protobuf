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

import java.util.Properties;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.app.event.implement.IncludeRelativePath;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

/** Utility methods for using Apache Velocity. */
public final class VelocityUtil {

  public static VelocityEngine createEngine() {
    return createEngine(new Properties());
  }

  /** Creates and returns a VelocityEngine that will find templates on the classpath. */
  private static VelocityEngine createEngine(Properties properties) {
    VelocityEngine velocityEngine = new VelocityEngine();
    velocityEngine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
    velocityEngine.setProperty(
        "classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
    velocityEngine.setProperty("eventhandler.include.class", IncludeRelativePath.class.getName());
    velocityEngine.setProperty("runtime.references.strict", "true");

    velocityEngine.init(properties);
    return velocityEngine;
  }

  private VelocityUtil() {}
}
