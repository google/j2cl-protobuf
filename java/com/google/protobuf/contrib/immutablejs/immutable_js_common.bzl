
"""This module contains js_provider helpers."""

load(
    "@io_bazel_rules_closure//closure:defs.bzl",
    "CLOSURE_JS_TOOLCHAIN_ATTRS",
    "create_closure_js_library",
)

def create_js_provider(ctx, srcs = [], deps = [], runtime_deps = [], exports = [], artifact_suffix = None):
    """ Creates a js provider from provided sources, deps and exports. """

    srcs = _create_zip_output(ctx, srcs) if srcs else []

    return create_closure_js_library(
        ctx,
        srcs = srcs,
        deps = deps + runtime_deps,
        exports = exports,
        suppress = ["underscore", "superfluousSuppress"],
        convention = "GOOGLE",
    )

def create_js_lib_struct(js_provider, extra_providers = []):
    return struct(
        providers = [js_provider] + extra_providers,
        closure_js_library = js_provider.closure_js_library,
        exports = js_provider.exports,
    )

def js_attrs():
  return CLOSURE_JS_TOOLCHAIN_ATTRS

# Temporary hack as JsChecker do not support tree artifact yet.
def _create_zip_output(ctx, output_dir):
    jszip =  ctx.actions.declare_file("%s.js.zip" % ctx.rule.attr.name)

    ctx.actions.run_shell(
        progress_message = "Generating proto zip file",
        inputs = output_dir,
        outputs = [jszip],
        command = (
            "%s cfM %s -C %s ." % (ctx.executable._jar.path, jszip.path, output_dir[0].path)
        ),
        tools = [ctx.executable._jar],
    )

    return [jszip]
