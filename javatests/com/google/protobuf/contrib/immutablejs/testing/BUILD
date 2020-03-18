load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("//testing/web/build_defs:jsunit.bzl", "jsunit_test_suite")
load("//javascript/tools/jscompiler/builddefs:flags.bzl", "JS_TEST_FLAGS", "VERBOSE_WARNING_FLAGS_STRICT")

# Test helpers for immutable proto tests.
package(
    default_visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
    ],
)

licenses(["notice"])  # Apache 2.0

_BROWSERS = ["//testing/web/browsers:chrome-linux"]

closure_js_library(
    name = "proto_asserts",
    srcs = ["proto_asserts.js"],
    deps = [
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
    ],
)

jsunit_test_suite(
    name = "proto_asserts_test",
    srcs = ["proto_asserts_test.js"],
    browsers = _BROWSERS,
    deps_mgmt = "closure",
    deps = [
        ":proto_asserts",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
    ],
)

jsunit_test_suite(
    name = "proto_asserts_test_compiled",
    srcs = ["proto_asserts_test.js"],
    browsers = _BROWSERS,
    compile = 1,
    defs = VERBOSE_WARNING_FLAGS_STRICT + JS_TEST_FLAGS + [
        "--manage_closure_dependencies=false",  # b/73956781
        "--conformance_config=//javascript/closure:conformance_proto.txt",
    ],
    deps_mgmt = "closure",
    extra_inputs = ["//javascript/closure:conformance_proto.txt"],
    deps = [
        ":proto_asserts",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
    ],
)
