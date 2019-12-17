load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")
load("@com_google_j2cl//build_defs:rules.bzl", "J2CL_OPTIMIZED_DEFS")

licenses(["notice"])  # Apache 2.0

java_library(
    name = "checks",
    srcs = ["InternalChecks.java"],
)

j2cl_library(
    name = "checks-j2cl",
    srcs = ["super/com/google/protobuf/contrib/j2cl/integration/InternalChecks.java"],
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations-j2cl",
    ],
)

j2cl_multi_test(
    name = "BooleanFieldsTest",
    srcs = ["BooleanFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.BooleanFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "BuilderCloneTest",
    srcs = ["BuilderCloneTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.BuilderCloneTest",
)

j2cl_multi_test(
    name = "ByteStringFieldsTest",
    srcs = ["ByteStringFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.ByteStringFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "DoubleFieldsTest",
    srcs = ["DoubleFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.DoubleFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "EmptyPackageTest",
    srcs = ["EmptyPackageTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.EmptyPackageTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "EnumFieldsTest",
    srcs = ["EnumFieldsTest.java"],
    proto_deps = [
    ],
    test_class = "com.google.protobuf.contrib.j2cl.integration.EnumFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "EnumGenerationTest",
    srcs = ["EnumGenerationTest.java"],
    generate_java_test = False,
    test_class = "com.google.protobuf.contrib.j2cl.integration.EnumGenerationTest",
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations",
    ],
)

j2cl_multi_test(
    name = "ExtensionsTest",
    srcs = ["ExtensionsTest.java"],
    proto_deps = [
    ],
    test_class = "com.google.protobuf.contrib.j2cl.integration.ExtensionsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "FloatFieldsTest",
    srcs = ["FloatFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.FloatFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "IntFieldsTest",
    srcs = ["IntFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.IntFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "LongFieldsTest",
    srcs = ["LongFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.LongFieldsTest",
)

j2cl_multi_test(
    name = "MessageEqualityTest",
    srcs = ["MessageEqualityTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MessageEqualityTest",
)

j2cl_multi_test(
    name = "MessageDefaultInstanceTest",
    srcs = ["MessageDefaultInstanceTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MessageDefaultInstanceTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "MessageFieldsTest",
    srcs = ["MessageFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MessageFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "OneOfsTest",
    srcs = ["OneOfsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.OneOfsTest",
)

j2cl_multi_test(
    name = "StringFieldsTest",
    srcs = ["StringFieldsTest.java"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.StringFieldsTest",
    deps = [
        ":checks",
    ],
)

COMFORMANCE_CHECK_FLAGS = J2CL_OPTIMIZED_DEFS + VERBOSE_WARNING_FLAGS_STRICT + [
    "--jscomp_error=conformanceViolations",
]

closure_js_binary(
    name = "conformance_binary",
    defs = COMFORMANCE_CHECK_FLAGS,
    deps = [
    ],
)

build_test(
    name = "conformance_test",
    targets = [
        ":conformance_binary",
    ],
)