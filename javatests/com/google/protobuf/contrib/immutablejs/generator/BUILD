# Golden files tests
load("//devtools/python/blaze:pytype.bzl", "pytype_binary")

java_library(
    name = "tests",
    testonly = 1,
    srcs = glob(["*.java"]),
    data = glob(["golden_files/**/*.txt"]) + [
    ],
    deps = [
        "//third_party/java/junit",
    ],
)

java_test(
    name = "GoldenFileTest",
    runtime_deps = [":tests"],
)

pytype_binary(
    name = "update_golden_files",
    srcs = ["update_golden_files.py"],
    python_version = "PY2",
    deps = ["//third_party/py/absl:app"],
)
