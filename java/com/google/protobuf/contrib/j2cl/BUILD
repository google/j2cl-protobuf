# Public targets for j2cl proto

load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")

licenses(["notice"])  # Apache 2.0

j2cl_library(
    name = "runtime",
    visibility = [
        "//:__subpackages__",
    ],
    exports = [
    ],
)

proto_library(
    name = "options",
    srcs = ["options.proto"],
    cc_api_version = 2,
    compatible_with = ["//buildenv/target:non_prod"],
    visibility = ["//visibility:public"],
    deps = ["//net/proto2/proto:descriptor"],
)

java_proto_library(
    name = "options_java_proto",
    visibility = ["//visibility:public"],
    deps = [":options"],
)

bzl_library(
    name = "j2cl_proto_provider_bzl",
    srcs = ["j2cl_proto_provider.bzl"],
    visibility = ["//visibility:public"],
)
