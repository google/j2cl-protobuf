load(":helpers.bzl", "generate_protos")

package(default_visibility = [
    "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
])

licenses(["notice"])  # Apache 2.0

generate_protos(
    name = "accessor",
    proto_file = "accessor.proto",
)

generate_protos(
    name = "ambiguous_names",
    proto_file = "ambiguous_names.proto",
)

generate_protos(
    name = "conflicting_names",
    proto_file = "conflicting_names.proto",
)

generate_protos(
    name = "enums",
    proto_file = "enums.proto",
    deps = ["//java/com/google/protobuf/contrib/j2cl:options"],
)

generate_protos(
    name = "proto3_enums",
    proto_file = "proto3_enums.proto",
    deps = ["//java/com/google/protobuf/contrib/j2cl:options"],
)

generate_protos(
    name = "extensions",
    proto_file = "extensions.proto",
    deps = ["//java/com/google/protobuf/contrib/j2cl:options"],
)

generate_protos(
    name = "oneofs",
    proto_file = "oneofs.proto",
    deps = ["//java/com/google/protobuf/contrib/j2cl:options"],
)

generate_protos(
    name = "maps",
    proto_file = "maps.proto",
)

generate_protos(
    name = "proto3_oneofs",
    proto_file = "proto3_oneofs.proto",
    deps = ["//java/com/google/protobuf/contrib/j2cl:options"],
)

generate_protos(
    name = "empty_package",
    proto_file = "empty_package.proto",
)

generate_protos(
    name = "field_names",
    proto_file = "field_names.proto",
)

generate_protos(
    name = "proto3_optional",
    proto_file = "proto3_optional.proto",
)

generate_protos(
    name = "proto-with-dashes",
    proto_file = "proto-with-dashes.proto",
)
