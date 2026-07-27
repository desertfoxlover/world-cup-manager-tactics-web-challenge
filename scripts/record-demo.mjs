/**
 * Playwright demo recorder — ~3 min, Korean captions, multi-variation flow.
 * Usage: node scripts/record-demo.mjs [baseUrl]
 */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import http from "node:http";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "deliverables");
const videoDir = path.join(outDir, "record-raw");
const captionsPath = path.join(outDir, "demo-captions.json");

fs.mkdirSync(videoDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

/** Formal Korean (합니다체) — same beats as the short demo */
const CAPTIONS = [
  { at: 0, text: "월드컵을 보며, 나라면 이렇게 짜봤을 텐데… 해보신 적 있으십니까?" },
  { at: 5, text: "If I Were Manager입니다. 로그인 없이, 바로 보드로 들어갑니다." },
  { at: 10, text: "감독 모드부터 켜보겠습니다." },
  { at: 14, text: "대표팀 여덟 개국이 있습니다. 오늘은 대한민국으로 가보겠습니다." },
  { at: 20, text: "기본은 4-3-3입니다. 피치에 선발, 옆에 벤치, 오른쪽에 점수가 붙습니다." },
  { at: 28, text: "손흥민 카드를 누르면 PAC, SHO 같은 스탯이 바로 뜹니다." },
  { at: 35, text: "포메이션만 바꿔도 자리가 다시 잡힙니다. 4-2-3-1로 한 번 보겠습니다." },
  { at: 43, text: "3-5-2도 해보겠습니다. 미드가 두꺼워지는 느낌이 납니다." },
  { at: 51, text: "4-4-2까지 훑어보고, 다시 4-3-3으로 돌아가겠습니다." },
  { at: 60, text: "손흥민과 황희찬 자리만 바꿔보겠습니다. 드래그하면 끝입니다." },
  { at: 70, text: "점수와 포지션 적합이 같이 움직입니다. 감으로만 하던 것을 숫자로 보는 것입니다." },
  { at: 79, text: "벤치에서 이재성을 끌어올려 교체도 해보겠습니다." },
  { at: 90, text: "원하시면 초기화로 기본 라인업으로 되돌릴 수 있습니다." },
  { at: 98, text: "이 정도면 됐다 싶으면 전술을 확정합니다." },
  { at: 103, text: "내 전술과 기본 라인업이 나란히 비교됩니다." },
  { at: 111, text: "변경한 자리도 표시되고, 한 줄 코멘트도 같이 나옵니다." },
  { at: 119, text: "다른 팀도 같은 루프입니다. 브라질로 한 번 더 가보겠습니다." },
  { at: 128, text: "브라질은 기본이 4-2-3-1입니다. 네이마르와 비니시우스가 보입니다." },
  { at: 137, text: "4-3-3으로 바꿔서 공격 라인을 다시 깔아보겠습니다." },
  { at: 146, text: "엔드리크를 벤치에서 올리면, 젊은 카드로 바꾸는 맛도 납니다." },
  { at: 158, text: "점수 변화만 보고도 배치가 맞는지 감이 옵니다." },
  { at: 166, text: "확정하면 또 비교 카드가 나옵니다. 팀만 바뀌어도 스토리는 같습니다." },
  { at: 175, text: "정리하면 — 팀 고르고, 드래그로 짜고, 숫자로 확인하는 감독 보드입니다." },
  { at: 184, text: "샘플 데이터 기준 데모이며, 키나 가입 없이 URL만 열면 됩니다." },
  { at: 192, text: "If I Were Manager — 여기까지가 핵심 루프입니다." },
];

fs.writeFileSync(captionsPath, JSON.stringify(CAPTIONS, null, 2), "utf8");

const CAPTION_CSS = `
#demo-caption-root {
  position: fixed;
  left: 0; right: 0; bottom: 40px;
  z-index: 99999;
  pointer-events: none;
  display: flex;
  justify-content: center;
  padding: 0 40px;
  font-family: "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif;
}
#demo-caption-root .cap {
  max-width: 940px;
  background: rgba(6, 12, 9, 0.86);
  color: #f3f6f1;
  font-size: 25px;
  line-height: 1.45;
  font-weight: 650;
  letter-spacing: -0.02em;
  padding: 13px 22px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 200ms ease, transform 200ms ease;
}
#demo-caption-root .cap.show {
  opacity: 1;
  transform: translateY(0);
}
`;

async function injectCaptionUi(page) {
  await page.addStyleTag({ content: CAPTION_CSS }).catch(() => {});
  await page.evaluate(() => {
    let root = document.getElementById("demo-caption-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "demo-caption-root";
      root.innerHTML = '<div class="cap" id="demo-caption"></div>';
      document.body.appendChild(root);
    }
  });
}

async function setCaption(page, text) {
  await injectCaptionUi(page);
  await page.evaluate((t) => {
    const el = document.getElementById("demo-caption");
    if (!el) return;
    el.classList.remove("show");
    el.textContent = t || "";
    if (t) requestAnimationFrame(() => el.classList.add("show"));
  }, text);
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function hold(page, text, ms) {
  await setCaption(page, text);
  await wait(ms);
}

async function dragCard(page, fromSel, toSel) {
  const from = page.locator(fromSel).first();
  const to = page.locator(toSel).first();
  await from.waitFor({ state: "visible", timeout: 8000 });
  await to.waitFor({ state: "visible", timeout: 8000 });
  const fromBox = await from.boundingBox();
  const toBox = await to.boundingBox();
  if (!fromBox || !toBox) throw new Error(`drag miss ${fromSel} -> ${toSel}`);
  const fx = fromBox.x + fromBox.width / 2;
  const fy = fromBox.y + fromBox.height / 2;
  const tx = toBox.x + toBox.width / 2;
  const ty = toBox.y + toBox.height / 2;
  await page.mouse.move(fx, fy);
  await page.mouse.down();
  await wait(200);
  await page.mouse.move(tx, ty, { steps: 24 });
  await wait(150);
  await page.mouse.up();
  await wait(500);
}

async function startPreviewServer() {
  const dist = path.join(root, "mvp", "dist");
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    throw new Error("mvp/dist missing — run npm --prefix mvp run build first");
  }
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
  };
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let filePath = path.join(dist, urlPath === "/" ? "index.html" : urlPath);
    if (!filePath.startsWith(dist)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(dist, "index.html");
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

const argUrl = process.argv[2];
const local = argUrl ? null : await startPreviewServer();
const baseUrl = argUrl ?? local.baseUrl;
console.log("Recording against", baseUrl);

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();
const t0 = Date.now();

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await injectCaptionUi(page);

  await hold(page, CAPTIONS[0].text, 5000);
  await hold(page, CAPTIONS[1].text, 4500);
  await hold(page, CAPTIONS[2].text, 1600);
  await page.getByRole("button", { name: "감독 모드 시작" }).click();
  await wait(900);

  await hold(page, CAPTIONS[3].text, 3800);
  await page.getByRole("button", { name: "대한민국" }).click();
  await wait(1300);

  await hold(page, CAPTIONS[4].text, 7000);
  await hold(page, CAPTIONS[5].text, 1200);
  await page.locator(".pitch-board .player-card", { hasText: "Son Heung-min" }).click();
  await wait(5500);

  await hold(page, CAPTIONS[6].text, 1200);
  await page.getByRole("button", { name: "4-2-3-1", exact: true }).click();
  await wait(6500);

  await hold(page, CAPTIONS[7].text, 1200);
  await page.getByRole("button", { name: "3-5-2", exact: true }).click();
  await wait(6500);

  await hold(page, CAPTIONS[8].text, 1200);
  await page.getByRole("button", { name: "4-4-2", exact: true }).click();
  await wait(3200);
  await page.getByRole("button", { name: "4-3-3", exact: true }).click();
  await wait(3200);

  await hold(page, CAPTIONS[9].text, 1200);
  await dragCard(
    page,
    '.pitch-board .player-card:has-text("Son Heung-min")',
    '.pitch-board .player-card:has-text("Hwang Hee-chan")',
  );
  await wait(4500);

  await hold(page, CAPTIONS[10].text, 8000);

  await hold(page, CAPTIONS[11].text, 1200);
  await dragCard(
    page,
    '.bench-panel .player-card:has-text("Lee Jae-sung")',
    '.pitch-board .player-card:has-text("Jeong Woo-yeong")',
  );
  await wait(7000);

  await hold(page, CAPTIONS[12].text, 1200);
  await page.getByRole("button", { name: "초기화" }).click();
  await wait(4500);

  // Leave a visible change for the result screen
  await page.getByRole("button", { name: "4-2-3-1", exact: true }).click();
  await wait(1000);
  await dragCard(
    page,
    '.pitch-board .player-card:has-text("Son Heung-min")',
    '.pitch-board .player-card:has-text("Hwang Hee-chan")',
  );
  await wait(1200);

  await hold(page, CAPTIONS[13].text, 2200);
  await page.getByRole("button", { name: "전술 확정" }).click();
  await wait(1000);

  await hold(page, CAPTIONS[14].text, 7000);
  await hold(page, CAPTIONS[15].text, 6500);

  await hold(page, CAPTIONS[16].text, 2000);
  await page.getByRole("button", { name: "다른 팀 선택" }).click();
  await wait(1000);

  await page.getByRole("button", { name: "브라질" }).click();
  await wait(1300);

  await hold(page, CAPTIONS[17].text, 7500);
  await hold(page, CAPTIONS[18].text, 1200);
  await page.getByRole("button", { name: "4-3-3", exact: true }).click();
  await wait(7000);

  await hold(page, CAPTIONS[19].text, 1200);
  try {
    await dragCard(
      page,
      '.bench-panel .player-card:has-text("Endrick")',
      '.pitch-board .player-card:has-text("Richarlison")',
    );
  } catch (e) {
    console.warn("Brazil sub skipped:", e.message);
  }
  await wait(8000);

  await hold(page, CAPTIONS[20].text, 6500);

  await hold(page, CAPTIONS[21].text, 1800);
  await page.getByRole("button", { name: "전술 확정" }).click();
  await wait(1000);
  await hold(page, CAPTIONS[21].text, 7000);

  await hold(page, CAPTIONS[22].text, 7500);
  await hold(page, CAPTIONS[23].text, 7000);
  await hold(page, CAPTIONS[24].text, 6500);
} catch (err) {
  console.error("Recording failed:", err);
  throw err;
} finally {
  const videoPath = await page.video().path();
  await context.close();
  await browser.close();
  if (local) local.server.close();

  const destWebm = path.join(outDir, "if-i-were-manager-demo.webm");
  fs.copyFileSync(videoPath, destWebm);
  console.log("Saved", destWebm);
  console.log("Elapsed", ((Date.now() - t0) / 1000).toFixed(1), "s");

  const toTs = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  };
  let srt = "";
  for (let i = 0; i < CAPTIONS.length; i++) {
    const cur = CAPTIONS[i];
    const end = CAPTIONS[i + 1]?.at ?? cur.at + 6;
    srt += `${i + 1}\n${toTs(cur.at)} --> ${toTs(Math.min(end - 0.2, cur.at + 7.5))}\n${cur.text}\n\n`;
  }
  const srtPath = path.join(outDir, "if-i-were-manager-demo.ko.srt");
  fs.writeFileSync(srtPath, srt, "utf8");
  console.log("Subtitles", srtPath);

  // Optional mp4 via ffmpeg if available on PATH
  const mp4Path = path.join(outDir, "if-i-were-manager-demo.mp4");
  await new Promise((resolve) => {
    const ff = spawn(
      "ffmpeg",
      ["-y", "-i", destWebm, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-an", mp4Path],
      { stdio: "ignore" },
    );
    ff.on("error", () => {
      console.log("ffmpeg not found — keeping webm (YouTube accepts webm)");
      resolve();
    });
    ff.on("close", (code) => {
      if (code === 0) console.log("Also wrote", mp4Path);
      else console.log("ffmpeg exit", code, "— keeping webm");
      resolve();
    });
  });
}
