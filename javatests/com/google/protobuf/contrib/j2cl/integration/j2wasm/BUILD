load("@com_google_j2cl//build_defs:rules.bzl", "j2wasm_application", "j2wasm_library")
load("@bazel_skylib//rules:build_test.bzl", "build_test")

licenses(["notice"])

j2wasm_library(
    name = "j2wasm_with_proto_lib",
    srcs = glob(["*.java"]),
    deps = [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:ambiguous_names_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:empty_package_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enums_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:field_names_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:maps_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto-with-dashes_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_accessors_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_enums_j2cl_proto",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_oneofs_j2cl_proto",
    ],
)

j2wasm_application(
    name = "j2wasm_with_proto_application",
    entry_points = ["com.google.protobuf.contrib.j2cl.integration.j2wasm.Main.testMain"],
    deps = ["j2wasm_with_proto_lib"],
)

build_test(
    name = "j2wasm_build",
    targets = [":j2wasm_with_proto_application"],
)
