load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(
    default_visibility = [
        "//visibility:public",
    ],
)

# Apache2
licenses(["notice"])

bzl_library(
    name = "immutable_js_bzl",
    srcs = ["immutable_js_proto_library.bzl"],
)

closure_js_library(
    name = "runtime",
    exports = [
    ],
)

closure_js_library(
    name = "debug",
)

# bazel_osx_p4deps specifies that set of dependencies needed to run Bazel on OS X.
# Consumed by "blazel" (bazel for Google3) tests.
filegroup(
    name = "bazel_osx_p4deps",
    testonly = 1,
    srcs = glob(["**"]),
)
