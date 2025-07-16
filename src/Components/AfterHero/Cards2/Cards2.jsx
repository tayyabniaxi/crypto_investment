import "./Cards2.css";

export default function Card2(props) {
  return (
    <div class="card-upper-body2">
      <img src={props.img} alt="my pic 1" id="picture1" />
      <button id="button-inside-card">
        <p class="card-text-new" id="card-text1-new">
          {props.para1}
        </p>
      </button>
      <p class="card-text-new" id="card-text2-new">
        {props.para2}
      </p>
    </div>
  );
}
