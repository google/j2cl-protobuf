# Description:
# The J2CL protobuf generator.

package(default_visibility = [
    "//java/com/google/protobuf/contrib/j2cl:__subpackages__",
    "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
])

licenses(["notice"])  # Apache 2.0

java_library(
    name = "generator",
    srcs = glob(["*.java"]),
    resources = glob(["templates/*.vm"]),
    deps = [
        "//java/com/google/common/base",
        "//java/com/google/common/collect",
        "//java/com/google/common/io",
        "//java/com/google/protobuf",
        "//java/com/google/protobuf/contrib",
        "//java/com/google/protobuf/contrib/immutablejs/generator",
        "//java/com/google/protobuf/contrib/j2cl:options_java_proto",
        "//java/com/google/protobuf/contrib/j2cl/options:js_enum_java_proto",
        "//net/proto2/compiler/proto:plugin_java_proto",
        "//third_party/java/auto:auto_value",
        "//third_party/java/jakarta_velocity",
    ],
)
