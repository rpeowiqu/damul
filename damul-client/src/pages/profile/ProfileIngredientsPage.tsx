import DamulSection from "@/components/common/DamulSection";
import IngredientStorageContainer from "@/components/home/IngredientStorageContainer";
import LockIcon from "@/components/svg/LockIcon";
import useAuth from "@/hooks/useAuth";
import { getIngredients } from "@/service/profile";
import { IngredientData } from "@/types/Ingredient";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useOutletContext } from "react-router-dom";

const ProfileIngredientsPage = () => {
  const { user } = useOutletContext();
  const { data: authData, isLoading: isLoadingAuth } = useAuth();
  const { data: ingredientData, isLoading: isLoadingIngredient } = useQuery<
    IngredientData & { isPrivate: boolean }
  >({
    queryKey: ["ingredients", user.userId],
    queryFn: async () => {
      try {
        const response = await getIngredients(user.userId);
        if (response.status === 200) {
          return { ...response.data, isPrivate: false };
        } else if (response.status === 204) {
          return { freezer: [], fridge: [], roomTemp: [], isPrivate: false };
        }
      } catch (error: any) {
        if (error.status === 403) {
          return { freezer: [], fridge: [], roomTemp: [], isPrivate: true };
        }
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // URL 입력으로 나의 보유 식자재 탭으로 이동하는 경우
  if (authData?.data.id === user.userId) {
    return <Navigate to={"/404"} />;
  }

  if (isLoadingAuth) {
    return null;
  }

  if (isLoadingIngredient) {
    return null;
  }

  return (
    <DamulSection
      title={`${user.nickname}님의 보유중인 식자재`}
      description={"어떤 식자재가 있는지 살펴볼까요?"}
    >
      {ingredientData?.isPrivate ? (
        <div className="flex justify-center gap-2 items-center py-5 text-center text-normal-200">
          <LockIcon className={"size-5 fill-normal-200"} />
          <p>{user.nickname}님은 냉장고 문을 굳게 닫아놨어요.</p>
        </div>
      ) : (
        ingredientData &&
        ["freezer", "fridge", "roomTemp"].map((item, index) => (
          <IngredientStorageContainer
            key={index}
            title={item as "freezer" | "fridge" | "roomTemp"}
            items={ingredientData[item as "freezer" | "fridge" | "roomTemp"]}
            readOnly={true}
          />
        ))
      )}
    </DamulSection>
  );
};

export default ProfileIngredientsPage;
