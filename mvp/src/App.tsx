import { useEffect } from "react";
import { loadAllData } from "./lib/data";
import { useGameStore } from "./store/gameStore";
import { LandingPage } from "./pages/LandingPage";
import { SelectPage } from "./pages/SelectPage";
import { BoardPage } from "./pages/BoardPage";
import { ResultPage } from "./pages/ResultPage";
import "./App.css";

function App() {
  const screen = useGameStore((s) => s.screen);
  const dataLoaded = useGameStore((s) => s.dataLoaded);
  const initData = useGameStore((s) => s.initData);

  useEffect(() => {
    loadAllData()
      .then(({ teams, players, formations }) => initData(teams, players, formations))
      .catch((err) => console.error("Data load failed:", err));
  }, [initData]);

  if (!dataLoaded) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p>월드컵 데이터 로딩 중…</p>
      </div>
    );
  }

  return (
    <div className="app">
      {screen === "landing" && <LandingPage />}
      {screen === "select" && <SelectPage />}
      {screen === "board" && <BoardPage />}
      {screen === "result" && <ResultPage />}
      <footer className="app-footer">
        If I Were Manager · 샘플 데이터 (데모) · DAKER Hackathon 2026
      </footer>
    </div>
  );
}

export default App;
