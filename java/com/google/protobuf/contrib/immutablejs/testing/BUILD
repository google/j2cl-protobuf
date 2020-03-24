package(
    default_visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
        "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
    ],
)

licenses(["notice"])  # Apache 2.0

java_library(
    name = "golden_files_base_test",
    testonly = 1,
    srcs = ["GoldenFilesBaseTest.java"],
    deps = [
        "//java/com/google/testing/util",
        "//third_party:auto_value",
        "//third_party:guava",
        "//third_party:junit",
        "//third_party:runfiles",
    ],
)
