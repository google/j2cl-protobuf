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

load("@bazel_skylib//lib:dicts.bzl", "dicts")
load(":immutable_js_common.bzl", "create_js_lib_struct", "create_js_provider", "js_attrs")

ImmutableJspbInfo = provider(
    "Provider for the immutable_js_proto compilation.\n" +
    "NOTE: Data under '_private_' is considered private internal data so do not use.\n" +
    "This provider is exported for only particular use cases and you should talk to us" +
    "to verify your use case.",
    fields = ["js", "_private_"],
)

def _immutable_js_proto_library_aspect_impl(target, ctx):
    srcs = target[ProtoInfo].direct_sources
    transitive_srcs = target[ProtoInfo].transitive_sources
    out_srcs = []

    if srcs:
        output = ctx.actions.declare_directory(ctx.label.name + "-improto")
        out_srcs = [output]

        command = """
        set -e -o pipefail

        rm -rf {output}
        mkdir -p {output}
        mkdir -p {genfiles}

        {protoc} --plugin=protoc-gen-immutable_js_protobuf={protoc_plugin} \
              --proto_path=. \
              --proto_path={genfiles} \
              --immutable_js_protobuf_out={output} \
              {proto_sources}

        js_files=$(find {output} -name '*.js')
        chmod -R 664 $js_files
        {clang_format} -style=Google -i $js_files
        """.format(
            clang_format = ctx.executable._clang_format.path,
            output = output.path,
            protoc = ctx.executable._protocol_compiler.path,
            protoc_plugin = ctx.executable._protoc_gen_immutable_js.path,
            genfiles = ctx.configuration.genfiles_dir.path,
            proto_sources = " ".join([s.path for s in srcs]),
        )

        ctx.actions.run_shell(
            command = command,
            inputs = transitive_srcs,
            outputs = [output],
            tools = [
                ctx.executable._protocol_compiler,
                ctx.executable._protoc_gen_immutable_js,
                ctx.executable._clang_format,
            ],
            progress_message = "Generating immutable_js_proto files",
        )

    transitive_runfiles = [dep[ImmutableJspbInfo]._private_.runfiles for dep in ctx.rule.attr.deps]
    deps = [dep[ImmutableJspbInfo].js for dep in ctx.rule.attr.deps]
    exports = [dep[ImmutableJspbInfo].js for dep in ctx.rule.attr.exports]

    js_provider = create_js_provider(
        ctx,
        srcs = out_srcs,
        deps = deps,
        runtime_deps = ctx.attr._runtime_deps,
        exports = (deps if not srcs else []) + exports,
        # Use unique artifact suffix to avoid conflicts with other aspects on the same target.
        artifact_suffix = "_immutable_js_proto_library_aspect",
    )

    return [ImmutableJspbInfo(
        js = js_provider,
        _private_ = struct(runfiles = depset(out_srcs, transitive = transitive_runfiles)),
    )]

immutable_js_proto_library_aspect = aspect(
    implementation = _immutable_js_proto_library_aspect_impl,
    attr_aspects = ["deps", "exports"],
    attrs = dicts.add(js_attrs(), {
        "_protocol_compiler": attr.label(
            executable = True,
            cfg = "exec",
            default = Label("//third_party:protocol_compiler"),
        ),
        "_protoc_gen_immutable_js": attr.label(
            executable = True,
            cfg = "exec",
            default = Label(
                "//java/com/google/protobuf/contrib/immutablejs/internal_do_not_use:ImmutableJspbCompiler",
            ),
        ),
        "_clang_format": attr.label(
            executable = True,
            allow_files = True,
            cfg = "exec",
            default = Label("//third_party:clang-format"),
        ),
        "_runtime_deps": attr.label_list(
            default = [
                Label("//java/com/google/protobuf/contrib/immutablejs/internal_do_not_use:runtime"),
            ],
        ),
        "_jar": attr.label(
            cfg = "exec",
            executable = True,
            default = Label("@bazel_tools//tools/jdk:jar"),
        ),
    }),
    fragments = ["js"],
    provides = [ImmutableJspbInfo],
)

def _immutable_js_proto_library_rule_impl(ctx):
    if len(ctx.attr.deps) != 1:
        fail("Only one deps entry allowed")
    dep = ctx.attr.deps[0]

    # Create a new js provider to create a blaze level ExtraAction, so
    # that this rule gets indexed by Cymbals table.
    js_provider = create_js_provider(
        ctx,
        exports = [dep[ImmutableJspbInfo].js],
    )
    runfiles = dep[ImmutableJspbInfo]._private_.runfiles

    return create_js_lib_struct(
        js_provider = js_provider,
        extra_providers = [
            DefaultInfo(runfiles = ctx.runfiles(transitive_files = runfiles)),
        ],
    )

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
