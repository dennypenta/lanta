import newConfig from "./config";

const config = newConfig();

const server = Bun.serve({
    port: config.port,
    routes: {
        "/health": new Response(null, { status: 200 }),
    },
});

console.log(`Server running at ${server.url}`);
