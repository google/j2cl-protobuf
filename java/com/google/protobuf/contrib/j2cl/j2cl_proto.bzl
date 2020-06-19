"""Build extension to generate j2cl-compatible protocol buffers.

  Usage:
    j2cl_proto: generates a j2cl-compatible java_library for an existing
      proto_library.

  Example usage:

   load("//java/com/google/protobuf/contrib/j2cl:j2cl_proto.bzl", "j2cl_proto_library")

   proto_library(
       name = "accessor",
       srcs = ["accessor.proto"],
   )

   j2cl_proto_library(
       name = "accessor_j2cl_proto",
       dep = ":accessor",
   )
"""

# Blessed by J2CL team. This is needed for J2CL provider and J2CL provider API is
# only avaiable for proto. Other should never depend on J2CL internals.
load(
    "@com_google_j2cl//build_defs/internal_do_not_use:j2cl_common.bzl",
    "J2CL_TOOLCHAIN_ATTRS",
    "J2clInfo",
    "j2cl_common",
)
load(
    "//java/com/google/protobuf/contrib/immutablejs:immutable_js_proto_library.bzl",
    "ImmutableJspbInfo",
    "immutable_js_proto_library_aspect",
)
load(":j2cl_proto_provider.bzl", "J2clProtoInfo")

def _new_jar(ctx, name):
    """Create a new file object for a jar archive.

    Args:
      ctx: The current rule context.
      name: The name of the directory (relative to the current rule's package)
        that should be stored in this archive.

    Returns:
      A file object for the archive.
    """
    return ctx.actions.declare_file(name + ".srcjar")

def _unarchived_jar_path(path):
    """Get the path of the unarchived directory.

    Args:
      path: The path to the archive file.

    Returns:
      The path to the directory that this file will expand to.
    """
    if not path.endswith(".srcjar"):
        fail("Path %s doesn't end in \".srcjar\"" % path)
    return path[0:-7]

def _j2cl_proto_library_aspect_impl(target, ctx):
    name = ctx.label.name + "-j2cl"
    srcs = target[ProtoInfo].direct_sources
    transitive_srcs = target[ProtoInfo].transitive_sources
    deps = [target[ImmutableJspbInfo].js]
    deps += [dep[J2clProtoInfo]._private_.j2cl_info for dep in ctx.rule.attr.deps]
    transitive_runfiles = [target[ImmutableJspbInfo]._private_.runfiles]
    transitive_runfiles += [dep[J2clProtoInfo]._private_.runfiles for dep in ctx.rule.attr.deps]

    jar_archive = _new_jar(ctx, name)

    if srcs:
        protoc_command_template = """
          set -e -o pipefail

          rm -rf {dir}
          mkdir -p {dir}

          {protoc} --plugin=protoc-gen-j2cl_protobuf={protoc_plugin} \
                        --proto_path=. \
                        --proto_path={genfiles} \
                        --j2cl_protobuf_out={dir} \
                        {proto_sources}
          java_files=$(find {dir} -name '*.java')
          chmod -R 664 $java_files
          {java_format} -i $java_files
          {jar} -cf {jar_file} -C {dir} .
          """
        protoc_command = protoc_command_template.format(
            dir = _unarchived_jar_path(jar_archive.path),
            protoc = ctx.executable._protocol_compiler.path,
            protoc_plugin = ctx.executable._protoc_gen_j2cl.path,
            genfiles = ctx.configuration.genfiles_dir.path,
            proto_sources = " ".join([s.path for s in srcs]),
            jar = ctx.executable._jar.path,
            jar_file = jar_archive.path,
            java_format = ctx.executable._google_java_formatter.path,
        )

        resolved_tools, resolved_command, input_manifest = ctx.resolve_command(
            command = protoc_command,
            tools = [
                ctx.attr._protocol_compiler,
                ctx.attr._protoc_gen_j2cl,
                ctx.attr._jar,
                ctx.attr._google_java_formatter,
            ],
        )

        ctx.actions.run_shell(
            command = resolved_command,
            inputs = transitive_srcs,
            tools = resolved_tools,
            outputs = [jar_archive],
            input_manifests = input_manifest,
            progress_message = "Generating J2CL proto files",
        )

        runtime_deps = [d[J2clInfo] for d in ctx.attr._j2cl_proto_implicit_deps]
        transitive_runfiles += [
            d[DefaultInfo].default_runfiles.files
            for d in ctx.attr._j2cl_proto_implicit_deps
        ]

        j2cl_provider = j2cl_common.compile(
            ctx,
            name = name,
            srcs = [jar_archive],
            deps = deps + runtime_deps,
        )

    else:
        ctx.actions.run_shell(
            command = "touch %s" % jar_archive.path,
            outputs = [jar_archive],
        )

        # Considers deps as exports in no srcs case.
        j2cl_provider = j2cl_common.compile(
            ctx,
            name = name,
            exports = deps,
        )

    js = j2cl_common.get_jsinfo_provider(j2cl_provider)

    return J2clProtoInfo(
        _private_ = struct(
            j2cl_info = j2cl_provider,
            srcjar = jar_archive,
            runfiles = depset(js.srcs, transitive = transitive_runfiles),
        ),
        js = js,
    )

_j2cl_proto_library_aspect = aspect(
    implementation = _j2cl_proto_library_aspect_impl,
    required_aspect_providers = [ImmutableJspbInfo],
    attr_aspects = ["deps"],
    provides = [J2clProtoInfo],
    attrs = dict(J2CL_TOOLCHAIN_ATTRS, **{
        "_j2cl_proto_implicit_deps": attr.label_list(
            default = [
                # Blessed by J2CL team. This is needed for J2CL provider and J2CL provider API is
                # only available for proto. Other should never depend on J2CL internals.
                Label("@com_google_j2cl//build_defs/internal_do_not_use:jre"),
                Label("//third_party:gwt-jsinterop-annotations-j2cl"),
                Label("//third_party:jsinterop-base-j2cl"),
                Label("//third_party:j2cl_proto_runtime"),
            ],
        ),
        "_protocol_compiler": attr.label(
            executable = True,
            cfg = "host",
            default = Label("//third_party:protocol_compiler"),
        ),
        "_protoc_gen_j2cl": attr.label(
            executable = True,
            cfg = "host",
            default = Label("//java/com/google/protobuf/contrib/j2cl/internal_do_not_use:J2CLProtobufCompiler"),
        ),
        "_jar": attr.label(
            executable = True,
            cfg = "host",
            default = Label("@bazel_tools//tools/jdk:jar"),
        ),
        "_google_java_formatter": attr.label(
            cfg = "host",
            executable = True,
            default = Label("//third_party:google_java_format"),
        ),
    }),
    fragments = ["java", "js"],
)

def _j2cl_proto_library_rule_impl(ctx):
    if len(ctx.attr.deps) != 1:
        fail("Only one deps entry allowed")

    j2cl_proto_info = ctx.attr.deps[0][J2clProtoInfo]

    srcjar = j2cl_proto_info._private_.srcjar
    ctx.actions.run_shell(
        command = "cp %s %s" % (srcjar.path, ctx.outputs.srcjar.path),
        inputs = [srcjar],
        outputs = [ctx.outputs.srcjar],
    )

    # This is a workaround to b/35847804 to make sure the zip ends up in the runfiles.
    # We are doing this transitively since we need to workaround the issue for the files generated
    # by the aspect as well.
    runfiles = j2cl_proto_info._private_.runfiles

    return j2cl_common.create_js_lib_struct(
        j2cl_info = j2cl_proto_info._private_.j2cl_info,
        extra_providers = [
            DefaultInfo(runfiles = ctx.runfiles(transitive_files = runfiles)),
        ],
    )

# WARNING:
# This rule should really be private since it intoduces a new proto runtime
# to the repo and using this will cause diamond dependency problems.
# Use regular j2cl_proto_library rule with the blaze flag
# (--define j2cl_proto=interop).
new_j2cl_proto_library = rule(
    implementation = _j2cl_proto_library_rule_impl,
    attrs = {
        "deps": attr.label_list(
            providers = [ProtoInfo],
            aspects = [immutable_js_proto_library_aspect, _j2cl_proto_library_aspect],
        ),
    },
    fragments = ["js"],
    outputs = {
        "srcjar": "%{name}_for_testing_do_not_use.srcjar",
    },
)
