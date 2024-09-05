import { useCallback, useEffect, useState } from "react";
import ResultGame from "./ResultGame";
import Guess from "./Guess";

const BOARD_SIZE = 6;
const WORD_SIZE = 5;
const INITIAL_STATE = Array.from({ length: BOARD_SIZE }, () => "");
const specialKeys = [
  "CapsLock",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "Escape",
  "Enter",
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Insert",
  "Delete",
  "Home",
  "End",
  "PageUp",
  "PageDown",
];

export default function BoardGame() {
  const [word, setWord] = useState("");
  const [answer, setAnswer] = useState<string[]>(INITIAL_STATE);
  const [stateGame, setStateGame] = useState<"playing" | "Win" | "Lose">("playing");
  const [turn, setTurn] = useState(0);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (stateGame == "playing" && !specialKeys.includes(event.key)) {
        switch (event.key) {
          case "Backspace":
            setAnswer((prev) => {
              const answerArr = [...prev];
              answerArr[turn] = answerArr[turn].slice(0, -1);
              return answerArr;
            });
            break;
          default:
            setAnswer((prev) => {
              const answerArr = [...prev];
              answerArr[turn] = answerArr[turn] + event.key;
              return answerArr;
            });

            if (answer[turn].length + 1 >= WORD_SIZE && turn + 1 == BOARD_SIZE) {
              setStateGame("Lose");
            } else if (answer[turn].length + 1 == WORD_SIZE) {
              setTurn((prev) => prev + 1);
            }
        }
      }
    },
    [answer, stateGame, turn]
  );

  const resetGame = () => {
    setAnswer(INITIAL_STATE);
    setTurn(0);
    setStateGame("playing");
    fetchWord();
  };
  const fetchWord = async () => {
    try {
      const result = await fetch(`https://random-word-api.herokuapp.com/word?length=${WORD_SIZE}`);
      const data = await result.json();
      setWord(data[0]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <section className="board-container">
      {stateGame !== "playing" && <ResultGame STATUS={stateGame} RESET_GAME={resetGame} WORD={word} />}
      {Array.from({ length: BOARD_SIZE }).map((_, index) => (
        <Guess WORD_SIZE={WORD_SIZE} ANSWER={answer[index]} key={index} WORD={word} CHANGE_STATUS={setStateGame} />
      ))}
    </section>
  );
}
