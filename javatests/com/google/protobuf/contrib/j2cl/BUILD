licenses(["notice"])  # Apache 2.0

sh_test(
    name = "check_runfiles",
    srcs = ["//javatests/com/google/protobuf/contrib/immutablejs:check_runfiles.sh"],
    args = [
        "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options-improto",
        "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options-j2cl.js.zip",
        "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enum_alias-improto",
        "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enum_alias-j2cl.js.zip",
    ],
    data = ["//javatests/com/google/protobuf/contrib/j2cl/protos:enum_alias_j2cl_proto_new"],
    deps = ["//util/shell/gbash"],
)
