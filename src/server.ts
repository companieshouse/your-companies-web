import fs from "fs";
import http from "http";
import https from "https";
import logger from "./lib/Logger";
import dotenv from "dotenv";
dotenv.config();
import app from "./app"; // eslint-disable-line

// start the HTTP server
const server = http.createServer(app);
server.listen(process.env.NODE_PORT, () => {
    console.log(`Server started at: ${process.env.NODE_HOSTNAME}:${process.env.NODE_PORT}`);
}).on("error", err => {
    logger.error(`${err.name} - HTTP Server error: ${err.message} - ${err.stack}`);
});

// Start the secure server - possibly not required if app is running behind a loadbalancer, with SSL termination
if (process.env.NODE_SSL_ENABLED === "ON") {
    const privateKey = fs.readFileSync(process.env.NODE_SSL_PRIVATE_KEY ?? "", "utf8");
    const certificate = fs.readFileSync(process.env.NODE_SSL_CERTIFICATE ?? "", "utf8");
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(process.env.NODE_PORT_SSL, () => {
        console.log(`Secure server started at: ${process.env.NODE_HOSTNAME_SECURE}:${process.env.NODE_PORT_SSL}`);
    }).on("error", err => {
        logger.error(`${err.name} - HTTPS Server error: ${err.message} - ${err.stack}`);
    });
}

export default server;
