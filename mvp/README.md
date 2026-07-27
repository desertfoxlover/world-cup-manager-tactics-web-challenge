# If I Were Manager

> 2026 FIFA 월드컵 전술 웹서비스 — DAKER 해커톤 MVP

월드컵 대표팀 데이터를 올린 전술 보드에서 드래그로 라인업을 다시 쓰고,  
기본 배치와 비교해 **전술 점수·포지션 적합성** 피드백을 받는 감독 시뮬레이터.

## 핵심 기능

- **팀 선택** — 8개국 대표팀 (한국, 브라질, 아르헨티나, 프랑스, 독일, 스페인, 잉글랜드, 일본)
- **포메이션 변경** — 4-3-3, 4-2-3-1, 3-5-2, 4-4-2
- **드래그앤드롭** — 벤치 ↔ 피치 교체, 슬롯 간 스왑
- **인사이트 패널** — 실시간 전술 점수, 선수 스탯, 포지션 적합성
- **결과 카드** — 내 전술 vs 기본 라인업 비교

## 기술 스택

- Vite + React + TypeScript
- @dnd-kit/core (드래그앤드롭)
- Zustand (상태)
- 정적 JSON 데이터 (`public/data/`)

## 로컬 실행

```bash
cd mvp
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 빌드

```bash
npm run build
npm run preview
```

## 데이터

- `public/data/teams.json` — 팀·기본 라인업
- `public/data/players.json` — 선수 능력치 (0–100 정규화, 큐레이션 샘플)
- `public/data/formations.json` — 포메이션 슬롯 좌표

> 2026 최종 26인 스쿼드 확정 전 **데모용 샘플 데이터**입니다.  
> 출처·한계는 앱 푸터 및 팀 선택 화면에 표기.

## 배포 URL

https://wonderful-tapioca-0d2c73.netlify.app

## 라이선스

해커톤 제출용. 선수 실사·국가 엠블럼 미사용. 데이터는 공개 정보 수준 큐레이션.
