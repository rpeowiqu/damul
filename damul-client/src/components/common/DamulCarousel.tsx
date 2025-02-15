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
        setsuggestedRecipe(response.data.suggestedRecipes);
      } catch (error: any) {
        console.log("레시피 정보를 받지 못했습니다.");
      }
    };
    fetchRecipeData();
  }, []);

  return (
    <Carousel
      plugins={[Autoplay({ delay: 2000 })]}
      setApi={setApi}
      opts={{ loop: true }}
      className="relative w-full"
    >
      <CarouselContent>
        {suggestedRecipe.length !== 0 &&
          suggestedRecipe.map((recipe, idx) => (
            <CarouselItem
              key={`${idx}-${recipe.recipeId}`}
              className="h-36 cursor-pointer"
              onClick={() => handleCarouselItemClick(idx)}
            >
              <div className="absolute w-full h-full p-6 bg-normal-600 bg-opacity-30 text-white">
                <div className="flex gap-1 ">
                  {recipe.recipeTags.map((tag, index) => {
                    return (
                      <div
                        key={`${index}-${tag.tagId}`}
                        className="font-thin text-xxs"
                      >{`#${tag.tagName}`}</div>
                    );
                  })}
                </div>
                <div className="font-bold text-2xl">{recipe.title}</div>
              </div>
              <img
                src={recipe.thumbnailUrl}
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
