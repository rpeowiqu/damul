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
import { SuggestedRecipe } from "@/types/recipe";
import { useNavigate } from "react-router-dom";
import { getPoppularRecipes } from "@/service/recipe";

const PopularRecipeCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [suggestedRecipes, setsuggestedRecipes] = useState<SuggestedRecipe[]>(
    [],
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPoppularRecipes();
        // console.log(response.data);
        setsuggestedRecipes(response.data.suggestedRecipes);
      } catch (err: any) {
        // console.log("레시피 데이터를 받아오지 못했습니다.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(suggestedRecipes ? suggestedRecipes.length : 0);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, suggestedRecipes.length]);

  return (
    <Carousel
      plugins={[Autoplay({ delay: 3000 })]}
      setApi={setApi}
      opts={{ loop: true }}
      className="relative w-full"
    >
      <CarouselContent>
        {suggestedRecipes &&
          suggestedRecipes.map((recipe) => (
            <CarouselItem
              key={recipe.recipeId}
              className="h-36 cursor-pointer"
              onClick={() => navigate(`/community/recipe/${recipe.recipeId}`)}
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
      <div className="absolute flex items-center px-2 py-1 space-x-2 text-sm text-white bottom-2 right-2">
        <CarouselPrevious className="bg-transparent border-2 border-white" />
        <div>{`${current} / ${count}`}</div>
        <CarouselNext className="bg-transparent border-2 border-white" />
      </div>
    </Carousel>
  );
};

export default PopularRecipeCarousel;
