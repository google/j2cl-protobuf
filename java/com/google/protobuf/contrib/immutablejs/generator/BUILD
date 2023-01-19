licenses(["notice"])

java_library(
    name = "generator",
    srcs = glob(["*.java"]),
    resources = glob(["templates/*.vm"]),
    visibility = [
        "//java/com/google/protobuf/contrib/immutablejs/generator:__subpackages__",
        "//java/com/google/protobuf/contrib/immutablejs/internal_do_not_use:__pkg__",
        "//java/com/google/protobuf/contrib/j2cl/generator:__pkg__",
        "//javatests/com/google/protobuf/contrib/immutablejs/integration/generator:__pkg__",
        "//javatests/com/google/protobuf/contrib/j2cl/integration/generator:__pkg__",
    ],
    deps = [
        "//third_party:auto_value",
        "//third_party:descriptor_java_proto",
        "//third_party:escapevelocity",
        "//third_party:guava",
        "//third_party:jsr305_annotations",
        "//third_party:plugin_java_proto",
        "//third_party:protobuf",
    ],
)
