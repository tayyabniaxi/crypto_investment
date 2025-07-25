import myIMG1 from "../../Assets/1.png";
import myIMG2 from "../../Assets/2.png";
import myIMG3 from "../../Assets/3.png";
import myIMG4 from "../../Assets/4.png";
import "./AfterMiddle.css";
export default function AfterMiddle() {
    return (

        <div id="main-div1">
            <marquee direction="left" scrollamount="10">
                <ul>
                    <li>
                        <img src={myIMG1} alt="1" />
                    </li>
                    <li>
                        <img src={myIMG2} alt="2" />

                    </li>
                    <li>
                        <img src={myIMG3} alt="3" />
                    </li>
                    <li>
                        <img src={myIMG4} alt="4" />
                    </li>
                </ul>
            </marquee>
        </div>

    );
};