import React, { useContext, useRef, useState } from "react";
import { CarouselContext } from "../contexts/CarouselContext";

import CarouselItem from "./CarouselItem";
import { getRefValue, useStateRef } from "../lib/hooks";
import { getTouchEventData } from "../lib/dom";

import "./Carousel.scss";

const MIN_SWIPE_REQUIRED = 40;

export function Carousel() {
  const { slides } = useContext(CarouselContext);

  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    setOffsetX(newOffsetX);
  };
  const onTouchEnd = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef);
    const containerWidth = getRefValue(containerWidthRef);
    let newOffsetX = getRefValue(offsetXRef);

    const diff = currentOffsetX - newOffsetX;

    // we need to check difference in absolute/positive value (if diff is more than 40px)
    if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
      if (diff > 0) {
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
      } else {
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }
    } else {
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentIdx(Math.abs(newOffsetX / containerWidth));

    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mouseup", onTouchEnd);
    window.removeEventListener("mousemove", onTouchMove);
  };
  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    setIsSwiping(true);

    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;

    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    containerWidthRef.current = containerWidth;
    minOffsetXRef.current = containerWidth - containerEl.scrollWidth;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchEnd);
  };
  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    setCurrentIdx(idx);
    setOffsetX(-(containerWidth * idx));
  };

  return (
    <div
      className="swiper-container"
      onTouchStart={onTouchStart}
      onMouseDown={onTouchStart}
    >
      <div className="row">
        <ul
          ref={containerRef}
          className={`swiper-list ${isSwiping ? "is-swiping" : ""}`}
          style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
        >
          <div className="cards">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} id={slide.id} nome={slide.nome} />
            ))}
          </div>
        </ul>
      </div>
      <ul className="swiper-indicator">
        {slides.map((_slide, idx) => (
          <li
            key={idx}
            className={`swiper-indicator-item ${
              currentIdx === idx ? "active" : ""
            }`}
            onClick={() => indicatorOnClick(idx)}
            data-testid="indicator"
          />
        ))}
      </ul>
    </div>
  );
}
