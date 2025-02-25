import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import Autoplay from "embla-carousel-autoplay";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SuggestedRecipe } from "@/types/recipe";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

interface DamulCarouselProps {
  fetchFn: () => Promise<AxiosResponse>;
}

const DamulCarousel = ({ fetchFn }: DamulCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const [suggestedRecipe, setsuggestedRecipe] = useState<SuggestedRecipe[]>([]);

  const handleCarouselItemClick = (idx: number) => {
    navigate(`/community/recipe/${suggestedRecipe[idx].recipeId}`);
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(suggestedRecipe ? suggestedRecipe.length : 0);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, suggestedRecipe?.length]);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await fetchFn();

        if (response.status === 204) {
          setsuggestedRecipe([]);
        } else {
          setsuggestedRecipe(response.data.suggestedRecipes);
        }
      } catch (error: any) {
        // console.log("레시피 정보를 받지 못했습니다.");
      }
    };
    fetchRecipeData();
  }, []);

  return (
    <Carousel
      plugins={[Autoplay({ delay: 3000 })]}
      setApi={setApi}
      opts={{ loop: true }}
      className="relative w-full"
    >
      <CarouselContent>
        {suggestedRecipe === null || suggestedRecipe.length === 0
          ? Array.from({ length: 3 }).map((_, idx) => (
              <CarouselItem key={idx} className="h-36">
                <Skeleton className="w-full h-full" />
              </CarouselItem>
            ))
          : suggestedRecipe.map((recipe, idx) => (
              <CarouselItem
                key={`${idx}-${recipe.recipeId}`}
                className="h-36 cursor-pointer"
                onClick={() => handleCarouselItemClick(idx)}
              >
                <div className="absolute w-full h-full p-6 bg-gradient-to-r from-black/65 text-white">
                  <p className="text-xs sm:text-sm text-positive-200 font-bold">
                    이런 메뉴는 어떠세요?
                  </p>
                  <p className="text-lg sm:text-xl font-extrabold">
                    {recipe.title}
                  </p>
                </div>
                <img
                  src={recipe.thumbnailUrl}
                  className="object-cover w-full h-full"
                  alt="캐러셀 이미지"
                />
              </CarouselItem>
            ))}
      </CarouselContent>

      <div className="absolute w-28 flex justify-center items-center text-center text-sm text-white font-bold bottom-3 right-3">
        <CarouselPrevious className="bg-transparent border-2 border-white" />
        <div className="flex-1">{`${current} / ${count}`}</div>
        <CarouselNext className="bg-transparent border-2 border-white" />
      </div>
    </Carousel>
  );
};

export default DamulCarousel;
