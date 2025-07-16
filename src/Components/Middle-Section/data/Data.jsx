import "./Data.css";
import myimage1 from "../../../Assets/button.png"
export default function Data(){
    return(
        <div>
            <div className="div1">
                <div className="div2">
                    <p>EARN SMART WITH SEA SHELL</p>
                </div>
                <div className="div3">
                    <p>Start earning daily profits with trusted investment plans.</p>
                </div>
                <div className="div4">
                  <button><img src={myimage1} alt="myimage"/></button>
                </div>
            </div>

        </div>
    );
};