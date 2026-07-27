import { useGameStore } from "../store/gameStore";

export function FormationSelector() {
  const formations = useGameStore((s) => s.formations);
  const formationId = useGameStore((s) => s.formationId);
  const setFormation = useGameStore((s) => s.setFormation);

  return (
    <div className="formation-selector">
      <h3 className="panel-title">포메이션</h3>
      <div className="formation-buttons">
        {formations.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`formation-btn ${f.id === formationId ? "active" : ""}`}
            onClick={() => setFormation(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}
