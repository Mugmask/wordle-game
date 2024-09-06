import { memo } from "react";

type Props = {
  WORD_SIZE: number;
  ANSWER: {
    style: {
      backgroundColor: string;
      transition: string;
    }[];
    value: string;
  };
};

function Guess({ WORD_SIZE, ANSWER }: Props) {
  return (
    <div className="guess-container">
      {Array.from({ length: WORD_SIZE }).map((_, index) => (
        <div className="guess-square" key={index} style={ANSWER.style[index]}>
          {ANSWER?.value[index] || ""}
        </div>
      ))}
    </div>
  );
}

export default memo(
  Guess,
  (prevProp, newProp) => prevProp.ANSWER.value == newProp.ANSWER.value && prevProp.ANSWER.style == newProp.ANSWER.style
);
