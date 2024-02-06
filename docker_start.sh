#!/bin/bash

npm i
PORT=3000

export NODE_PORT=${PORT}
exec node /opt/server.js -- ${PORT}
# exec node /opt/bin/www.js -- ${PORT}