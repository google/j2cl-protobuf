load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("//javascript/tools/jscompiler/builddefs:flags.bzl", "VERBOSE_WARNING_FLAGS_STRICT")
load("//javatests/com/google/protobuf/contrib/j2cl/integration:j2cl_multi_test.bzl", "j2cl_multi_test")
load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")
load("@com_google_j2cl//build_defs:rules.bzl", "J2CL_OPTIMIZED_DEFS")
load("@bazel_tools//tools/build_defs/build_test:build_test.bzl", "build_test")

licenses(["notice"])  # Apache 2.0

java_library(
    name = "checks",
    srcs = ["InternalChecks.java"],
)

j2cl_library(
    name = "checks-j2cl",
    srcs = ["super/com/google/protobuf/contrib/j2cl/integration/InternalChecks.java"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_checks",
        "//third_party/java/gwt:gwt-jsinterop-annotations-j2cl",
    ],
)

j2cl_multi_test(
    name = "BooleanFieldsTest",
    srcs = ["BooleanFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.BooleanFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "BuilderCloneTest",
    srcs = ["BuilderCloneTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.BuilderCloneTest",
)

j2cl_multi_test(
    name = "ByteStringFieldsTest",
    srcs = ["ByteStringFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.ByteStringFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "DoubleFieldsTest",
    srcs = ["DoubleFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.DoubleFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "EmptyPackageTest",
    srcs = ["EmptyPackageTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:empty_package"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.EmptyPackageTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "EnumFieldsTest",
    srcs = ["EnumFieldsTest.java"],
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enum_alias",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:native_enum",
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
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:sparse",
    ],
    test_class = "com.google.protobuf.contrib.j2cl.integration.EnumGenerationTest",
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations",
    ],
)

j2cl_multi_test(
    name = "ExtensionsTest",
    srcs = ["ExtensionsTest.java"],
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:native_enum",
    ],
    test_class = "com.google.protobuf.contrib.j2cl.integration.ExtensionsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "FloatFieldsTest",
    srcs = ["FloatFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.FloatFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "IntFieldsTest",
    srcs = ["IntFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.IntFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "LongFieldsTest",
    srcs = ["LongFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.LongFieldsTest",
)

j2cl_multi_test(
    name = "MessageEqualityTest",
    srcs = ["MessageEqualityTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MessageEqualityTest",
)

j2cl_multi_test(
    name = "MessageDefaultInstanceTest",
    srcs = ["MessageDefaultInstanceTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MessageDefaultInstanceTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "MessageFieldsTest",
    srcs = ["MessageFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MessageFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "OneOfsTest",
    srcs = ["OneOfsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.OneOfsTest",
)

j2cl_multi_test(
    name = "StringFieldsTest",
    srcs = ["StringFieldsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:accessor"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.StringFieldsTest",
    deps = [
        ":checks",
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
    deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor_j2cl_proto_new",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:ambiguous_fields_j2cl_proto_new",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions_j2cl_proto_new",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:native_enum_j2cl_proto_new",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs_j2cl_proto_new",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:sparse_j2cl_proto_new",
    ],
)

build_test(
    name = "conformance_test",
    targets = [
        ":conformance_binary",
    ],
)
