load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")

package(default_visibility = [
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
        "//third_party/java/gwt:gwt-jsinterop-annotations-j2cl",
        "//third_party/java/jsinterop:jsinterop-base-j2cl",
        "//third_party/java/jsr305_annotations:jsr305_annotations-j2cl",
    ],
)
