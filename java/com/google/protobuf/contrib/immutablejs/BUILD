load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@bazel_skylib//:bzl_library.bzl", "bzl_library")

package(
    default_visibility = [
        "//visibility:public",
    ],
)

licenses(["notice"])  # Apache 2.0

bzl_library(
    name = "immutable_js_bzl",
    srcs = ["immutable_js_proto_library.bzl"],
    deps = [
        "@bazel_skylib//lib:dicts",
        "@bazel_tools//tools/build_defs/js:checkable_provider",
        "@bazel_tools//tools/build_defs/js_toolchain",
    ],
)

closure_js_library(
    name = "runtime",
    exports = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:listview",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:message",
    ],
)

closure_js_library(
    name = "debug",
    exports = ["//java/com/google/protobuf/contrib/immutablejs/debug"],
)
