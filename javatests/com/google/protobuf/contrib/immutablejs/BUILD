exports_files(["check_runfiles.sh"])

sh_test(
    name = "check_runfiles",
    srcs = ["check_runfiles.sh"],
    args = [
        "java/com/google/apps/jspb/jspb_proto-improto",
        "javatests/com/google/protobuf/contrib/immutablejs/protos/accessors-improto",
    ],
    deps = ["//util/shell/gbash"],
)
