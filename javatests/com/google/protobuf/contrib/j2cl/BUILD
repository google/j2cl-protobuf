licenses(["notice"])  # Apache 2.0

config_setting(
    name = "tree_artifacts_enabled",
    define_values = {
        "J2CL_TREE_ARTIFACTS": "1",
    },
)

sh_test(
    name = "check_runfiles",
    srcs = ["//javatests/com/google/protobuf/contrib/immutablejs:check_runfiles.sh"],
    # TODO(b/172518926): Remove zip branch once the switch to tree artifacts is complete.
    args = select({
        ":tree_artifacts_enabled": [
            "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options-improto",
            "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options-j2cl",
            "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enums-improto",
            "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enums-j2cl",
        ],
        "//conditions:default": [
            "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options-improto",
            "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options-j2cl.js.zip",
            "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enums-improto",
            "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enums-j2cl.js.zip",
        ],
    }),
    data = ["//javatests/com/google/protobuf/contrib/j2cl/protos:enums_j2cl_proto"],
    deps = ["//util/shell/gbash"],
)
