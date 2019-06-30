package com.google.protobuf.contrib.j2cl.generator;

import java.util.Properties;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.app.event.implement.IncludeRelativePath;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

/** Utility methods for using Apache Velocity. */
final class VelocityUtil {

  static VelocityEngine createEngine() {
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