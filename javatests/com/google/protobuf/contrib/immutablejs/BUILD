licenses(["notice"])

exports_files(["check_runfiles.sh"])

sh_test(
    name = "check_runfiles",
    srcs = ["check_runfiles.sh"],
    args = [
        "java/com/google/apps/jspb/jspb_proto-improto",
        "javatests/com/google/protobuf/contrib/immutablejs/protos/accessors-improto",
    ],
    data = ["//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto"],
    deps = ["//util/shell/gbash"],
)
