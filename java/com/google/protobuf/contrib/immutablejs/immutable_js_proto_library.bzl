"""Build extension to generate immutable JavaScript protocol buffers.

Usage:
    immutable_js_proto_library: generates a immutable JavaScript implementation
    for an existing proto_library.

  Example usage:

     proto_library(
         name = "foo",
         srcs = ["foo.proto"],
     )

     immutable_js_proto_library(
         name = "foo_immutable_js_proto",
         deps = [":foo"],
     )
"""

load("//third_party/bazel_skylib/lib:dicts.bzl", "dicts")


# DO NOT USE OR WE WILL BREAK YOU ON PURPOSE
# This is only exported for only particular use cases and you should talk to us
# to verify your use case.
ImmutableJspbInfo = provider(fields = ["js", "_private_"])

def _immutable_js_proto_library_aspect_impl(target, ctx):
    srcs = target[ProtoInfo].direct_sources
    transitive_srcs = target[ProtoInfo].transitive_sources
    out_srcs = []

    if srcs:
        output = ctx.actions.declare_directory(ctx.label.name + "-improto")
        out_srcs = [output]

        command = """
        set -e -o pipefail

        {protoc} --plugin=protoc-gen-immutable_js_protobuf={protoc_plugin} \
              --proto_path=. \
              --proto_path={genfiles} \
              --immutable_js_protobuf_out={output} \
              {proto_sources}

        js_files=$(find {output} -name '*.js')
        chmod -R 664 $js_files
        {clang_format} -i $js_files
      """.format(
            clang_format = ctx.executable._clang_format.path,
            output = output.path,
            protoc = ctx.executable._protocol_compiler.path,
            protoc_plugin = ctx.executable._protoc_gen_immutable_js.path,
            genfiles = ctx.configuration.genfiles_dir.path,
            proto_sources = " ".join([s.path for s in srcs]),
        )

        (resolved_inputs, resolved_command, input_manifest) = ctx.resolve_command(
            command = command,
            tools = [
                ctx.attr._protocol_compiler,
                ctx.attr._protoc_gen_immutable_js,
                ctx.attr._clang_format,
            ],
        )

        ctx.actions.run_shell(
            command = resolved_command,
            inputs = depset(resolved_inputs, transitive = [transitive_srcs]),
            outputs = [output],
            input_manifests = input_manifest,
            progress_message = "Generating immutable jspb files",
        )

    transitive_runfiles = [dep[ImmutableJspbInfo]._private_.runfiles for dep in ctx.rule.attr.deps]
    deps = [dep[ImmutableJspbInfo].js for dep in ctx.rule.attr.deps]
    exports = [dep[ImmutableJspbInfo].js for dep in ctx.rule.attr.exports]

    js_provider = js_checkable_provider(
        ctx,
        srcs = out_srcs,
        check_level = "OFF",
        deps = deps + [d[JsInfo] for d in ctx.attr._runtime_deps],
        exports = (deps if not srcs else []) + exports,
        # Seems like this works around b/34608532 but not sure how...
        aspect_name = "_immutable_js_proto_library_aspect",
    )

    return [ImmutableJspbInfo(
        js = js_provider,
        _private_ = struct(runfiles = depset(out_srcs, transitive = transitive_runfiles)),
    )]

immutable_js_proto_library_aspect = aspect(
    implementation = _immutable_js_proto_library_aspect_impl,
    attr_aspects = ["deps", "exports"],
    attrs = dicts.add(js_attrs("_immutable_js_proto_library_aspect"), {
        "_protocol_compiler": attr.label(
            executable = True,
            cfg = "host",
            default = Label("//net/proto2/compiler/public:protocol_compiler"),
        ),
        "_protoc_gen_immutable_js": attr.label(
            executable = True,
            cfg = "host",
            default = Label(

            ),
        ),
        "_clang_format": attr.label(
            executable = True,
            cfg = "host",
            default = Label(
                "//third_party/crosstool/google3_users:stable_clang-format",
            ),
        ),
        "_runtime_deps": attr.label_list(
            default = [

            ],
        ),
    }),
    fragments = ["js"],
    provides = [ImmutableJspbInfo],
)

def _immutable_js_proto_library_rule_impl(ctx):
    if len(ctx.attr.deps) != 1:
        fail("Only one deps entry allowed")
    dep = ctx.attr.deps[0]

    # Create a new js_common.provider to create a blaze level ExtraAction, so
    # that this rule gets indexed by Cymbals table.
    js_provider = js_checkable_provider(
        ctx,
        exports = [dep[ImmutableJspbInfo].js],
        deps_mgmt = "closure",
    )
    runfiles = dep[ImmutableJspbInfo]._private_.runfiles

    return [
        DefaultInfo(runfiles = ctx.runfiles(transitive_files = runfiles)),
        js_provider,
    ]

immutable_js_proto_library = rule(
    implementation = _immutable_js_proto_library_rule_impl,
    attrs = dicts.add(js_attrs(), {
        "deps": attr.label_list(
            providers = [ProtoInfo],
            aspects = [immutable_js_proto_library_aspect],
        ),
    }),
    fragments = ["js"],
)
