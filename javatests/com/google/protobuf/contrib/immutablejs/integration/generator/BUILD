package(
    default_visibility = ["//visibility:private"],
)

licenses(["notice"])

java_library(
    name = "generator",
    srcs = glob(["*.java"]),
    resources = glob(["templates/*.vm"]),
    deps = [
        "//java/com/google/protobuf/contrib/immutablejs/generator",
        "//third_party:args4j",
        "//third_party:guava",
        "//third_party:jsr305_annotations",
        "//third_party:protobuf",
    ],
)

java_binary(
    name = "MapsAllVariantsTestGenerator",
    main_class = "com.google.protobuf.contrib.immutablejs.integration.generator.MapsAllVariantsTestGenerator",
    visibility = ["//javatests/com/google/protobuf/contrib/immutablejs/integration:__pkg__"],
    runtime_deps = [":generator"],
)
