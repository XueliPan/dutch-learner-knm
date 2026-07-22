import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const serverDir = path.join(distDir, "server");
const openAiDir = path.join(distDir, ".openai");

fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(openAiDir, { recursive: true });
fs.copyFileSync(path.join(root, ".openai", "hosting.json"), path.join(openAiDir, "hosting.json"));

const lessonMediaSource = path.join(root, "assets", "lesson-media");
const lessonMediaTarget = path.join(distDir, "assets", "lesson-media");
if (fs.existsSync(lessonMediaSource)) {
  fs.rmSync(lessonMediaTarget, { recursive: true, force: true });
  fs.cpSync(lessonMediaSource, lessonMediaTarget, { recursive: true });
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "server" || entry.name === ".openai") return [];
      return walkFiles(fullPath);
    }
    return [fullPath];
  });
}

const files = Object.fromEntries(
  walkFiles(distDir).map((filePath) => {
    const route = `/${path.relative(distDir, filePath).split(path.sep).join("/")}`;
    return [
      route,
      {
        contentType: mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        body: fs.readFileSync(filePath).toString("base64"),
      },
    ];
  }),
);

files["/"] = files["/index.html"];

const workerSource = `const files = ${JSON.stringify(files)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const route = files[url.pathname] ? url.pathname : "/index.html";
    const file = files[route];
    if (!file) return new Response("Not found", { status: 404 });

    return new Response(decodeBase64(file.body), {
      headers: {
        "content-type": file.contentType,
        "cache-control": route === "/index.html" || route === "/" ? "no-cache" : "public, max-age=31536000, immutable",
      },
    });
  },
};
`;

fs.writeFileSync(path.join(serverDir, "index.js"), workerSource);
console.log("Prepared Sites build output.");
