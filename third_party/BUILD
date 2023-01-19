# Description:
#   Thirdparty dependencies indirection for bazel.
load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_import")
load("//java/com/google/protobuf/contrib/immutablejs:immutable_js_proto_library.bzl", "immutable_js_proto_library")

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
    name = "escapevelocity",
    exports = [
        "@com_google_escapevelocity//jar",
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

immutable_js_proto_library(
    name = "timestamp_immutable_js_proto",
    deps = ["@com_google_protobuf//:timestamp_proto"],
)

immutable_js_proto_library(
    name = "any_immutable_js_proto",
    deps = ["@com_google_protobuf//:any_proto"],
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
    actual = "@com_google_javascript_closure_library//closure/goog/math:long",
)

alias(
    name = "closure_asserts",
    actual = "@com_google_javascript_closure_library//closure/goog/asserts",
)

alias(
    name = "closure_functions",
    actual = "@com_google_javascript_closure_library//closure/goog/functions",
)

alias(
    name = "closure_reflect",
    actual = "@com_google_javascript_closure_library//closure/goog/reflect",
)

alias(
    name = "closure_testsuite",
    actual = "@com_google_javascript_closure_library//closure/goog/testing:testsuite",
)

alias(
    name = "closure_testing_asserts",
    actual = "@com_google_javascript_closure_library//closure/goog/testing:asserts",
)

alias(
    name = "closure_crypt_base64",
    actual = "@com_google_javascript_closure_library//closure/goog/crypt:base64",
)

alias(
    name = "runfiles",
    actual = "@bazel_tools//tools/java/runfiles",
)

alias(
    name = "args4j",
    actual = "@args4j",
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
