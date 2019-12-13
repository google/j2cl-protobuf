load("//devtools/python/blaze:pytype.bzl", "pytype_binary")

pytype_binary(
    name = "update_golden_files",
    srcs = ["update_golden_files.py"],
    python_version = "PY2",
    deps = ["//third_party/py/absl:app"],
)

# Golden file tests need zip files to reside in the same directory as the test
copy_source_jar(name = "accessor.zip")

copy_source_jar(name = "accessor-multiple-files.zip")

copy_source_jar(name = "ambiguous_fields.zip")

copy_source_jar(name = "enum_alias.zip")

copy_source_jar(name = "enum_alias-multiple-files.zip")

copy_source_jar(name = "extensions.zip")

copy_source_jar(name = "extensions-multiple-files.zip")

copy_source_jar(name = "field_names.zip")

copy_source_jar(name = "native_enum.zip")

copy_source_jar(name = "native_enum-multiple-files.zip")

copy_source_jar(name = "oneofs.zip")

copy_source_jar(name = "oneofs-multiple-files.zip")

copy_source_jar(name = "proto-with-dashes.zip")

copy_source_jar(name = "proto-with-dashes-multiple-files.zip")

copy_source_jar(name = "sparse.zip")

copy_source_jar(name = "sparse-multiple-files.zip")

java_test(
    name = "GoldenFileTest",
    srcs = [
        "GoldenFileTest.java",
    ],
    data = glob(["golden_files/**/*.txt"]) + [
        ":accessor.zip",
        ":accessor-multiple-files.zip",
        ":ambiguous_fields.zip",
        ":enum_alias.zip",
        ":enum_alias-multiple-files.zip",
        ":extensions.zip",
        ":extensions-multiple-files.zip",
        ":field_names.zip",
        ":native_enum.zip",
        ":native_enum-multiple-files.zip",
        ":oneofs.zip",
        ":oneofs-multiple-files.zip",
        ":proto-with-dashes.zip",
        ":proto-with-dashes-multiple-files.zip",
        ":sparse.zip",
        ":sparse-multiple-files.zip",
    ],
    deps = [
        "//third_party/java/junit",
    ],
)
