load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("//testing/web/build_defs:jsunit.bzl", "jsunit_test_suite")

# Test helpers for immutable proto tests.
package(
    default_visibility = [
    ],
)

licenses(["notice"])  # Apache 2.0

_BROWSERS = ["//testing/web/browsers:chrome-linux"]

closure_js_library(
    name = "proto_asserts",
    srcs = ["proto_asserts.js"],
    deps = [
    ],
)

jsunit_test_suite(
    name = "proto_asserts_test",
    srcs = ["proto_asserts_test.js"],
    browsers = _BROWSERS,
    deps_mgmt = "closure",
    deps = [
        ":proto_asserts",
    ],
)

jsunit_test_suite(
    name = "proto_asserts_test_compiled",
    srcs = ["proto_asserts_test.js"],
    browsers = _BROWSERS,
    compile = 1,
    defs = VERBOSE_WARNING_FLAGS_STRICT + JS_TEST_FLAGS + [
        "--manage_closure_dependencies=false",  # b/73956781
    ],
    deps_mgmt = "closure",
    deps = [
        ":proto_asserts",
    ],
)
