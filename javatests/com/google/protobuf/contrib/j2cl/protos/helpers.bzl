"""
Extracts a given zip file from a target.

This is needed since we can not name the output of a immutable_js_proto_library,
since the name depends on the content of the proto file.
"""

load("//java/com/google/protobuf/contrib/j2cl:j2cl_proto.bzl", j2cl_proto_library = "new_j2cl_proto_library")
load("//java/com/google/protobuf/contrib/immutablejs:immutable_js_proto_library.bzl", "immutable_js_proto_library")
load("@bazel_skylib//rules:build_test.bzl", "build_test")

def generate_protos(name, proto_file, deps = []):
    native.proto_library(
        name = name,
        srcs = [proto_file],
        deps = deps,
    )

    _generate_multifile_proto(original_proto_name = name)

    native.proto_library(
        name = name + "_multiple_files",
        srcs = [name + ".multiple_files.proto"],
        deps = deps,
    )

    native.proto_library(
        name = name + "_indirect",
        deps = [":" + name],
    )

    immutable_js_proto_library(
        name = name + "_immutable_js_proto",
        deps = [":" + name],
    )

    native.java_proto_library(
        name = name + "_java_proto",
        deps = [":" + name],
    )

    j2cl_proto_library(
        name = name + "_j2cl_proto",
        deps = [":" + name],
    )

    native.filegroup(
        name = name + "_out",
        srcs = [":" + name + "_j2cl_proto"],
        output_group = "for_testing_do_not_use",
    )

    j2cl_proto_library(
        name = name + "-multiple-files_j2cl_proto",
        deps = [":" + name + "_multiple_files"],
    )

    native.filegroup(
        name = name + "-multiple-files_out",
        srcs = [":" + name + "-multiple-files_j2cl_proto"],
        output_group = "for_testing_do_not_use",
    )

    j2cl_proto_library(
        name = name + "_indirect-j2cl_proto",
        deps = [":" + name + "_indirect"],
    )

    build_test(
        name = name + "_indrect-j2cl_proto_build_test",
        targets = [":" + name + "_indirect-j2cl_proto"],
    )

def _generate_multifile_proto(original_proto_name):
    """Uncomments lines that start with //REMOVED_BY_GENRULE"""
    native.genrule(
        name = original_proto_name + ".multiple_files.proto_genrule",
        srcs = [original_proto_name + ".proto"],
        outs = [original_proto_name + ".multiple_files.proto"],
        cmd = "\n".join([
            "cat $(SRCS) |",
            "sed -e 's/\\/\\/\\ REMOVED_BY_GENRULE\\ //g' $(SRCS) > $@",
        ]),
    )
