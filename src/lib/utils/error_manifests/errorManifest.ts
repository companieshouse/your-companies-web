const errorManifest = {
    generic: {
        serverError: {
            summary: "generic_error_message"
        }
    },
    validation: {
        default: {
            summary: "Your request contains validation errors",
            inline: "Your request contains validation errors"
        }
    }
};

export default errorManifest;
