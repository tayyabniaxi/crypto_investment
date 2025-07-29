import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from "./Navbar/Navbar";
import Middle from './Middle-Section/Middle';
import AfterMiddle from './afterMiddle/AfterMiddle';
import Hero from './hero/Hero';
import AfterHero from "./AfterHero/AfterHero";
import Review from "./End/Review";
import Final from "./Final/Final";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollToId) {
      const el = document.getElementById(location.state.scrollToId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 0); 
      }
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <Middle />
      <AfterMiddle />
      <Hero />
      <AfterHero />
      <Review />
      <Final /> 
    </div>
  );
}
