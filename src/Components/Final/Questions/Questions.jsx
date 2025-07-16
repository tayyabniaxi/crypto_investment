import "./Questions.css";
export default function Questions(props){
    return(
        <div className="main-q-1" id={props.className}>
                        <div className="sub-q-1">
                            <p>{props.paragraphNew}</p>
                            <div id="button-div" ><button id="button1">+</button></div>
                        </div>
                    </div>
    );
};