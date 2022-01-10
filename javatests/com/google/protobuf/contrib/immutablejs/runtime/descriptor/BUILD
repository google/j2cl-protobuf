load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")

licenses(["notice"])

proto_jsunit_test(
    name = "internal_constants_test",
    srcs = ["internal_constants_test.js"],
    # Don't bother running the tests compiled as we don't have any debug only checks that are
    # impacted by user-defined values.
    run_tests_compiled = 0,
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "internal_encoded_constants_test",
    srcs = ["internal_encoded_constants_test.js"],
    # Don't bother running the tests compiled as we don't have any debug only checks that are
    # impacted by user-defined values.
    run_tests_compiled = 0,
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_encoded_constants",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor/testing:descriptors",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "internal_descriptor_test",
    srcs = ["internal_descriptor_test.js"],
    # Don't bother running the tests compiled as we don't have any debug only checks that are
    # impacted by user-defined values.
    run_tests_compiled = 0,
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_constants",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor:internal_descriptor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime/descriptor/testing:descriptors",
        "//third_party:closure_testsuite",
    ],
)
