package(
    default_visibility = [
        "//java/com/google/protobuf/contrib/j2cl:__subpackages__",
        "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
    ],
)

licenses(["notice"])

proto_library(
    name = "js_enum",
    srcs = ["js_enum.proto"],
    visibility = ["//visibility:public"],
    deps = ["//third_party:protobuf_descriptor"],
)

cc_proto_library(
    name = "js_enum_cc_proto",
    visibility = ["//visibility:public"],
    deps = [":js_enum"],
)

java_proto_library(
    name = "js_enum_java_proto",
    deps = [":js_enum"],
)
