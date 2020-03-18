# Description:
#   Build rules in this directory are used by our tooling and build rules

##########################################################
#                                                        #
#  __          __     _____  _   _ _____ _   _  _____    #
#  \ \        / /\   |  __ \| \ | |_   _| \ | |/ ____|   #
#   \ \  /\  / /  \  | |__) |  \| | | | |  \| | |  __    #
#    \ \/  \/ / /\ \ |  _  /| . ` | | | | . ` | | |_ |   #
#     \  /\  / ____ \| | \ \| |\  |_| |_| |\  | |__| |   #
#      \/  \/_/    \_\_|  \_\_| \_|_____|_| \_|\_____|   #
#                                                        #
#                                                        #
##########################################################
# Never depend on any of the targets in this BUILD file  #
# manually. They are used within tools/build rules and   #
# and should actually be private, but Blaze does not     #
# support this yet, b/34359566.                          #
##########################################################

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package(default_visibility = ["//visibility:public"])

licenses(["notice"])  # Apache 2.0

java_binary(
    name = "ImmutableJspbCompiler",
    main_class = "com.google.protobuf.contrib.immutablejs.generator.ImmutableJspbCompiler",
    visibility = ["//visibility:public"],
    runtime_deps = [
        "//java/com/google/protobuf/contrib/immutablejs/generator",
    ],
)

# Do not use this target, the target you are looking for is:
# //java/com/google/protobuf/contrib/immutablejs:runtime
closure_js_library(
    name = "runtime",
    exports = [
        "//java/com/google/protobuf/contrib/immutablejs/runtime:bytestring",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:fieldaccessor",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:internal_message",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:listview",
        "//java/com/google/protobuf/contrib/immutablejs/runtime:message",
        "//javascript/closure:base",
        "//javascript/closure/math:long",
    ],
)
