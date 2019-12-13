package(
    default_visibility = ["//visibility:private"],
)

java_library(
    name = "generator",
    srcs = glob(["*.java"]),
    resources = glob(["templates/*.vm"]),
    visibility = [
    ],
    deps = [
        "//net/proto2/compiler/proto:plugin_java_proto",
        "//net/proto2/proto:descriptor_java_proto",
        "//third_party/java/auto:auto_value",
        "//third_party/java/jakarta_velocity",
        "//third_party/java/jsr305_annotations",
    ],
)
