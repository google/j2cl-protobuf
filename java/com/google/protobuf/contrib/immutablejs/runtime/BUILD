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

closure_js_library(
    name = "jspbkernel",
    srcs = ["jspbkernel.js"],
    deps = [
        ":bytestring",
        ":equivalence",
        ":fieldaccessor",
        ":hashing",
        ":internal_checks",
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
        ":listview",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "message",
    srcs = ["message.js"],
    deps = [
        ":listview",
        "//third_party:closure_math_long",
    ],
)

closure_js_library(
    name = "internal_message",
    srcs = ["internal_message.js"],
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
