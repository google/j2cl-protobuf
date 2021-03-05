"""Provider for J2CL proto."""

J2clProtoInfo = provider(
    "Provider for the J2CL proto compilation.\n" +
    "NOTE: Data under '_private_' is considered private internal data so do not use.\n" +
    "This provider is exported for only particular use cases and you should talk to us" +
    "to verify your use case.",
    fields = ["js", "_private_"],
)
