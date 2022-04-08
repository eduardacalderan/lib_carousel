import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface Props {
  id: number;
  nome: string;
}

interface CarouselContextData {
  slides: Props[];
}

interface CarouselProviderProps {
  children: ReactNode;
}

export const CarouselContext = createContext({} as CarouselContextData);

export function CarouselProvider({ children }: CarouselProviderProps) {
  const [slides, setSlides] = useState<Props[]>([]);

  useEffect(() => {
    api.get<Props[]>("slides").then((response) => {
      setSlides(response.data);
    });
  }, []);
  return (
    <CarouselContext.Provider value={{ slides }}>
      {children}
    </CarouselContext.Provider>
  );
}
