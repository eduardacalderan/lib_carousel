import React from "react";

import "./styles/global.scss";
import { Carousel } from "./Carousel/Carousel";

import { CarouselProvider } from "./contexts/CarouselContext";

function App() {
  return (
    <>
      <CarouselProvider>
        <Carousel />
      </CarouselProvider>
    </>
  );
}

export default App;
