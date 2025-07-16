import "./Final.css";
import Questions from "./Questions/Questions";
import Last from "./Last/Last";
import faqData from "./faqData";

export default function Final(props) {
  return (
    <div className="Final-Part">
      <div className="final-part-FAQs" id="FAQs">
        <div className="main-heading1-final">
          <p>FAQs ?</p>
        </div>
        <div className="main-faq-part">
          {faqData.map((faq) => (
            <Questions
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              className={faq.id === 8 ? "id1" : ""}
            />
          ))}
        </div>
      </div>
      <Last></Last>
    </div>
  );
}
