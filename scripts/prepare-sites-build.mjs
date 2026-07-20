import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const serverDir = path.join(distDir, "server");
const openAiDir = path.join(distDir, ".openai");

fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(openAiDir, { recursive: true });
fs.copyFileSync(path.join(root, ".openai", "hosting.json"), path.join(openAiDir, "hosting.json"));

const workerSource = `export default {
  async fetch(request, env) {
    if (!env || !env.ASSETS) {
      return new Response("Static asset binding is not available.", { status: 500 });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;

    const indexUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
`;

fs.writeFileSync(path.join(serverDir, "index.js"), workerSource);
console.log("Prepared Sites build output.");
