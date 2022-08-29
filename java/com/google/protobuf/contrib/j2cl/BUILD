# Public targets for j2cl proto

load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_library", "j2wasm_library")

licenses(["notice"])

j2wasm_library(
    name = "runtime-j2wasm",
    visibility = [
        "//:__subpackages__",
        "//java/com/google/protobuf/contrib/gwt:__pkg__",
    ],
    exports = [
        "//java/com/google/protobuf/contrib/j2cl/runtime:runtime-j2wasm",
    ],
)

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
    visibility = ["//visibility:public"],
    deps = ["//third_party:protobuf_descriptor"],
)

java_proto_library(
    name = "options_java_proto",
    visibility = ["//visibility:public"],
    deps = [":options"],
)
