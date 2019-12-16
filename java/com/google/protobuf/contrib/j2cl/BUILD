# Public targets for j2cl proto

load("//third_party/java/j2cl:j2cl_library.bzl", "j2cl_library")

package(
    default_visibility = ["//visibility:public"],
)

licenses(["notice"])  # Apache 2.0

# TODO(dankurka): This target should be public, but for now we still need
# to switch between two different j2cl proto implementations with a blaze
# flag, making this public would expose an alternate implementation of the
# proto api to j2cl, which will fail. Remove switching and make this target
# public.
#
# Target exists so that users can use references to j2cl super sourced
# implementations of the protocol buffer api, e.g.:
#     com.google.protobuf.Message

# but the j2cl version can not live there since it would need to be
# part of components.
j2cl_library(
    name = "runtime",
    visibility = [
    ],
    exports = [
    ],
)

bzl_library(
    name = "j2cl_proto_provider_bzl",
    srcs = ["j2cl_proto_provider.bzl"],
)

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
# Do not use this config flag without talking to         #
# dankurka@, you will be broken without warning          #
# and any rollback if you don't.                         #
##########################################################
config_setting(
    name = "interop",
    values = {"define": "j2cl_proto=interop"},
)

config_setting(
    name = "nointerop",
    values = {"define": "j2cl_proto=nointerop"},
)
