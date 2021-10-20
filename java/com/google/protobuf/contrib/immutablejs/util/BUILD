load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(
    default_visibility = [
        "//java/com/google/protobuf/contrib/immutablejs:__subpackages__",
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
    ],
)

closure_js_library(
    name = "timestamp",
    srcs = ["timestamp_utils.js"],
    tags = ["alt_dep=//java/com/google/protobuf/contrib/immutablejs:timestamp"],
    deps = [
        "//third_party:closure_math_long",
        "//third_party:timestamp_immutable_js_proto",
    ],
)
