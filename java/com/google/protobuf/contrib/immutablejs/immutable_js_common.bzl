
"""This module contains js_provider helpers."""

load(
    "@io_bazel_rules_closure//closure:defs.bzl",
    "CLOSURE_JS_TOOLCHAIN_ATTRS",
    "create_closure_js_library",
)

def create_js_provider(ctx, srcs = [], deps = [], exports = []):
    """ Creates a js provider from provided sources, deps and exports. """

    return create_closure_js_library(
        ctx,
        srcs,
        deps,
        exports,
        convention = "GOOGLE",
    )

def js_attrs(ignore):
  return CLOSURE_JS_TOOLCHAIN_ATTRS