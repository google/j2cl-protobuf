"""
Helpers for defining tests for immutablejs protobuf.
"""

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_test")

def proto_jsunit_test(name, srcs, deps, run_tests_compiled = 1):

    closure_js_test(
        name = name,
        srcs = srcs,
        compilation_level = "WHITESPACE_ONLY",
        deps = deps,
    )

    if run_tests_compiled:
        closure_js_test(
            name = name + "_compiled",
            srcs = srcs,
            compilation_level = "ADVANCED",
            deps = deps,
        )