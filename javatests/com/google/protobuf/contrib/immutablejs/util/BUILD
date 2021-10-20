load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")

licenses(["notice"])

proto_jsunit_test(
    name = "timestamp_test",
    srcs = ["timestamp_utils_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/util:timestamp",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
        "//third_party:closure_math_long",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
        "//third_party:timestamp_immutable_js_proto",
    ],
)
