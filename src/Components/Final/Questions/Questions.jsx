import "./Questions.css";
import { useState } from "react";

export default function Questions({ question, answer, className }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="main-q-1" id={className}>
      <div className="sub-q-1">
        <p>{question}</p>
        <div id="button-div">
          <button id="button1" onClick={toggleAnswer} aria-expanded={isOpen}>
            {isOpen ? "-" : "+"}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="answer-content">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
