licenses(["notice"])  # Apache 2.0

java_test(
    name = "GoldenFileTest",
    srcs = [
        "GoldenFileTest.java",
    ],
    data = glob(["golden_files/**/*.txt"]) + [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:ambiguous_fields_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enum_alias_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enum_alias-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:field_names_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:native_enum_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:native_enum-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto-with-dashes_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto-with-dashes-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:sparse_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:sparse-multiple-files_out",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/testing:golden_files_base_test",
        "//java/com/google/testing/testsize:annotations",
    ],
)
