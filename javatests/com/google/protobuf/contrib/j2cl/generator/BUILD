licenses(["notice"])  # Apache 2.0

# To update the golden files, run the following in your client:
#
# >>> python javatests/com/google/protobuf/contrib/update_golden_files.py
java_test(
    name = "GoldenFileTest",
    srcs = [
        "GoldenFileTest.java",
    ],
    data = glob(["golden_files/**/*.txt"]) + [
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:accessor-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:ambiguous_names_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:conflicting_names_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:conflicting_names-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:empty_package_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:empty_package-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enums_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:enums-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:extensions-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:field_names_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:maps_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:oneofs-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto-with-dashes_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto-with-dashes-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_enums_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:ignored_fields_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_enums-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_oneofs_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_oneofs-multiple-files_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_optional_out",
        "//javatests/com/google/protobuf/contrib/j2cl/protos:proto3_optional-multiple-files_out",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/testing:golden_files_base_test",
        "//java/com/google/testing/testsize:annotations",
    ],
)
