"""
Helpers for defining tests for immutablejs protobuf.
"""

load("//testing/web/build_defs:jsunit.bzl", "jsunit_test_suite")



_BROWSERS = ["//testing/web/browsers:chrome-linux"]

_JS_TEST_FLAGS_STRICT = VERBOSE_WARNING_FLAGS_STRICT + JS_TEST_FLAGS

def proto_jsunit_test(name, srcs, deps):
    jsunit_test_suite(
        name = name,
        srcs = srcs,
        browsers = _BROWSERS,
        deps_mgmt = "closure",
        deps = deps,
    )

    jsunit_test_suite(
        name = name + "_compiled",
        srcs = srcs,
        browsers = _BROWSERS,
        compile = 1,
        defs = _JS_TEST_FLAGS_STRICT + [
            "--manage_closure_dependencies=false",  # b/73956781
        ],
        deps_mgmt = "closure",
        deps = deps,
    )

    jsunit_test_suite(
        name = name + "_compiled_checks_off",
        srcs = srcs,
        browsers = _BROWSERS,
        compile = 1,
        defs = _JS_TEST_FLAGS_STRICT + [
            "--define=proto.im.defines.CHECKED_MODE__DO_NOT_USE_INTERNAL=false",
            "--manage_closure_dependencies=false",  # b/73956781
        ],
        deps_mgmt = "closure",
        deps = deps,
    )

    native.js_binary(
        name = name + "_js_binary",
        srcs = srcs,
        defs = VERBOSE_WARNING_FLAGS_STRICT + [

            "--jscomp_error=conformanceViolations",
        ],

        deps = deps,
    )

    build_test(
        name = name + "_js_binary_build_test",
        targets = [":" + name + "_js_binary"],
    )
