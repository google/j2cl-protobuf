load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("//javascript/tools/jscompiler/builddefs:flags.bzl", "VERBOSE_WARNING_FLAGS_STRICT")
load("//javatests/com/google/protobuf/contrib/j2cl/integration:j2cl_multi_test.bzl", "j2cl_multi_test")
load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")
load("@com_google_j2cl//build_defs:rules.bzl", "J2CL_OPTIMIZED_DEFS")
load("@bazel_skylib//rules:build_test.bzl", "build_test")

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
    name = "ConflictingNamesTest",
    srcs = ["ConflictingNamesTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:conflicting_names"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.ConflictingNamesTest",
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
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enums",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_enums",
    ],
    test_class = "com.google.protobuf.contrib.j2cl.integration.EnumFieldsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "EnumNativeForNumberTest",
    srcs = ["EnumNativeForNumberTest.java"],
    generate_java_test = False,
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enums",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_enums",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_oneofs",
    ],
    test_class = "com.google.protobuf.contrib.j2cl.integration.EnumNativeForNumberTest",
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations",
    ],
)

j2cl_multi_test(
    name = "EnumParseTest",
    srcs = ["EnumParseTest.java"],
    generate_java_test = False,
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enums",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_enums",
    ],
    test_class = "com.google.protobuf.contrib.j2cl.integration.EnumParseTest",
    deps = [
        "//third_party/java/gwt:gwt-jsinterop-annotations",
    ],
)

j2cl_multi_test(
    name = "ExtensionsTest",
    srcs = ["ExtensionsTest.java"],
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions",
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
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:conflicting_names",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_optional",
    ],
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
    deps = [
        ":checks",
    ],
)

genrule(
    name = "maps_all_variants_test_gen",
    outs = ["MapsAllVariantsTest.java"],
    cmd = "$(location //javatests/com/google/protobuf/contrib/j2cl/integration/generator:MapsAllVariantsTestGenerator) -output $@",
    tools = ["//javatests/com/google/protobuf/contrib/j2cl/integration/generator:MapsAllVariantsTestGenerator"],
)

j2cl_multi_test(
    name = "MapsAllVariantsTest",
    srcs = ["MapsAllVariantsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:maps"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MapsAllVariantsTest",
    deps = [
        ":checks",
    ],
)

j2cl_multi_test(
    name = "MapsTest",
    srcs = ["MapsTest.java"],
    proto_deps = ["//javatests/com/google/protobuf/contrib/j2cl/protos:maps"],
    test_class = "com.google.protobuf.contrib.j2cl.integration.MapsTest",
    deps = [
        ":checks",
    ],
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
    proto_deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_oneofs",
    ],
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
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:ambiguous_names_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:conflicting_names_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:empty_package_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enums_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:field_names_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto-with-dashes_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_enums_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_oneofs_j2cl_proto",
    ],
)

build_test(
    name = "conformance_test",
    targets = [
        ":conformance_binary",
    ],
)
