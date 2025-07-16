import "./Cards3.css";

export default function Card3(props){
    return(
  <div class="card114">
   <img src={props.imgNew} alt="my pic 1" id="picture114"/>
    <p class="card-text" id="card-new-text1">{props.paragraph}</p>
</div>

);
};