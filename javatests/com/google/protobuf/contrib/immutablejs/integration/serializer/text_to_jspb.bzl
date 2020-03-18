"""
Converts text protos to Apps JSPB protos.
"""

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

def proto_data_jspb(name, src, proto_name, proto_deps):
    """
    Converts a text proto to jspb.

    Args:
      name: name of the rule
      src: text proto file
      proto_name: the full name of the proto
      proto_deps: the dependencies of the proto

    """

    # define java_proto lib
    native.java_proto_library(
        name = name + "_java_proto_library",
        deps = proto_deps,
    )

    # define binary
    native.java_binary(
        name = name + "_java_binary",
        runtime_deps = [
            ":" + name + "_java_proto_library",
            "//javatests/com/google/protobuf/contrib/immutablejs/integration/serializer:ProtoToJspb",
        ],
        main_class = "com.google.protobuf.contrib.immutablejs.integration.serializer.ProtoToJspb",
    )

    # run
    native.genrule(
        name = name + "_genrule",
        srcs = [src],
        cmd = "$(location :%s_java_binary) --proto %s $(SRCS) > $@" %
              (name, "com.google.protos." + proto_name),
        tools = [":" + name + "_java_binary"],
        outs = [name + ".js"],
    )

_TEMPLATE = """
DATA=`cat $(SRCS)`;
cat >$@ <<EOF
goog.module('%s');
/** @const {!Array<*>} */
const JSPB_DATA = $$DATA;
exports = JSPB_DATA;
EOF

"""

def goog_module_proto_jspb_data(name, src, proto_name, proto_deps, goog_module):
    proto_data_jspb(name, src, proto_name, proto_deps)

    native.genrule(
        name = name + "_genrule_goog_module",
        cmd = _TEMPLATE % goog_module,
        srcs = [":" + name + ".js"],
        outs = [":" + name + ".module.js"],
    )

    closure_js_library(
        name = name,
        srcs = [":" + name + ".module.js"],
        deps = ["//javascript/closure:base"],
    )
