import { useEffect, useState } from "react";

type Props = { STATUS: "Win" | "Lose"; RESET_GAME: () => void; WORD: string };

export default function ResultGame({ STATUS, RESET_GAME, WORD }: Props) {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResult(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!showResult) return;

  return (
    <div className="result-modal">
      <div className="result-container">
        <div className="result-content">
          <span>You {STATUS}</span>
          <span>Correct answer: {WORD}</span>
        </div>
        <button onClick={RESET_GAME}>Play again!</button>
      </div>
    </div>
  );
}
