load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")

# Test helpers for immutable proto tests.
package(
    default_visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
    ],
)

licenses(["notice"])  # Apache 2.0

closure_js_library(
    name = "proto_asserts",
    srcs = ["proto_asserts.js"],
    deps = ["//third_party:closure_testing_asserts"],
)

proto_jsunit_test(
    name = "proto_asserts_test",
    srcs = ["proto_asserts_test.js"],
    deps = [
        ":proto_asserts",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//third_party:closure_math_long",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)
