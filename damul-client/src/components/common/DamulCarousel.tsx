import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// import noImage from "@/assets/noImage.jpeg";
import foodImage from "@/assets/foodImage.png";

const DamulCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      plugins={[Autoplay({ delay: 2000 })]}
      setApi={setApi}
      opts={{ loop: true }}
      className="relative w-full"
    >
      <CarouselContent>
        {Array.from({ length: 100 }).map((_, index) => (
          <CarouselItem key={index} className="h-36">
            <div className="absolute w-full p-6 text-white">
              <div className="font-thin text-xxs">#국민 반찬 #한끼 뚝딱</div>
              <div className="text-2xl">제육볶음</div>
            </div>
            <img
              src={foodImage}
              className="object-cover w-full h-full"
              alt="캐러셀이미지"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute flex items-center px-2 py-1 space-x-2 text-sm text-white bottom-2 right-2">
        <CarouselPrevious className="bg-transparent border-2 border-white" />
        <div>{`${current} / ${count}`}</div>
        <CarouselNext className="bg-transparent border-2 border-white" />
      </div>
    </Carousel>
  );
};

export default DamulCarousel;
