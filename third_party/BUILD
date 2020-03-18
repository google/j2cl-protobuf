# Description:
#   Thirdparty dependencies indirection for bazel.
package(
    default_visibility = ["//:__subpackages__"],
    licenses = ["notice"],  # Apache 2.0
)

alias(
    name = "guava",
    actual = "@com_google_guava",
)

java_library(
    name = "junit",
    testonly = 1,
    exports = ["@org_junit//jar"],
)

alias(
    name = "jsr305_annotations",
    actual = "@com_google_code_findbugs_jsr305",
)

alias(
    name = "auto_value",
    actual = "@com_google_auto_value",
)

java_library(
    name = "jakarta_velocity",
    exports = [
        "@org_apache_velocity//jar",
    ],
    runtime_deps = [
        "@org_apache_commons_collections//jar",
        "@org_apache_commons_lang2//jar",
    ],
)

alias(
    name = "protobuf",
    actual = "@com_google_protobuf//:protobuf_java",
)

java_proto_library(
    name = "descriptor_java_proto",
    deps = ["@com_google_protobuf//:descriptor_proto"],
)

java_proto_library(
    name = "plugin_java_proto",
    deps = ["@com_google_protobuf//:compiler_plugin_proto"],
)
