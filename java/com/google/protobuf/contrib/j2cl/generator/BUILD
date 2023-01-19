# Description:
# The J2CL protobuf generator.

package(default_visibility = [
    "//java/com/google/protobuf/contrib/j2cl:__subpackages__",
    "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
])

licenses(["notice"])

java_library(
    name = "generator",
    srcs = glob(["*.java"]),
    resources = glob(["templates/*.vm"]),
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/generator",
        "//java/com/google/protobuf/contrib/j2cl:options_java_proto",
        "//java/com/google/protobuf/contrib/j2cl/options:js_enum_java_proto",
        "//third_party:auto_value",
        "//third_party:escapevelocity",
        "//third_party:guava",
        "//third_party:jsr305_annotations",
        "//third_party:plugin_java_proto",
        "//third_party:protobuf",
    ],
)
