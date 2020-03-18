load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")

licenses(["notice"])  # Apache 2.0

proto_jsunit_test(
    name = "dump_test",
    srcs = ["dump_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:debug",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
    ],
)
