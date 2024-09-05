import { memo } from "react";

type Props = {
  WORD_SIZE: number;
  ANSWER: string;
  WORD: string;
  CHANGE_STATUS: (status: "playing" | "Win" | "Lose") => void;
};

function Guess({ WORD_SIZE, ANSWER, WORD, CHANGE_STATUS }: Props) {
  const checkWord = (index: number) => {
    const word = WORD?.toLowerCase();
    const answer = ANSWER?.toLowerCase();
    if (answer.length !== WORD_SIZE) return {};
    if (word == answer) {
      CHANGE_STATUS("Win");
      return { backgroundColor: "#0080006b", transition: "all 0.5s linear" };
    } else if (word[index] == answer[index]) {
      return { backgroundColor: "#0080006b", transition: "all 0.5s linear" };
    } else if (word.includes(answer[index])) {
      return { backgroundColor: "#ffff00a6", transition: "all 0.5s linear" };
    } else {
      return { backgroundColor: "#ff000059", transition: "all 0.5s linear" };
    }
  };

  return (
    <div className="guess-container">
      {Array.from({ length: WORD_SIZE }).map((_, index) => (
        <div className="guess-square" key={index} style={checkWord(index)}>
          {ANSWER[index] || ""}
        </div>
      ))}
    </div>
  );
}

export default memo(Guess);
