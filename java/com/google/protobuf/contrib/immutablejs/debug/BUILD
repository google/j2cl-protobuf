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
        "//third_party:closure_asserts",
        "//third_party:closure_math_long",
        "//third_party:closure_object",
    ],
)
