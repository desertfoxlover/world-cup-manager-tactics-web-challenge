# 04. 기술 스택 · 데이터 · 배포 초안

## 권장 스택 (바이브 코딩 친화 · 빠른 배포)

| 레이어 | 선택 | 이유 |
| --- | --- | --- |
| 프레임워크 | **Vite + React + TypeScript** | 속도, 생태계, Cursor와의 궁합 |
| 스타일 | CSS Modules 또는 Tailwind | 전술 보드 UI 빠른 조정 |
| DnD | `@dnd-kit/core` 또는 포인터 기반 커스텀 | 터치/마우스 동시 대응 |
| 상태 | React state / Zustand (필요 시) | 보드 상태 단순 유지 |
| 데이터 | **정적 JSON** (`/public/data`) | 심사자 키 불필요 · 오프라인 안정 |
| 배포 | **Netlify** 또는 Vercel | 정적/SSR 모두 쉬움, 무료 티어 |
| (선택) AI | Netlify AI Gateway 또는 규칙 엔진 | 키를 심사자에게 요구하지 않음 |

대안: Next.js도 가능하나, **순수 클라이언트 보드**면 Vite가 더 단순.

---

## 아키텍처 (초안)

```
[Landing] → [Team / Match Select] → [Tactics Board]
                                      ├ pitch + DnD players
                                      ├ formation presets
                                      ├ bench / substitute
                                      └ insight panel (stats / fit / diff)
                                 → [Result Card]
```

- 서버 필수는 아님. JSON fetch만으로 MVP 가능.
- AI를 넣을 경우: 브라우저 → serverless function → gateway (키 서버측).

---

## 데이터 전략 (핵심)

### 원칙

1. **번들된 데이터로 심사 가능**하게 만든다.  
2. 유료/키 API는 "있으면 좋은 보너스"로만.  
3. 선수·팀 **비하 금지**, 초상/로고는 라이선스 주의 → 가능하면 **이니셜 아바타 + 공개 정보 수준 스탯**.

### 권장 데이터셋 구성

```
mvp/public/data/
  teams.json          # 국가, 그룹, FIFA 코드
  players.json        # 선수 id, 이름, 포지션, 능력치(정규화)
  formations.json     # 4-3-3, 4-2-3-1, 3-5-2 … 슬롯 좌표
  matches.sample.json # (선택) What-if용 기준 라인업
```

### 소스 후보

| 소스 | 용도 | 주의 |
| --- | --- | --- |
| 직접 큐레이션 JSON (2022 WC + 2026 확정 국가) | MVP 메인 | 저작권·정확성 표기 |
| Kaggle 등 오픈 월드컵 스탯 | 능력치 보강 | 라이선스 확인 |
| BallDontLie FIFA / TheStatsAPI 등 | 조사·보강 | **키 필요 → 런타임 의존 금지**, 빌드 시 스냅샷만 |
| FIFA 공식 오픈 자료 | 일정·팀 목록 | 로고 사용 제한 가능 |

> 2026 최종 26인 스쿼드는 대회 직전 확정이 많음.  
> **MVP는 "대표팀 예상/샘플 스쿼드 + 투명한 출처 표기"**로 가도 충분.  
> 기획서에 데이터 기준일·한계를 명시.

### 플레이어 스탯 최소 필드

```ts
type Player = {
  id: string;
  name: string;
  teamId: string;
  pos: "GK" | "DF" | "MF" | "FW";
  number?: number;
  // 0–100 정규화 (출처 명시)
  pace?: number;
  shooting?: number;
  passing?: number;
  defending?: number;
  physical?: number;
  overall: number;
};
```

### 포메이션 슬롯

```ts
type Slot = { id: string; role: string; x: number; y: number }; // pitch % 좌표
type Formation = { id: string; name: string; slots: Slot[] };
```

---

## 핵심 인터랙션 명세 (구현 체크)

| ID | 인터랙션 | 완료 조건 |
| --- | --- | --- |
| I1 | 포메이션 프리셋 선택 | 슬롯 11개가 좌표에 배치됨 |
| I2 | 벤치 ↔ 피치 드래그앤드롭 | 선수 교체 반영, 중복 배치 방지 |
| I3 | 피치 내 슬롯 간 이동 | 자리 스왑 |
| I4 | 선수 클릭 → 스탯/적합성 | 패널에 수치 표시 |
| I5 | 전술 점수/비교 업데이트 | 조작 즉시 인사이트 갱신 |
| I6 | 결과 카드 생성 | 라인업 요약 + 점수 |

---

## 폴더 예상 (`mvp/`)

```
mvp/
  package.json
  index.html
  src/
    App.tsx
    components/PitchBoard.tsx
    components/Bench.tsx
    components/InsightPanel.tsx
    lib/formation.ts
    lib/score.ts
  public/data/*.json
  README.md
```

---

## 배포 체크

- [ ] `npm run build` 성공
- [ ] Netlify/Vercel 프로덕션 URL 고정
- [ ] SPA fallback (`/* → index.html`) 설정
- [ ] HTTPS, 외부 네트워크에서 접속 확인
