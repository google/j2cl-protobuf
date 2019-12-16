# Integration tests for immutable protos

licenses(["notice"])  # Apache 2.0

goog_module_proto_jspb_data(
    name = "accessor_data",
    src = "accessor_data.txt",
    goog_module = "testdata.Accessor1",
    proto_name = "protobuf.contrib.immutablejs.protos.TestProto",
)

proto_jsunit_test(
    name = "accessor_test",
    srcs = [
        "accessor_test.js",
    ],
    deps = [
        ":accessor_data",
    ],
)

proto_jsunit_test(
    name = "apps_jspb_interop_test",
    srcs = [
        "apps_jspb_interop_test.js",
    ],
    deps = [
        ":accessor_data",
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
    ],
)

proto_jsunit_test(
    name = "boolean_fields_test",
    srcs = [
        "boolean_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "builder_test",
    srcs = [
        "builder_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "bytestring_fields_test",
    srcs = [
        "bytestring_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "double_fields_test",
    srcs = [
        "double_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "enum_fields_test",
    srcs = [
        "enum_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "float_fields_test",
    srcs = [
        "float_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "int_fields_test",
    srcs = [
        "int_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "int52long_fields_test",
    srcs = [
        "int52long_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "long_fields_test",
    srcs = [
        "long_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "message_fields_test",
    srcs = [
        "message_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "message_default_instance_test",
    srcs = [
        "message_default_instance_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "message_equality_test",
    srcs = [
        "message_equality_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "message_id_test",
    srcs = [
        "message_id_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "oneof_test",
    srcs = [
        "oneof_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "string_fields_test",
    srcs = [
        "string_fields_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "tobuilder_test",
    srcs = [
        "tobuilder_test.js",
    ],
    deps = [
    ],
)

goog_module_proto_jspb_data(
    name = "extensions_data",
    src = "extensions_data.txt",
    goog_module = "testdata.Extensions1",
    proto_name = "protobuf.contrib.immutablejs.protos.Base",
)

proto_jsunit_test(
    name = "extensions_test",
    srcs = [
        "extensions_test.js",
    ],
    deps = [
        ":extensions_data",
    ],
)

proto_jsunit_test(
    name = "cycle_reference_test",
    srcs = [
        "cycle_reference_test.js",
    ],
    deps = [
    ],
)

proto_jsunit_test(
    name = "pivot_test",
    srcs = [
        "pivot_test.js",
    ],
    deps = [
    ],
)
