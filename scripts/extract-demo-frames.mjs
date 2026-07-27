import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const videoPath = path.join(root, "deliverables", "if-i-were-manager-demo.mp4");
const outDir = path.join(root, "deliverables", "frames");
fs.mkdirSync(outDir, { recursive: true });

const server = http.createServer((req, res) => {
  if (req.url === "/demo.mp4") {
    res.writeHead(200, { "Content-Type": "video/mp4" });
    fs.createReadStream(videoPath).pipe(res);
    return;
  }
  res.writeHead(404);
  res.end();
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const { port } = server.address();
const url = `http://127.0.0.1:${port}/demo.mp4`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.setContent(`<!DOCTYPE html>
<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh">
<video id="v" src="${url}" crossorigin="anonymous" style="max-width:100%;max-height:100%"></video>
</body></html>`);

const duration = await page.evaluate(async () => {
  const v = document.getElementById("v");
  await new Promise((r, j) => {
    v.onloadedmetadata = () => r();
    v.onerror = () => j(new Error("video load failed"));
    setTimeout(() => j(new Error("timeout")), 15000);
  });
  return v.duration;
});
console.log("duration", duration);

const times = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 44];
for (const t of times) {
  if (t > duration) continue;
  await page.evaluate(async (seek) => {
    const v = document.getElementById("v");
    v.currentTime = seek;
    await new Promise((r) => {
      v.onseeked = r;
    });
  }, t);
  const name = `frame-${String(Math.floor(t)).padStart(2, "0")}.png`;
  await page.screenshot({ path: path.join(outDir, name), fullPage: false });
  console.log("saved", name);
}

await browser.close();
server.close();
