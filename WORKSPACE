workspace(name = "com_google_j2cl_protobuf")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Load J2CL separately
_J2CL_VERSION = "7856e8b4cace643a8cc088a40eb21ec82dd3a03f"

http_archive(
    name = "com_google_j2cl",
    strip_prefix = "j2cl-%s" % _J2CL_VERSION,
    url = "https://github.com/google/j2cl/archive/%s.zip" % _J2CL_VERSION,
)

load("@com_google_j2cl//build_defs:repository.bzl", "load_j2cl_repo_deps")

load_j2cl_repo_deps()

load("@com_google_j2cl//build_defs:workspace.bzl", "setup_j2cl_workspace")

setup_j2cl_workspace()

load(":repository.bzl", "load_j2cl_proto_repo_deps")
load_j2cl_proto_repo_deps()
