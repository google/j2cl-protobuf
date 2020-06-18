# Public targets for j2cl proto

load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")

licenses(["notice"])  # Apache 2.0

j2cl_library(
    name = "runtime",
    visibility = [
        "//:__subpackages__",
        "//java/com/google/protobuf/contrib/gwt:__pkg__",
    ],
    exports = [
        "//java/com/google/protobuf/contrib/j2cl/runtime",
        "//java/com/google/protobuf/contrib/j2cl/runtime:jspb-utils",
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
