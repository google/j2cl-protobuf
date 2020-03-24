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

alias(
    name = "closure_math_long",
    actual = "@io_bazel_rules_closure//closure/library/math:long",
)

alias(
    name = "closure_asserts",
    actual = "@io_bazel_rules_closure//closure/library/asserts",
)

alias(
    name = "closure_object",
    actual = "@io_bazel_rules_closure//closure/library/object",
)

alias(
    name = "closure_reflect",
    actual = "@io_bazel_rules_closure//closure/library/reflect",
)

alias(
    name = "closure_crypt_base64",
    actual = "@io_bazel_rules_closure//closure/library/crypt:base64",
)

alias(
    name = "runfiles",
    actual = "@bazel_tools//tools/java/runfiles",
)
