package(default_visibility = [
])

load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")

# Apache2
licenses(["notice"])

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

# Re-export the extension registry only in the interop case. In the nointeop case,
# it's built in already and would lead to redundant code.
j2cl_proto_selection(
    name = "extension_registry_stub",
    interop_target = ":extension_registry_stub_interop",
    nointerop_target = ":empty_target",
    # Having ExtensionRegistry(Lite) in J2CL does not make sense.
    # There is no easy way for us to list all extension and code using
    # this type should not exist on the web.
    # J2CL in general tries to part with GWT paradigm to just add mocks
    # for non function code to make things compile. We the j2cl team
    # believe that users rather want a compile error than surprising
    # behaviour at runtime.
    #
    # This target exists for migration purposes and we will accept
    # visibility changes here if you have a clear commitment to
    # moving off this target.
    # Please contact j2cl-team@
    visibility = [
        # TODO(b/130384402): Remove this
    ],
)

j2cl_library(
    name = "empty_target",
    srcs = [":dummy"],
)

genrule(
    name = "dummy",
    outs = ["package-info.java"],
    cmd = "echo \"package dummy;\" > $@",
)

# TODO(b/113125975): Remove this
j2cl_library(
    name = "extension_registry_stub_interop",
    srcs = [
        "super/com/google/protobuf/ExtensionRegistry.java",
        "super/com/google/protobuf/ExtensionRegistryLite.java",
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
