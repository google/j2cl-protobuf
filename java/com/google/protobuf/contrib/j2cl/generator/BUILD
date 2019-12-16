# Description:
# The J2CL protobuf generator.

package(default_visibility = [
])

licenses(["notice"])  # Apache 2.0

java_library(
    name = "generator",
    srcs = glob(["*.java"]),
    resources = glob(["templates/*.vm"]),
    deps = [
        "//net/proto2/compiler/proto:plugin_java_proto",
        "//third_party/java/auto:auto_value",
        "//third_party/java/jakarta_velocity",
        "//third_party/java/jsr305_annotations",
    ],
)
