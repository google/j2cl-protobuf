licenses(["notice"])  # Apache 2.0

sh_test(
    name = "check_runfiles",
    srcs = ["//javatests/com/google/protobuf/contrib/immutablejs:check_runfiles.sh"],
    # TODO(b/172518926): Remove zip branch once the switch to tree artifacts is complete.
    args = [
        "java/com/google/protobuf/contrib/j2cl/options-improto",
        "java/com/google/protobuf/contrib/j2cl/options-j2cl.js",
        "javatests/com/google/protobuf/contrib/j2cl/protos/enums-improto",
        "javatests/com/google/protobuf/contrib/j2cl/protos/enums-j2cl.js",
    ],
    data = ["//javatests/com/google/protobuf/contrib/j2cl/protos:enums_j2cl_proto"],
    deps = ["//util/shell/gbash"],
)
