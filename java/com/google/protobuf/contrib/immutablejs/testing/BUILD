package(
    default_visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
        "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
    ],
)

licenses(["notice"])

java_library(
    name = "golden_files_base_test",
    testonly = 1,
    srcs = glob(["*.java"]),
    deps = [
        "//third_party:auto_value",
        "//third_party:guava",
        "//third_party:junit",
        "//third_party:runfiles",
    ],
)
