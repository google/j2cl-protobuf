load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")

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
        "//third_party/java/gwt:gwt-jsinterop-annotations-j2cl",
        "//third_party/java/jsinterop:jsinterop-base-j2cl",
        "//third_party/java/jsr305_annotations:jsr305_annotations-j2cl",
    ],
)

# TODO(b/113125975): Remove this
j2cl_library(
    name = "extension_registry_stub_interop",
    srcs = [
        "super/com/google/protobuf/ExtensionRegistry.java",
        "super/com/google/protobuf/ExtensionRegistryLite.java",
    ],
    visibility = [
        "//java/com/google/protobuf/contrib/gwt:__pkg__",
    ],
    deps = [":runtime"],
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
        "//third_party/java/gwt:gwt-jsinterop-annotations-j2cl",
        "//third_party/java/jsinterop:jsinterop-base-j2cl",
        "//third_party/java/jsr305_annotations:jsr305_annotations-j2cl",
    ],
)
