import IngredientStorageContainer from "@/components/home/IngredientStorageContainer";
import { ITEM_STATUS } from "@/constants/itemStatus";
import { STORAGE_TYPE } from "@/constants/storage";
import { getIngredients } from "@/service/profile";
import { IngredientData } from "@/types/Ingredient";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";

const ProfileIngredientsPage = () => {
  const { user } = useOutletContext();
  const { data, isLoading } = useQuery<IngredientData>({
    queryKey: ["ingredients", user.userId],
    queryFn: async () => {
      const response = await getIngredients(user.userId);
      if (response.status === 204) {
        return { freezer: [], fridge: [], roomTemp: [] };
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {user.nickname}님의 보유중인 식자재
        </h1>
        <p className="text-normal-600">어떤 식자재가 있는지 살펴보세요.</p>
      </div>
      {data &&
        Object.keys(data).map((item, index) => (
          <IngredientStorageContainer
            key={index}
            title={item as "freezer" | "fridge" | "roomTemp"}
            items={data[item as "freezer" | "fridge" | "roomTemp"]}
          />
        ))}
    </div>
  );
};

export default ProfileIngredientsPage;
