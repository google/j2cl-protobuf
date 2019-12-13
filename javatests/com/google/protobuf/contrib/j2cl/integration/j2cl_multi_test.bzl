"""Generates three j2cl tests.

   One for fast iteration (uncompiled)
   One with checking enabled (compiled)
   One with checking disabled (prod compile)
"""

load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_test")


def j2cl_multi_test(name, test_class, srcs, deps = [], proto_deps = [], generate_java_test = True):
    deps = deps + [
        "//third_party/java/junit",
        "//third_party/java/truth",
    ]

    j2cl_proto_deps = [x + "_j2cl_proto_new" for x in proto_deps]
    j2cl_deps = (
        [absolute_label(x) + "-j2cl" for x in deps] +

        j2cl_proto_deps
    )

    java_proto_deps = [x + "_java_proto" for x in proto_deps]


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
