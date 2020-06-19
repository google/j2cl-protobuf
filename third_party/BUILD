# Description:
#   Thirdparty dependencies indirection for bazel.
load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_import")

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

j2cl_import(
    name = "jsr305_annotations-j2cl",
    jar = ":jsr305_annotations",
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
    name = "protocol_compiler",
    actual = "@com_google_protobuf//:protoc",
    visibility = ["//visibility:public"],
)

alias(
    name = "protobuf_descriptor",
    actual = "@com_google_protobuf//:descriptor_proto",
)

alias(
    name = "clang-format",
    actual = "@io_bazel_rules_closure//third_party/llvm/llvm/tools/clang:clang-format",
    visibility = ["//visibility:public"],
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
    name = "closure_testsuite",
    actual = "@io_bazel_rules_closure//closure/library/testing:testsuite",
)

alias(
    name = "closure_testing_asserts",
    actual = "@io_bazel_rules_closure//closure/library/testing:asserts",
)

alias(
    name = "closure_crypt_base64",
    actual = "@io_bazel_rules_closure//closure/library/crypt:base64",
)

alias(
    name = "runfiles",
    actual = "@bazel_tools//tools/java/runfiles",
)

alias(
    name = "args4j",
    actual = "//third_party/java/args4j",
)

alias(
    name = "gwt-jsinterop-annotations-j2cl",
    actual = "@com_google_jsinterop_annotations-j2cl//:jsinterop-annotations-j2cl",
    visibility = ["//visibility:public"],
)

alias(
    name = "jsinterop-base-j2cl",
    actual = "@com_google_jsinterop_base//:jsinterop-base-j2cl",
    visibility = ["//visibility:public"],
)

java_binary(
    name = "google_java_format",
    main_class = "com.google.googlejavaformat.java.Main",
    visibility = ["//visibility:public"],
    runtime_deps = ["@com_google_google_java_format//jar"],
)

alias(
    name = "j2cl_proto_runtime",
    actual = "//java/com/google/protobuf/contrib/j2cl:runtime",
    visibility = ["//visibility:public"],
)
