import express from "express";
import http from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { createBareServer } from "@tomphttp/bare-server-node";
import createRammerhead from "rammerhead/src/server/index.js";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import { build } from "astro";
import { existsSync } from "fs";
import chalk from "chalk";
import { hostname } from "node:os";
import cors from "cors";
import path from "node:path"
import wisp from "wisp-server-node";

if (!existsSync("./dist")) {
    build();
}

const server = http.createServer();
const app = express(server);
const __dirname = process.cwd();
const bare = createBareServer("/bare/");
const PORT = process.env.PORT || 8080;
const rh = createRammerhead();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/dist"));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));
app.use(cors());

const rammerheadScopes = [
    "/rammerhead.js",
    "/hammerhead.js",
    "/transport-worker.js",
    "/task.js",
    "/iframe-task.js",
    "/worker-hammerhead.js",
    "/messaging",
    "/sessionexists",
    "/deletesession",
    "/newsession",
    "/editsession",
    "/needpassword",
    "/syncLocalStorage",
    "/api/shuffleDict",
    "/mainport"
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

app.use((req, res) => {
    res.status(404);
    res.sendFile(path.join(process.cwd(), "/public/error.html"));
});

function shouldRouteRh(req) {
    const url = new URL(req.url, "http://0.0.0.0");
    return (
        rammerheadScopes.includes(url.pathname) ||
        rammerheadSession.test(url.pathname)
    );
}

function routeRhRequest(req, res) {
    rh.emit("request", req, res);
}

function routeRhUpgrade(req, socket, head) {
    rh.emit("upgrade", req, socket, head);
}

server.on("request", (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else if (shouldRouteRh(req)) {
        routeRhRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on("upgrade", (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else if (shouldRouteRh(req)) {
        routeRhUpgrade(req, socket, head);
    } else if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.end();
    }
});

server.on("listening", () => {
    const address = server.address();
    var theme = chalk.hex("#00FF7F");
    var host = chalk.hex("0d52bd");
    console.log(`Listening to ${chalk.bold(theme("Eclipse OS"))} on:`);

    console.log(`  ${chalk.bold(host("Local System:"))}            http://${address.family === "IPv6" ? `[${address.address}]` : addr.address}${address.port === 80 ? "" : ":" + chalk.bold(address.port)}`);

    console.log(`  ${chalk.bold(host("Local System:"))}            http://localhost${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`);

    try {
        console.log(`  ${chalk.bold(host("On Your Network:"))}  http://${address.ip()}${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`);
    } catch (err) {
        // can't find LAN interface
    }

    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
        console.log(`  ${chalk.bold(host("Replit:"))}           https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    }

    if (process.env.HOSTNAME && process.env.GITPOD_WORKSPACE_CLUSTER_HOST) {
        console.log(`  ${chalk.bold(host("Gitpod:"))}           https://${PORT}-${process.env.HOSTNAME}.${process.env.GITPOD_WORKSPACE_CLUSTER_HOST}`);
    }

    if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
        console.log(`  ${chalk.bold(host("Github Codespaces:"))}           https://${process.env.CODESPACE_NAME}-${address.port === 80 ? "" : "" + address.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`);
    }
});
server.listen({ port: PORT });
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    bareServer.close();
    process.exit(0);
}