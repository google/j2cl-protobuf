load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(
    default_visibility = [
        "//visibility:public",
    ],
)

licenses(["notice"])  # Apache 2.0

alias(
    name = "runtime",
    actual = "//java/com/google/protobuf/contrib/immutablejs/runtime",
)

closure_js_library(
    name = "debug",
    exports = ["//java/com/google/protobuf/contrib/immutablejs/debug"],
)
