load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_library", "j2wasm_library")

package(default_visibility = [
    "//java/com/google/protobuf/contrib/j2cl:__subpackages__",
    "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
])

licenses(["notice"])

j2wasm_library(
    name = "runtime-j2wasm",
    srcs = glob(["super-wasm/com/google/protobuf/*.java"]),
)

j2cl_library(
    name = "runtime",
    srcs = glob(["super/com/google/protobuf/*.java"]),
    exports = [":minidescriptor"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "@com_google_j2cl//:jsinterop-annotations-j2cl",
        "@com_google_jsinterop_base//:jsinterop-base-j2cl",
    ],
)

j2cl_library(
    name = "jspb-utils",
    srcs = [
        "JspbParseException.java",
        "JspbUtils.java",
    ],
    deps = [
        ":runtime",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//third_party:jsr305_annotations-j2cl",
        "@com_google_j2cl//:jsinterop-annotations-j2cl",
        "@com_google_jsinterop_base//:jsinterop-base-j2cl",
    ],
)

j2cl_library(
    name = "minidescriptor",
    srcs = ["MiniDescriptor.java"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor",
        "@com_google_j2cl//:jsinterop-annotations-j2cl",
    ],
)
