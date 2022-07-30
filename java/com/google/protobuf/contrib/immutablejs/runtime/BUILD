load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

IMMUTABLE_JS_INTERNAL_VISIBILITIES = [
    "//java/com/google/protobuf/contrib/immutablejs:__pkg__",
    "//java/com/google/protobuf/contrib/immutablejs:__subpackages__",
    "//javatests/com/google/protobuf/contrib/immutablejs:__subpackages__",
    "//javatests/com/google/protobuf/contrib/j2cl:__subpackages__",
]

package(
    default_visibility = IMMUTABLE_JS_INTERNAL_VISIBILITIES,
)

licenses(["notice"])

closure_js_library(
    name = "defines",
    srcs = ["defines.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
)

closure_js_library(
    name = "internal_checks",
    srcs = ["internal_checks.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [
        ":defines",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "equivalence",
    srcs = ["equivalence.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
)

closure_js_library(
    name = "hashing",
    srcs = ["hashing.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
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
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [
        ":bytestring",
        ":equivalence",
        ":fieldaccessor",
        ":hashing",
        ":internal_checks",
        ":internal_list",
        ":internal_map",
        ":internal_mutablelistview",
        ":internal_mutablemapview",
        ":listview",
        ":mapview",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "listview",
    srcs = ["listview.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [":internal_checks"],
)

closure_js_library(
    name = "bytestring",
    srcs = ["bytestring.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [
        ":hashing",
        ":internal_checks",
        "//third_party:closure_crypt_base64",
    ],
)

closure_js_library(
    name = "fieldaccessor",
    srcs = ["fieldaccessor.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [
        ":bytestring",
        ":internal_checks",
        "//third_party:closure_crypt_base64",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "mapview",
    srcs = ["mapview.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
)

closure_js_library(
    name = "message",
    srcs = ["message.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [
        ":listview",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "runtime",
    tags = ["alt_dep=//java/com/google/protobuf/contrib/immutablejs:runtime"],
    exports = [
        ":bytestring",
        ":listview",
        ":mapview",
        ":message",
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
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
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
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [
        ":internal_checks",
        ":internal_mutablemapview",
    ],
)

closure_js_library(
    name = "internal_mutablelistview",
    srcs = [":internal_mutablelistview.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [":listview"],
)

closure_js_library(
    name = "internal_mutablemapview",
    srcs = [":internal_mutablemapview.js"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [":mapview"],
)

closure_js_library(
    name = "internal_message",
    srcs = [":gen_internal_message"],
    suppress = [
        "lintChecks",
        "superfluousSuppress",
    ],
    deps = [
        ":bytestring",
        ":internal_checks",
        ":jspbkernel",
        ":listview",
        ":message",
        ":mapview",
        "//third_party:closure_math_long",
        "//third_party:closure_reflect",
    ],
)
