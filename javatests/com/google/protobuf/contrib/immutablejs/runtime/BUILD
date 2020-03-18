load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")

licenses(["notice"])  # Apache 2.0

proto_jsunit_test(
    name = "bytestring_test",
    srcs = ["bytestring_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_checks",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
    ],
)

proto_jsunit_test(
    name = "equivalence_test",
    srcs = ["equivalence_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:defines",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:equivalence",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
    ],
)

proto_jsunit_test(
    name = "fieldaccessor_test",
    srcs = ["fieldaccessor_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:defines",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:fieldaccessor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:listview",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
    ],
)

proto_jsunit_test(
    name = "hashing_test",
    srcs = ["hashing_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:defines",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:hashing",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
    ],
)

proto_jsunit_test(
    name = "listview_test",
    srcs = ["listview_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:listview",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:message",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
    ],
)
