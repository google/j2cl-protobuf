licenses(["notice"])  # Apache 2.0

sh_test(
    name = "check_runfiles",
    args = [
        "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options/js_enum-improto",
        "third_party/java_src/j2cl_proto/java/com/google/protobuf/contrib/j2cl/options/js_enum-j2cl.js.zip",
        "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enum_alias-improto",
        "third_party/java_src/j2cl_proto/javatests/com/google/protobuf/contrib/j2cl/protos/enum_alias-j2cl.js.zip",
    ],
    deps = ["//util/shell/gbash"],
)
