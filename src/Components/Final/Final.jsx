import "./Final.css";
import Questions from "./Questions/Questions";
import Last from "./Last/Last";

export default function Final(props){
    return(
        <div className="Final-Part">
            <div className="final-part-FAQs">
                <div className="main-heading1-final">
                    <p>FAQs ?</p>
                </div>
                <div className="main-faq-part">
                    <Questions paragraphNew="How long before I see results?"></Questions>
                    <Questions paragraphNew="How long before I see results?"></Questions>
                    <Questions paragraphNew="How long before I see results?"></Questions>
                    <Questions paragraphNew="How long before I see results?"></Questions>
                    <Questions paragraphNew="How long before I see results?"></Questions>
                    <Questions paragraphNew="How long before I see results?"></Questions>
                    <Questions paragraphNew="How long before I see results?"></Questions>
                    <Questions paragraphNew="How long before I see results?" className="id1"></Questions>
                </div>
            </div>
            <Last></Last>


        </div>
        
    );
}