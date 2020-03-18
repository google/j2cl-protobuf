# Integration tests for immutable protos
load("//javatests/com/google/protobuf/contrib/immutablejs/build_def:proto_test.bzl", "proto_jsunit_test")
load("//javatests/com/google/protobuf/contrib/immutablejs/integration/serializer:text_to_jspb.bzl", "goog_module_proto_jspb_data")

licenses(["notice"])  # Apache 2.0

goog_module_proto_jspb_data(
    name = "accessor_data",
    src = "accessor_data.txt",
    goog_module = "testdata.Accessor1",
    proto_deps = ["//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors"],
    proto_name = "protobuf.contrib.immutablejs.protos.TestProto",
)

proto_jsunit_test(
    name = "accessor_test",
    srcs = [
        "accessor_test.js",
    ],
    deps = [
        ":accessor_data",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "apps_jspb_interop_test",
    srcs = [
        "apps_jspb_interop_test.js",
    ],
    deps = [
        ":accessor_data",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_jspb_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

# This test simply reruns accessor_test with an indirect proto reference.
# This makes sure that we do not get a strict deps violation and that
# exporting of srcless proto libraries is working fine.
proto_jsunit_test(
    name = "indirection_test",
    srcs = [
        "accessor_test.js",
    ],
    deps = [
        ":accessor_data",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_indirection_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "boolean_fields_test",
    srcs = [
        "boolean_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "builder_test",
    srcs = [
        "builder_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "bytestring_fields_test",
    srcs = [
        "bytestring_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "double_fields_test",
    srcs = [
        "double_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "enum_fields_test",
    srcs = [
        "enum_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "float_fields_test",
    srcs = [
        "float_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "int_fields_test",
    srcs = [
        "int_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "int52long_fields_test",
    srcs = [
        "int52long_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "long_fields_test",
    srcs = [
        "long_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "message_fields_test",
    srcs = [
        "message_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "message_default_instance_test",
    srcs = [
        "message_default_instance_test.js",
    ],
    deps = [
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:equals_immutable_js_proto",
    ],
)

proto_jsunit_test(
    name = "message_equality_test",
    srcs = [
        "message_equality_test.js",
    ],
    deps = [
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:equals_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "message_id_test",
    srcs = [
        "message_id_test.js",
    ],
    deps = [
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:message_id_immutable_js_proto",
    ],
)

proto_jsunit_test(
    name = "oneof_test",
    srcs = [
        "oneof_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:oneofs_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "string_fields_test",
    srcs = [
        "string_fields_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "tobuilder_test",
    srcs = [
        "tobuilder_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:accessors_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:extensions_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

goog_module_proto_jspb_data(
    name = "extensions_data",
    src = "extensions_data.txt",
    goog_module = "testdata.Extensions1",
    proto_deps = ["//javatests/com/google/protobuf/contrib/immutablejs/protos:extensions"],
    proto_name = "protobuf.contrib.immutablejs.protos.Base",
)

proto_jsunit_test(
    name = "extensions_test",
    srcs = [
        "extensions_test.js",
    ],
    deps = [
        ":extensions_data",
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:extensions_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "cycle_reference_test",
    srcs = [
        "cycle_reference_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:cycle_reference_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)

proto_jsunit_test(
    name = "pivot_test",
    srcs = [
        "pivot_test.js",
    ],
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs:runtime",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
        "//javascript/closure/testing:asserts",
        "//javascript/closure/testing:testsuite",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:pivot_immutable_js_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/protos:pivot_jspb_proto",
        "//javatests/com/google/protobuf/contrib/immutablejs/testing:proto_asserts",
    ],
)
