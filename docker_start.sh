#!/bin/bash

cd ..
npm i
PORT=3000

export NODE_PORT=${PORT}
exec node /opt/dist/server.js -- ${PORT}