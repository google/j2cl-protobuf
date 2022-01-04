load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")

licenses(["notice"])

closure_js_library(
    name = "test_utils",
    srcs = ["test_utils.js"],
    visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs/runtime:__subpackages__",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
    ],
)

proto_jsunit_test(
    name = "internal_constants_test",
    srcs = ["internal_constants_test.js"],
    # Don't bother running the tests compiled as we don't have any debug only checks that are
    # impacted by user-defined values.
    run_tests_compiled = 0,
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "internal_encoded_constants_test",
    srcs = ["internal_encoded_constants_test.js"],
    # Don't bother running the tests compiled as we don't have any debug only checks that are
    # impacted by user-defined values.
    run_tests_compiled = 0,
    deps = [
        ":test_utils",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_encoded_constants",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "internal_descriptor_test",
    srcs = ["internal_descriptor_test.js"],
    # Don't bother running the tests compiled as we don't have any debug only checks that are
    # impacted by user-defined values.
    run_tests_compiled = 0,
    deps = [
        ":test_utils",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_descriptor",
        "//third_party:closure_testsuite",
    ],
)
