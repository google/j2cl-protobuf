load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_library")

package(default_visibility = [
    "//java/com/google/protobuf/contrib/j2cl:__subpackages__",
    "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
])

licenses(["notice"])  # Apache 2.0

j2cl_library(
    name = "runtime",
    srcs = glob(
        ["super/com/google/protobuf/*.java"],
        exclude = [
            "super/com/google/protobuf/ExtensionRegistryLite.java",
            "super/com/google/protobuf/ExtensionRegistry.java",
        ],
    ),
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//third_party:gwt-jsinterop-annotations-j2cl",
        "//third_party:jsinterop-base-j2cl",
        "//third_party:jsr305_annotations-j2cl",
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
        "//third_party:gwt-jsinterop-annotations-j2cl",
        "//third_party:jsinterop-base-j2cl",
        "//third_party:jsr305_annotations-j2cl",
    ],
)
