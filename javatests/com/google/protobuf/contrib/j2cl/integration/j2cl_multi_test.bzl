"""Generates three j2cl tests.

   One for fast iteration (uncompiled)
   One with checking enabled (compiled)
   One with checking disabled (prod compile)
"""

load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_test", "j2wasm_test")
load("@bazel_tools//tools/build_defs/label:def.bzl", "absolute_label")
load("//devtools/build_cleaner/skylark:build_defs.bzl", "register_extension_info")

def j2cl_multi_test(
        name,
        test_class,
        srcs,
        deps = [],
        proto_deps = [],
        generate_java_test = True,
        generate_wasm_test = True):
    deps = deps + [
        "//third_party/java/junit",
        "//third_party/java/truth",
    ]

    j2cl_proto_deps = [x + "_j2cl_proto" for x in proto_deps]
    j2cl_deps = (
        [absolute_label(x) + "-j2cl" for x in deps] +
        ["//java/com/google/protobuf/contrib/j2cl:runtime"] +
        j2cl_proto_deps
    )
    j2wasm_deps = (
        [absolute_label(x) + "-j2wasm" for x in deps] +
        ["//java/com/google/protobuf/contrib/j2cl:runtime-j2wasm"] +
        j2cl_proto_deps
    )

    java_proto_deps = [x + "_java_proto" for x in proto_deps]
    java_deps = deps + ["//java/com/google/protobuf"] + java_proto_deps

    j2cl_test(
        name = name,
        test_class = test_class,
        srcs = srcs,
        deps = j2cl_deps,
    )

    j2cl_test(
        name = name + "_compiled",
        test_class = test_class,
        srcs = srcs,
        deps = j2cl_deps,
        compile = 1,
        extra_defs = [
            "--jscomp_error=conformanceViolations",
        ],
    )

    j2cl_test(
        name = name + "_compiled_checks_off",
        test_class = test_class,
        srcs = srcs,
        deps = j2cl_deps,
        compile = 1,
        extra_defs = [
            "--define=proto.im.defines.CHECKED_MODE__DO_NOT_USE_INTERNAL=false",
            "--jscomp_error=conformanceViolations",
        ],
    )

    if generate_java_test:
        native.java_test(
            name = name + "_java",
            srcs = srcs,
            test_class = test_class,
            deps = java_deps,
        )

    if generate_wasm_test:
        j2wasm_test(
            name = name + "_wasm",
            test_class = test_class,
            srcs = srcs,
            wasm_defs = {"jre.checks.checkLevel": "NORMAL"},
            deps = j2wasm_deps,
        )
        j2wasm_test(
            name = name + "_wasm_optimized_checks_off",
            test_class = test_class,
            srcs = srcs,
            optimize = True,
            wasm_defs = {
                "J2WASM_DEBUG": "FALSE",
                "jre.checks.checkLevel": "NORMAL",
            },
            deps = j2wasm_deps,
        )

register_extension_info(
    extension = j2cl_multi_test,
    label_regex_for_dep = "{extension_name}(_java)?",
)
