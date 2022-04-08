import React from "react";

import "./CarouselItem.scss";

interface Props {
  id: number;
  nome: string;
}

function CarouselItem(props: Props) {
  return (
    <div className="swiper-item">
      <div className="col " draggable={false}>
        {props.nome}
      </div>
    </div>
  );
}

export default CarouselItem;
