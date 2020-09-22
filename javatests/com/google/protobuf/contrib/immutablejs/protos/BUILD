load("//java/com/google/protobuf/contrib/immutablejs:immutable_js_proto_library.bzl", "immutable_js_proto_library")

# Contains protos that are needed for testing.
package(
    default_visibility = [
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
    ],
)

licenses(["notice"])  # Apache 2.0

proto_library(
    name = "accessors",
    srcs = ["accessors.proto"],
)

immutable_js_proto_library(
    name = "accessors_immutable_js_proto",
    deps = [":accessors"],
)

proto_library(
    name = "accessors_indirection",
    deps = [":accessors"],
)

immutable_js_proto_library(
    name = "accessors_indirection_immutable_js_proto",
    deps = [":accessors_indirection"],
)

proto_library(
    name = "ambiguous_fields",
    srcs = ["ambiguous_fields.proto"],
)

immutable_js_proto_library(
    name = "ambiguous_fields_immutable_js_proto",
    deps = [":ambiguous_fields"],
)

proto_library(
    name = "comments",
    srcs = ["comments.proto"],
)

immutable_js_proto_library(
    name = "comments_immutable_js_proto",
    deps = [":comments"],
)

proto_library(
    name = "deprecated",
    srcs = ["deprecated.proto"],
)

immutable_js_proto_library(
    name = "deprecated_immutable_js_proto",
    deps = [":deprecated"],
)

proto_library(
    name = "empty_package",
    srcs = ["empty_package.proto"],
)

immutable_js_proto_library(
    name = "empty_package_immutable_js_proto",
    deps = [":empty_package"],
)

proto_library(
    name = "extensions",
    srcs = ["extensions.proto"],
)

immutable_js_proto_library(
    name = "extensions_immutable_js_proto",
    deps = [":extensions"],
)

proto_library(
    name = "cycle_reference",
    srcs = ["cycle_reference.proto"],
)

immutable_js_proto_library(
    name = "cycle_reference_immutable_js_proto",
    deps = [":cycle_reference"],
)

proto_library(
    name = "equals",
    srcs = ["equals.proto"],
)

immutable_js_proto_library(
    name = "equals_immutable_js_proto",
    deps = [":equals"],
)

proto_library(
    name = "field_names",
    srcs = ["field_names.proto"],
)

immutable_js_proto_library(
    name = "field_names_immutable_js_proto",
    deps = [":field_names"],
)

# This ensures that imports and dependencies work properly
proto_library(
    name = "leaf",
    srcs = ["leaf.proto"],
)

proto_library(
    name = "parent",
    srcs = ["parent.proto"],
    deps = [":leaf"],
)

immutable_js_proto_library(
    name = "parent_immutable_js_proto",
    deps = [":parent"],
)

proto_library(
    name = "oneofs",
    srcs = ["oneofs.proto"],
)

immutable_js_proto_library(
    name = "oneofs_immutable_js_proto",
    deps = [":oneofs"],
)

proto_library(
    name = "pivot",
    srcs = ["pivot.proto"],
)

immutable_js_proto_library(
    name = "pivot_immutable_js_proto",
    deps = [":pivot"],
)

proto_library(
    name = "proto-with-dashes",
    srcs = ["proto-with-dashes.proto"],
)

immutable_js_proto_library(
    name = "proto-with-dashes_immutable_js_proto",
    deps = [":proto-with-dashes"],
)
