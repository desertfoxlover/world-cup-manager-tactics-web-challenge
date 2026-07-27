# Research — 데이터 · 레퍼런스 메모

## 조사 목적

MVP용 **정적 JSON**을 만들기 위한 출처·필드·라이선스 메모.

---

## API / 데이터 후보 (런타임 의존 X, 스냅샷용)

| 이름 | URL | 비고 |
| --- | --- | --- |
| BallDontLie FIFA WC API | https://fifa.balldontlie.io/ | 키 필요. 2018/2022/2026. 빌드 시 덤프만 |
| TheStatsAPI WC Squads | https://www.thestatsapi.com/world-cup/squads | 상업 API. 키 필요 |
| Kaggle World Cup datasets | (검색: FIFA World Cup players) | 라이선스 확인 후 JSON 변환 |

---

## UI 레퍼런스 (조작감)

| 레퍼런스 | 배울 점 |
| --- | --- |
| Sofascore / FotMob 라인업 | 피치 위 번호 카드 밀도 |
| FM (Football Manager) 전술 화면 | 역할·멘탈리티는 과함 → **배치+역할**만 차용 |
| WhoScored formation view | 평균 위치 시각화 아이디어 |
| FIFA Ultimate Team chemistry | "적합성" 게이지 메타포 |

---

## 법적 · 브랜드

- [ ] 선수 실사 / 국가 엠블럼 사용 여부 결정 (기본: **미사용**)
- [ ] 폰트·아이콘 라이선스 기록
- [ ] 데이터 출처를 README + 앱 푸터에 표기

---

## 다음에 채울 것

- [ ] 사용할 팀 목록 (최소 8개국 권장, 이상적 16+)
- [ ] 팀당 선수 수 (GK 2~3 + Outfield 충분치, 총 ~18~26)
- [ ] overall 산출 방식 한 줄 정의
