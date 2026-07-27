import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const videoPath = path.join(root, "deliverables", "if-i-were-manager-demo.webm");
const outDir = path.join(root, "deliverables", "frames-new");
fs.mkdirSync(outDir, { recursive: true });

const server = http.createServer((req, res) => {
  if (req.url === "/demo.webm") {
    res.writeHead(200, { "Content-Type": "video/webm" });
    fs.createReadStream(videoPath).pipe(res);
    return;
  }
  res.writeHead(404);
  res.end();
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.setContent(`<!DOCTYPE html><html><body style="margin:0;background:#000;height:100vh;display:flex;align-items:center;justify-content:center">
<video id="v" src="http://127.0.0.1:${port}/demo.webm" style="max-width:100%;max-height:100%"></video>
</body></html>`);

const duration = await page.evaluate(async () => {
  const v = document.getElementById("v");
  await new Promise((r, j) => {
    v.onloadedmetadata = () => r();
    v.onerror = () => j(new Error("load fail"));
    setTimeout(() => j(new Error("timeout")), 20000);
  });
  return v.duration;
});
console.log("duration", duration);

for (const t of [2, 22, 40, 65, 105, 140, 175]) {
  if (t > duration) continue;
  await page.evaluate(async (seek) => {
    const v = document.getElementById("v");
    v.currentTime = seek;
    await new Promise((r) => { v.onseeked = r; });
  }, t);
  await page.screenshot({ path: path.join(outDir, `t${t}.png`) });
  console.log("saved", t);
}
await browser.close();
server.close();
