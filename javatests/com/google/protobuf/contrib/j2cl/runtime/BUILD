load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("//javascript/tools/jscompiler/builddefs:flags.bzl", "VERBOSE_WARNING_FLAGS_STRICT")
load("//javatests/com/google/protobuf/contrib/j2cl/integration:j2cl_multi_test.bzl", "j2cl_multi_test")
load("@com_google_j2cl//build_defs:rules.bzl", "J2CL_OPTIMIZED_DEFS")
load("@bazel_tools//tools/build_defs/build_test:build_test.bzl", "build_test")

licenses(["notice"])  # Apache 2.0

j2cl_multi_test(
    name = "ByteStringTest",
    srcs = ["ByteStringTest.java"],
    # The tests here test internals of our proto runtime implementation that do
    # not exist in the JRE version.
    generate_java_test = False,
    test_class = "com.google.protobuf.contrib.j2cl.runtime.ByteStringTest",
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations",
        "//third_party/java/jsinterop:jsinterop-base",
    ],
)

j2cl_multi_test(
    name = "InternalTest",
    srcs = ["InternalTest.java"],
    # The tests here test internals of our proto runtime implementation that do
    # not exist in the JRE version.
    generate_java_test = False,
    test_class = "com.google.protobuf.contrib.j2cl.runtime.InternalTest",
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations",
        "//third_party/java/jsinterop:jsinterop-base",
    ],
)

j2cl_multi_test(
    name = "JspbUtilsTest",
    srcs = ["JspbUtilsTest.java"],
    # Testing a J2CL specific API.
    generate_java_test = False,
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.runtime.JspbUtilsTest",
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations",
        "//third_party/java/jsinterop:jsinterop-base",
    ],
)

COMFORMANCE_CHECK_FLAGS = J2CL_OPTIMIZED_DEFS + VERBOSE_WARNING_FLAGS_STRICT + [
    "--conformance_config=//javascript/closure:conformance_proto.txt",
    "--jscomp_error=conformanceViolations",
]

closure_js_binary(
    name = "conformance_binary",
    defs = COMFORMANCE_CHECK_FLAGS,
    extra_inputs = ["//javascript/closure:conformance_proto.txt"],
    deps = ["//java/com/google/protobuf/contrib/j2cl:runtime"],
)

build_test(
    name = "conformance_test",
    targets = [
        ":conformance_binary",
    ],
)
