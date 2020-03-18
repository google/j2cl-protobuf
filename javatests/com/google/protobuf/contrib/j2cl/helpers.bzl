"""
Extracts a given zip file from a target.

This is needed since we can not name the output of a immutable_js_proto_library,
since the name depends on the content of the proto file.
"""

load("//java/com/google/protobuf/contrib/j2cl:j2cl_proto.bzl", j2cl_proto_library = "new_j2cl_proto_library")
load("//java/com/google/protobuf/contrib/immutablejs:immutable_js_proto_library.bzl", "immutable_js_proto_library")
load("@bazel_tools//tools/build_defs/build_test:build_test.bzl", "build_test")

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
        name = name + "_j2cl_proto_new",
        deps = [":" + name],
    )

    _flatten_jar(
        name = name,
        file = ":" + name + "_j2cl_proto_new_for_testing_do_not_use.srcjar",
    )

    j2cl_proto_library(
        name = name + "-multiple-files_j2cl_proto_new",
        deps = [":" + name + "_multiple_files"],
    )

    _flatten_jar(
        name = name + "-multiple-files",
        file = ":" + name + "-multiple-files_j2cl_proto_new_for_testing_do_not_use.srcjar",
    )

    j2cl_proto_library(
        name = name + "_indirect-j2cl-proto",
        deps = [":" + name + "_indirect"],
    )

    build_test(
        name = name + "_indrect-j2cl-proto_build_test",
        targets = [":" + name + "_indirect-j2cl-proto"],
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

def _flatten_jar(name, file):
    cmd = """
       mkdir -p tmp
       unzip -jq -d tmp $(SRCS)
       zip -jq $(OUTS) tmp/*.java
       rm -r tmp
    """

    native.genrule(
        name = name + "_extract",
        srcs = [file],
        outs = [name + ".zip"],
        cmd = cmd,
    )

def copy_source_jar(name):
    native.genrule(
        name = name + "_genrule",
        srcs = ["//javatests/com/google/protobuf/contrib/j2cl/protos:" + name],
        outs = [name],
        cmd = "cat $(SRCS) > $@",
    )
