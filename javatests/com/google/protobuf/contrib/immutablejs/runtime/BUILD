load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")

licenses(["notice"])  # Apache 2.0

proto_jsunit_test(
    name = "bytestring_test",
    srcs = ["bytestring_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_checks",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
        "//third_party:closure_crypt_base64",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "equivalence_test",
    srcs = ["equivalence_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:defines",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:equivalence",
        "//third_party:closure_math_long",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "fieldaccessor_test",
    srcs = ["fieldaccessor_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:defines",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:fieldaccessor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_checks",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:listview",
        "//third_party:closure_math_long",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "hashing_test",
    srcs = ["hashing_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:defines",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:hashing",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "internal_list_test",
    srcs = ["internal_list_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:fieldaccessor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_checks",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_list",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "internal_map_test",
    srcs = ["internal_map_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:fieldaccessor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_map",
        "//third_party:closure_math_long",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "listview_test",
    srcs = ["listview_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:listview",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:message",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)

proto_jsunit_test(
    name = "mapview_test",
    srcs = ["mapview_test.js"],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:mapview",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:message",
        "//third_party:closure_math_long",
        "//third_party:closure_testing_asserts",
        "//third_party:closure_testsuite",
    ],
)
