#!/bin/bash

PORT=3000
DEBUG_PORT=9229

export NODE_PORT=${PORT}
exec node --inspect=0.0.0.0:${DEBUG_PORT} /opt/dist/server.js -- ${PORT}