import { useCallback, useEffect, useState } from "react";
import ResultGame from "./ResultGame";
import Guess from "./Guess";

const BOARD_SIZE = 6;
const WORD_SIZE = 5;
const INITIAL_STATE = Array.from({ length: BOARD_SIZE }, () => ({
  style: Array.from({ length: WORD_SIZE }, () => ({ backgroundColor: "", transition: "" })),
  value: "",
}));
const specialKeys = [
  "CapsLock",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "Escape",
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
  const [answer, setAnswer] = useState(INITIAL_STATE);
  const [stateGame, setStateGame] = useState<"playing" | "Win" | "Lose">("playing");
  const [turn, setTurn] = useState(0);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (stateGame == "playing" && !specialKeys.includes(event.key)) {
        switch (event.key) {
          case "Backspace":
            setAnswer((prev) => {
              const answerArr = prev.map((item) => ({ ...item }));
              answerArr[turn].value = answerArr[turn].value.slice(0, -1);
              return answerArr;
            });
            break;
          case "Enter":
            if (answer[turn].value.length >= WORD_SIZE && turn + 1 == BOARD_SIZE) {
              checkWord();
              setStateGame("Lose");
            } else if (answer[turn].value.length == WORD_SIZE) {
              checkWord();
              setTurn((prev) => prev + 1);
            }
            break;
          default:
            if (answer[turn].value.length !== WORD_SIZE) {
              setAnswer((prev) => {
                const answerArr = prev.map((item) => ({ ...item }));
                answerArr[turn].value = answerArr[turn].value + event.key.toUpperCase();
                return answerArr;
              });
            }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answer, stateGame, turn]
  );

  const checkWord = () => {
    const letterCount: {
      [key: string]: {
        correct: number;
        total: number;
      };
    } = {};
    const wordCompare = word?.toLowerCase();
    const answerCompare = answer[turn].value?.toLowerCase();
    const styles = Array.from({ length: WORD_SIZE }, () => ({
      backgroundColor: "",
      transition: "all 0.5s linear",
    }));

    const correctLetters = Array(answerCompare.length).fill(false);

    answerCompare.split("").forEach((letter, index) => {
      if (wordCompare[index] === answerCompare[index]) {
        styles[index].backgroundColor = "#0080006b";
        correctLetters[index] = true;
        if (!letterCount[letter]) {
          letterCount[letter] = { correct: 0, total: 0 };
        }
        letterCount[letter].correct++;
      }
    });

    // Segunda fase: letras en la posición incorrecta
    answerCompare.split("").forEach((letter, index) => {
      if (!correctLetters[index]) {
        const duplicateWordLetters = wordCompare.split(letter).length - 1;

        if (!letterCount[letter]) {
          letterCount[letter] = { correct: 0, total: 0 };
        }

        // Verifica si la letra existe en otra posición
        if (
          wordCompare.includes(letter) &&
          letterCount[letter].correct + letterCount[letter].total < duplicateWordLetters
        ) {
          styles[index].backgroundColor = "#ffff00a6";
          letterCount[letter].total++;
        } else {
          styles[index].backgroundColor = "#ff000059";
        }
      }
    });

    setAnswer((prev) => {
      const answerArr = prev.map((item) => ({ ...item }));
      answerArr[turn].style = styles;
      return answerArr;
    });
    if (wordCompare == answerCompare) return setStateGame("Win");
  };
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
        <Guess key={index} WORD_SIZE={WORD_SIZE} ANSWER={answer[index]} />
      ))}
    </section>
  );
}
