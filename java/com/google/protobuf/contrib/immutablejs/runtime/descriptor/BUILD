load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(
    default_visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
    ],
)

licenses(["notice"])

closure_js_library(
    name = "descriptor",
    srcs = ["descriptor.js"],
)

closure_js_library(
    name = "internal_constants",
    srcs = ["internal_constants.js"],
)

closure_js_library(
    name = "internal_encoded_constants",
    srcs = ["internal_encoded_constants.js"],
)

closure_js_library(
    name = "internal_descriptor",
    srcs = ["internal_descriptor.js"],
    deps = [
        ":descriptor",
        ":internal_constants",
        ":internal_encoded_constants",
        "//third_party:closure_functions",
    ],
)
