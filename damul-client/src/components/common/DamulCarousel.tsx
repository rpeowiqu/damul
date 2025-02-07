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
import { UserRecipes } from "@/types/recipe";
import { useNavigate } from "react-router-dom";

const DamulCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const [suggestedRecipe, setsuggestedRecipe] = useState<UserRecipes>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(suggestedRecipe ? suggestedRecipe.suggestedRecipes.length : 0);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, suggestedRecipe?.suggestedRecipes.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/mocks/home/suggested-recipe-list.json");
        const data = await response.json();
        setsuggestedRecipe(data);
      } catch (err: any) {
        console.log("레시피 데이터를 받아오지 못했습니다.");
      }
    };
    fetchData();
  }, []);

  return (
    <Carousel
      plugins={[Autoplay({ delay: 2000 })]}
      setApi={setApi}
      opts={{ loop: true }}
      className="relative w-full"
    >
      <CarouselContent>
        {suggestedRecipe?.suggestedRecipes.map((recipe, idx) => (
          <CarouselItem
            key={`${idx}-${recipe.recipeId}`}
            className="h-36 cursor-pointer"
            onClick={() => {
              navigate("/community/recipe/1");
            }}
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
