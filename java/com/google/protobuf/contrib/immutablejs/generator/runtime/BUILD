package(
    default_visibility = ["//visibility:private"],
)

licenses(["notice"])

java_library(
    name = "runtime",
    srcs = glob(["*.java"]),
    resources = glob(["templates/*.vm"]),
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/generator",
        "//third_party:args4j",
        "//third_party:auto_value",
        "//third_party:descriptor_java_proto",
        "//third_party:guava",
        "//third_party:jsr305_annotations",
        "//third_party:plugin_java_proto",
        "//third_party:protobuf",
    ],
)

java_binary(
    name = "RuntimeGenerator",
    main_class = "com.google.protobuf.contrib.immutablejs.generator.runtime.RuntimeGenerator",
    visibility = ["//java/com/google/protobuf/contrib/immutablejs/runtime:__pkg__"],
    runtime_deps = [":runtime"],
)
