import Navbar from "./Navbar/Navbar";
import Middle from './Middle-Section/Middle';
import AfterMiddle from './afterMiddle/AfterMiddle';
import Hero from './hero/Hero';
import AfterHero from "./AfterHero/AfterHero";
import Review from "./End/Review";
import Final from "./Final/Final";


export default function HomePage(){
    return(
        <div>
            <Navbar></Navbar>
            <Middle></Middle>
            <AfterMiddle></AfterMiddle>
            <Hero></Hero>
            <AfterHero></AfterHero>
            <Review></Review>
            <Final></Final>
        </div>
    );
};