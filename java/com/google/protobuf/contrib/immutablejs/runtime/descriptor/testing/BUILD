load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(
    default_visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
    ],
)

licenses(["notice"])

closure_js_library(
    name = "descriptors",
    testonly = 1,
    srcs = ["descriptors.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_descriptor",
    ],
)
