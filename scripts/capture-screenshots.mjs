import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs", "proposal", "screenshots");
const baseUrl = process.argv[2] ?? "https://wonderful-tapioca-0d2c73.netlify.app";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, "01-landing.png"), fullPage: false });

await page.getByRole("button", { name: "감독 모드 시작" }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outDir, "02-select.png"), fullPage: false });

await page.getByRole("button", { name: "대한민국" }).click();
await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(outDir, "03-board.png"), fullPage: false });

await page.getByRole("button", { name: "전술 확정" }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, "04-result.png"), fullPage: false });

await browser.close();
console.log(`Saved screenshots to ${outDir}`);
