import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const docsDir = path.join(root, "docs");
const shotsDir = path.join(docsDir, "proposal", "screenshots");
const outDir = path.join(docsDir, "proposal");
mkdirSync(outDir, { recursive: true });

function img(name) {
  const buf = readFileSync(path.join(shotsDir, name));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<title>If I Were Manager — 기획서</title>
<style>
  @page { margin: 18mm 16mm; }
  body { font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; color: #222; line-height: 1.6; font-size: 11pt; max-width: 720px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 22pt; border-bottom: 2px solid #333; padding-bottom: 6px; margin-top: 0; }
  h2 { font-size: 14pt; margin-top: 28px; page-break-after: avoid; }
  h3 { font-size: 12pt; margin-top: 16px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
  th, td { border: 1px solid #bbb; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #f4f4f4; }
  .cover { text-align: center; padding: 56px 0 40px; page-break-after: always; }
  .cover h1 { border: none; font-size: 26pt; margin-bottom: 8px; }
  .cover .sub { color: #444; margin: 12px 0 24px; font-size: 11pt; }
  .cover .meta { font-size: 10pt; color: #555; line-height: 1.8; }
  img { width: 100%; border: 1px solid #ccc; margin: 8px 0 4px; }
  .caption { font-size: 9pt; color: #777; margin-bottom: 18px; }
  pre { background: #f5f5f5; padding: 10px; font-size: 9pt; }
  .note { font-size: 9pt; color: #666; }
  ul, ol { padding-left: 20px; }
  li { margin: 4px 0; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>

<div class="cover">
  <h1>If I Were Manager</h1>
  <p class="sub">월드컵 전술 웹서비스 기획서</p>
  <p class="meta">
    DAKER 해커톤 2026 · 궉기원<br/>
    제출: 2026-07-22<br/>
    데모: wonderful-tapioca-0d2c73.netlify.app
  </p>
</div>

<h2>1. 뭘 만드는지</h2>
<p>
  경기 보면서 "나라면 손흥민을 여기 뒀을 텐데" 같은 말 자주 하잖아요.
  근데 그걸 말로만 하면 끝이고, 실제로 보드에 옮겨서 숫자로 비교해 볼 데가 없어서 만들었습니다.
</p>
<p>
  <strong>If I Were Manager</strong>는 대표팀 라인업을 전술 보드에 띄워 놓고,
  드래그로 선수를 바꾸거나 포메이션을 바꾸면 점수가 같이 움직입니다.
  로그인 없이 URL만 열면 됩니다.
</p>
<p>
  아래 내용은 이미 배포해 둔 데모 기준입니다. 스크린샷도 실제 화면입니다.
</p>

<h2>2. 감독 경험을 어떻게 옮겼는지</h2>
<p>대회에서 요구하는 드래그·배치·조작에 맞춰 이렇게 대응했습니다.</p>
<table>
  <tr><th>감독이 하는 일</th><th>앱에서</th></tr>
  <tr><td>포메이션 고르기</td><td>4-3-3, 4-2-3-1, 3-5-2, 4-4-2 중 선택</td></tr>
  <tr><td>선수 올리고 내리기</td><td>벤치 ↔ 피치 드래그, 슬롯끼리 스왑</td></tr>
  <tr><td>선수 컨디션 보기</td><td>카드 클릭 → PAC/SHO/PAS/DEF/PHY</td></tr>
  <tr><td>전술이 맞는지 감 잡기</td><td>오른쪽 패널에 종합·포지션·밸런스 점수</td></tr>
  <tr><td>결정 내리기</td><td>전술 확정 → 원래 라인업이랑 비교</td></tr>
</table>
<p>설명 글보다 손으로 움직이는 쪽이 먼저 보이게 UI를 잡았습니다.</p>

<h2>3. 화면 구성</h2>
<table>
  <tr><th>화면</th><th>하는 일</th></tr>
  <tr><td>Landing</td><td>서비스 소개, 시작 버튼</td></tr>
  <tr><td>Select</td><td>8개국 중 팀 선택</td></tr>
  <tr><td>Board</td><td>전술 보드 (메인)</td></tr>
  <tr><td>Result</td><td>내 전술 vs 기본 라인업 점수</td></tr>
</table>
<p>흐름: Landing → 팀 선택 → 보드에서 손보기 → 전술 확정 → 결과</p>

<h2 class="page-break">4. 구현 화면</h2>
<h3>랜딩</h3>
<img src="${img("01-landing.png")}" alt="Landing"/>
<p class="caption">시작 화면</p>

<h3>팀 선택</h3>
<img src="${img("02-select.png")}" alt="Select"/>
<p class="caption">한국·브라질 등 8개국</p>

<h3>전술 보드</h3>
<img src="${img("03-board.png")}" alt="Board"/>
<p class="caption">포메이션, 벤치, 피치, 점수 패널</p>

<h3>결과</h3>
<img src="${img("04-result.png")}" alt="Result"/>
<p class="caption">기본 라인업과 점수 비교</p>

<h2>5. 할 수 있는 조작</h2>
<ul>
  <li>포메이션 바꾸기 (선수 위치 자동 재배치)</li>
  <li>벤치에서 피치로 드래그</li>
  <li>피치 안에서 선수끼리 자리 바꾸기</li>
  <li>피치에서 벤치로 내리기</li>
  <li>선수 클릭해서 스탯 보기</li>
  <li>배치 바꿀 때마다 전술 점수 갱신</li>
  <li>전술 확정 후 결과 화면</li>
</ul>
<p>AI 전술 추천은 시간 안 되면 빼기로 했습니다. 터치 드래그는 @dnd-kit으로 맞춰 둔 상태입니다.</p>

<h2>6. 데이터</h2>
<p>
  팀·선수·포메이션 좌표를 JSON으로 넣었습니다. API는 안 씁니다.
  2026 최종 26인이 아직 안 나와서, 2022 월드컵 + 올해 예상 스쿼드를 섞은 샘플이고
  화면 아래에 "샘플 데이터"라고 적어 뒀습니다.
</p>
<table>
  <tr><th>항목</th><th>내용</th></tr>
  <tr><td>국가</td><td>한국, 브라질, 아르헨티나, 프랑스, 독일, 스페인, 잉글랜드, 일본</td></tr>
  <tr><td>스탯</td><td>PAC / SHO / PAS / DEF / PHY / OVR (0~100)</td></tr>
  <tr><td>파일</td><td>teams.json, players.json, formations.json</td></tr>
</table>

<h3>점수 계산</h3>
<pre>전술 점수 = 종합 45% + 포지션 맞음 35% + 포지션 밸런스 20%</pre>
<p>
  종합은 선발 11명 OVR 평균, 포지션 맞음은 슬롯이랑 선수 포지션이 얼마나 맞는지,
  밸런스는 수비·미드·공격 비율이 어색한지 봅니다. 완벽한 시뮬은 아니고 비교용 지표입니다.
</p>

<h2>7. 사용 흐름 (시연용)</h2>
<ol>
  <li>랜딩에서 시작</li>
  <li>대한민국 선택 → 4-3-3 기본 라인업 로드</li>
  <li>4-2-3-1로 바꿔 보기</li>
  <li>손흥민·황희찬 위치 바꿔 보고 점수 변화 확인</li>
  <li>전술 확정 → 원래 라인업이랑 비교</li>
</ol>
<p>영상은 이 순서대로 2분 안쪽으로 찍을 예정입니다.</p>

<h2>8. 기술 · 범위</h2>
<table>
  <tr><th>항목</th><th>내용</th></tr>
  <tr><td>스택</td><td>Vite, React, TypeScript, @dnd-kit, Zustand</td></tr>
  <tr><td>배포</td><td>Netlify (완료)</td></tr>
  <tr><td>이번에 안 하는 것</td><td>실시간 경기, 회원가입, 경기 시뮬, AI 채팅</td></tr>
</table>
<table>
  <tr><th>제출물</th><th>마감</th><th>상태</th></tr>
  <tr><td>기획서</td><td>7/27</td><td>본 문서</td></tr>
  <tr><td>배포 URL</td><td>8/3</td><td>완료</td></tr>
  <tr><td>GitHub</td><td>8/3</td><td>정리 예정</td></tr>
  <tr><td>시연 영상</td><td>8/3</td><td>촬영 예정</td></tr>
</table>

<p class="note" style="margin-top:28px;text-align:center;">궉기원 · If I Were Manager · 샘플 데이터 사용</p>
</body>
</html>`;

const htmlPath = path.join(outDir, "proposal.html");
const pdfPath = path.join(outDir, "If-I-Were-Manager-proposal.pdf");
writeFileSync(htmlPath, html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
});
await browser.close();

console.log(`PDF: ${pdfPath}`);
console.log(`HTML: ${htmlPath}`);
