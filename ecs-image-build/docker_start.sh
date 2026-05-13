#!/bin/bash
#
# Start script for account-validator-web

PORT=3000

export NODE_PORT=${PORT}
exec node -r ./otel.js /opt/server.js -- ${PORT}