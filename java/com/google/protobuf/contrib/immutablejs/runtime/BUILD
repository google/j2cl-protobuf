load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(
    default_visibility = [
        "//java/com/google/protobuf/contrib/immutablejs:__subpackages__",
        "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
        "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
    ],
)

licenses(["notice"])  # Apache 2.0

closure_js_library(
    name = "defines",
    srcs = ["defines.js"],
)

closure_js_library(
    name = "internal_checks",
    srcs = ["internal_checks.js"],
    deps = [
        ":defines",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "equivalence",
    srcs = ["equivalence.js"],
)

closure_js_library(
    name = "hashing",
    srcs = ["hashing.js"],
    deps = [":internal_checks"],
)

genrule(
    name = "gen_jspbkernel",
    srcs = [],
    outs = ["jspbkernel.js"],
    cmd = "$(location //java/com/google/protobuf/contrib/immutablejs/generator/runtime:RuntimeGenerator) -runtimeClass jspb_kernel -output \"$@\"",
    tools = ["//java/com/google/protobuf/contrib/immutablejs/generator/runtime:RuntimeGenerator"],
    visibility = ["//visibility:private"],
)

closure_js_library(
    name = "jspbkernel",
    srcs = [":gen_jspbkernel"],
    deps = [
        ":bytestring",
        ":equivalence",
        ":fieldaccessor",
        ":hashing",
        ":internal_checks",
        ":internal_list",
        ":internal_mutablelistview",
        ":listview",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "listview",
    srcs = ["listview.js"],
    deps = [":internal_checks"],
)

closure_js_library(
    name = "bytestring",
    srcs = ["bytestring.js"],
    deps = [
        ":hashing",
        ":internal_checks",
        "//third_party:closure_crypt_base64",
    ],
)

closure_js_library(
    name = "fieldaccessor",
    srcs = ["fieldaccessor.js"],
    deps = [
        ":bytestring",
        ":internal_checks",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "mapview",
    srcs = ["mapview.js"],
)

closure_js_library(
    name = "message",
    srcs = ["message.js"],
    deps = [
        ":listview",
        "//third_party:closure_math_long",
    ],
)

genrule(
    name = "gen_internal_message",
    srcs = [],
    outs = ["internal_message.js"],
    cmd = "$(location //java/com/google/protobuf/contrib/immutablejs/generator/runtime:RuntimeGenerator) -runtimeClass internal_message -output \"$@\"",
    tools = ["//java/com/google/protobuf/contrib/immutablejs/generator/runtime:RuntimeGenerator"],
    visibility = ["//visibility:private"],
)

closure_js_library(
    name = "internal_list",
    srcs = [":internal_list.js"],
    deps = [
        ":internal_checks",
        ":internal_mutablelistview",
        ":listview",
        "//third_party:closure_asserts",
    ],
)

closure_js_library(
    name = "internal_map",
    srcs = ["internal_map.js"],
    deps = [
        ":internal_checks",
        ":internal_mutablemapview",
    ],
)

closure_js_library(
    name = "internal_mutablelistview",
    srcs = [":internal_mutablelistview.js"],
    deps = [":listview"],
)

closure_js_library(
    name = "internal_mutablemapview",
    srcs = [":internal_mutablemapview.js"],
    deps = [":mapview"],
)

closure_js_library(
    name = "internal_message",
    srcs = [":gen_internal_message"],
    deps = [
        ":bytestring",
        ":internal_checks",
        ":jspbkernel",
        ":listview",
        ":message",
        "//third_party:closure_math_long",
        "//third_party:closure_reflect",
    ],
)
