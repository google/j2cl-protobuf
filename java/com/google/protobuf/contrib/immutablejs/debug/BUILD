load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(
    default_visibility = [
        "//java/com/google/protobuf/contrib/immutablejs:__subpackages__",
    ],
)

licenses(["notice"])  # Apache 2.0

closure_js_library(
    name = "debug",
    srcs = ["debug.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/asserts",
        "//javascript/closure/math:long",
        "//javascript/closure/object",
    ],
)
