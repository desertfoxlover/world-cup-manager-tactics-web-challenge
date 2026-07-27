import { useGameStore } from "../store/gameStore";

export function LandingPage() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="landing-page">
      <div className="landing-bg" />
      <div className="landing-content">
        <p className="landing-badge">2026 FIFA World Cup Challenge</p>
        <h1 className="landing-title">
          If I Were
          <br />
          <span>Manager</span>
        </h1>
        <p className="landing-sub">
          월드컵 대표팀 데이터로 전술 보드를 열고, 드래그 한 번으로 라인업을
          다시 쓰세요. 실제 배치와 비교해 <strong>왜 내 전술이 다른지</strong>{" "}
          숫자로 확인합니다.
        </p>
        <button
          type="button"
          className="btn primary large"
          onClick={() => setScreen("select")}
        >
          감독 모드 시작
        </button>
        <ul className="landing-features">
          <li>드래그앤드롭 전술 보드</li>
          <li>포메이션 변경 · 선수 교체</li>
          <li>실시간 전술 점수 피드백</li>
        </ul>
      </div>
    </div>
  );
}
