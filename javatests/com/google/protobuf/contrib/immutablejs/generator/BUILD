# Golden files tests

licenses(["notice"])  # Apache 2.0

java_library(
    name = "tests",
    testonly = 1,
    srcs = glob(["*.java"]),
    data = glob(["golden_files/**/*.txt"]) + [
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:ambiguous_fields_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:comments_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:empty_package_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:extensions_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:field_names_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:cycle_reference_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:oneofs_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:parent_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:pivot_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:proto-with-dashes_immutable_js_proto",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/testing:golden_files_base_test",
        "//third_party:guava",
        "//third_party:junit",
    ],
)

java_test(
    name = "GoldenFileTest",
    runtime_deps = [":tests"],
)
