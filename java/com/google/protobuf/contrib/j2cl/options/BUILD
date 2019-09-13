# Apache2
licenses(["notice"])

package(
    default_visibility = [
    ],
)

proto_library(
    name = "js_enum",
    srcs = ["js_enum.proto"],
    cc_api_version = 2,
    compatible_with = ["//buildenv/target:non_prod"],
    visibility = ["//visibility:public"],
    deps = ["//net/proto2/proto:descriptor"],
)

cc_proto_library(
    name = "js_enum_cc_proto",
    compatible_with = ["//buildenv/target:non_prod"],
    visibility = ["//visibility:public"],
    deps = [":js_enum"],
)

java_proto_library(
    name = "js_enum_java_proto",
    deps = [":js_enum"],
)

GwtProtoLibrary(
    name = "js_enum-gwt",
    srcs = ["js_enum.proto"],
    gwt_proto_deps = ["//net/proto2/proto/gwt:descriptor_gwt"],
    visibility = ["//visibility:public"],
    deps = [":js_enum_java_proto"],
)
