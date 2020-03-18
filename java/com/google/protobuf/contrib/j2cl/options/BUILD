load("@bazel_tools//tools/build_defs/proto/cpp:cc_proto_library.bzl", "cc_proto_library")
load("//java/com/google/protobuf/contrib/gwt:GwtProtoLibrary.bzl", "GwtProtoLibrary")

package(
    default_visibility = [
        "//java/com/google/protobuf/contrib/gwt:__subpackages__",
        "//java/com/google/protobuf/contrib/j2cl:__subpackages__",
        "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
    ],
)

licenses(["notice"])  # Apache 2.0

proto_library(
    name = "js_enum",
    srcs = ["js_enum.proto"],
    cc_api_version = 2,
    compatible_with = ["//buildenv/target:non_prod"],
    visibility = ["//visibility:public"],
    deps = ["//net/proto2/proto:descriptor"],
)

cc_proto_library(
    name = "js_enum_cc_proto",
    compatible_with = ["//buildenv/target:non_prod"],
    visibility = ["//visibility:public"],
    deps = [":js_enum"],
)

java_proto_library(
    name = "js_enum_java_proto",
    deps = [":js_enum"],
)

GwtProtoLibrary(
    name = "js_enum-gwt",
    srcs = ["js_enum.proto"],
    gwt_proto_deps = ["//net/proto2/proto/gwt:descriptor_gwt"],
    visibility = ["//visibility:public"],
    deps = [":js_enum_java_proto"],
)
