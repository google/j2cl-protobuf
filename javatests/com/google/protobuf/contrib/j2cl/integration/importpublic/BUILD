# Tests that j2cl_proto_library aspects on the exports attribute of proto_library rule.
#
# Since proto_library already has strict deps checking, it's important that the rule that
# exports the library also has an "import public" statement for it. That will satisify
# strict deps but still make downstream targets dependent upon the exports.
# See: b/135560656

load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")
load("@bazel_skylib//rules:build_test.bzl", "build_test")
load("//java/com/google/protobuf/contrib/gwt:j2cl_proto.bzl", "j2cl_proto_library")

licenses(["notice"])

proto_library(
    name = "foo",
    srcs = ["foo.proto"],
    deps = [":intermediate"],
)

j2cl_proto_library(
    name = "foo_j2cl_proto",
    deps = [":foo"],
)

proto_library(
    name = "intermediate",
    srcs = ["intermediate.proto"],
    exports = [":bar"],
    deps = [":bar"],
)

proto_library(
    name = "bar",
    srcs = ["bar.proto"],
)

j2cl_library(
    name = "main",
    srcs = ["Main.java"],
    deps = [":foo_j2cl_proto"],
)

build_test(
    name = "test",
    targets = [
        ":main",
    ],
)
