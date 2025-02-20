import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DamulDrawer from "@/components/common/DamulDrawer";
import PostCard from "@/components/community/PostCard";
import SubmitButton from "@/components/community/SubmitButton";
import PostRecipeTitle from "@/components/community/PostTitle";
import PostRecipeImage from "@/components/community/PostImage";
import PostContent from "@/components/community/PostContent";
import PostRecipeIngrediants from "@/components/community/PostRecipeIngrediants";
import PostRecipeOrders from "@/components/community/PostRecipeOrders";
import DamulButton from "@/components/common/DamulButton";
import { Ingredient, OrderProps } from "@/types/community";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import { postRecipe, putRecipe, getRecipeDetail } from "@/service/recipe";
import useOverlayStore from "@/stores/overlayStore";

const CommunityRecipePostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recipeId } = useParams();

  const [title, setTitle] = useState<string>("");
  const [tempTitle, setTempTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [preImage, setPreImage] = useState("");
  const [content, setContent] = useState<string>("");
  const [tempContent, setTempContent] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tempIngredients, setTempIngredients] = useState<Ingredient[]>([]);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [tempOrders, setTempOrders] = useState<OrderProps[]>([]);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState<number>(-1);
  const { overlaySet, openOverlay } = useOverlayStore();
  const isOpenOverlay = overlaySet.has("CommunityRecipePostPage");

  useCloseOnBack("CommunityRecipePostPage", () => setCurrentDrawerIndex(-1));

  useEffect(() => {
    if (currentDrawerIndex > -1) {
      openOverlay("CommunityRecipePostPage");
    }
  }, [currentDrawerIndex]);

  const submitRecipe = async () => {
    const formData = new FormData();

    const recipeData = {
      title,
      content,
      ingredients: ingredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
      cookingOrders: orders.map((order, index) => ({
        id: index + 1,
        content: order.content,
        imageUrl:
          order.imageUrl instanceof File ? order.imageUrl.name : order.imageUrl, // 기존 URL 유지
      })),
    };

    const jsonString = JSON.stringify(recipeData);
    const recipeBlob = new Blob([jsonString], { type: "application/json" });
    formData.append("recipeRequest", recipeBlob);

    if (image) {
      formData.append("thumbnailImage", image);
    }

    const cookingImagesArray = orders
      .filter((order) => order.imageUrl)
      .map((order) => order.imageUrl as File);

    cookingImagesArray.forEach((file) => {
      formData.append("cookingImages", file);
    });

    try {
      console.log("데이터", recipeData);
      const response = await (location.pathname.endsWith("edit")
        ? putRecipe({ formData, recipeId })
        : postRecipe(formData));

      console.log("결과", response?.data);
      alert("레시피가 등록되었습니다");
      navigate("/community/recipe");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecipeDetail = async () => {
    try {
      const response = await getRecipeDetail(recipeId);
      console.log(response.data);
      setTitle(response.data.title);
      setTempTitle(response.data.title);
      setImage(response.data.contentImageUrl);
      setTempImage(response.data.contentImageUrl);
      setPreImage(response.data.contentImageUrl);
      setContent(response.data.content);
      setTempContent(response.data.content);
      setIngredients(response.data.ingredients);
      setTempIngredients(response.data.ingredients);
      setOrders(response.data.cookingOrders);
      setTempOrders(response.data.cookingOrders);
      console.log(response.data.cookingOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location.pathname.endsWith("edit")) {
      fetchRecipeDetail();
    }
  }, []);

  return (
    <div className="flex flex-col justify-between px-7 py-4 pc:p-6 gap-5">
      <div className="flex gap-5">
        <button className="font-black" onClick={() => history.back()}>
          &lt;
        </button>
        <h1 className="text-lg sm:text-xl font-black text-normal-700">
          나만의 레시피 작성
        </h1>
      </div>
      <div className="flex flex-col gap-5">
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 0}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="제목"
              description="제목을 입력해 주세요."
              isEmpty={!title}
            />
          }
          headerContent={
            <PostRecipeTitle
              setTempTitle={setTempTitle}
              tempTitle={tempTitle}
            />
          }
          footerContent={
            <SubmitButton
              disabled={tempTitle.length <= 0 || tempTitle.length > 50}
            />
          }
          onFooterClick={() => {
            setTitle(tempTitle);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(0)}
        />
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 1}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="사진"
              description="사진을 업로드해 주세요."
              isEmpty={!image}
            />
          }
          headerContent={
            <PostRecipeImage
              setTempImage={setTempImage}
              preImage={preImage}
              setPreImage={setPreImage}
            />
          }
          footerContent={<SubmitButton disabled={!tempImage} />}
          onFooterClick={() => {
            setImage(tempImage);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(1)}
        />
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 2}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="소개"
              description="소개글을 입력해 주세요."
              isEmpty={!content}
            />
          }
          headerContent={
            <PostContent
              setTempContent={setTempContent}
              tempContent={tempContent}
            />
          }
          footerContent={
            <SubmitButton
              disabled={tempContent.length <= 0 || tempContent.length > 500}
            />
          }
          onFooterClick={() => {
            setContent(tempContent);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(2)}
        />
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 3}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="재료"
              description="재료를 입력해 주세요."
              isEmpty={ingredients.length === 0 || !ingredients[0].name}
            />
          }
          headerContent={
            <PostRecipeIngrediants
              setTempIngredients={setTempIngredients}
              tempIngredients={tempIngredients}
            />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setIngredients(tempIngredients);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(3)}
        />
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 4}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="조리순서"
              description="조리순서를 입력해 주세요."
              isEmpty={orders.length === 0 || !orders[0].content}
            />
          }
          headerContent={
            <PostRecipeOrders
              setTempOrders={setTempOrders}
              tempOrders={tempOrders}
            />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setOrders(tempOrders);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(4)}
        />
      </div>
      {title &&
        image &&
        content &&
        ingredients.length > 0 &&
        ingredients[0].name &&
        orders.length > 0 &&
        orders[0].content && (
          <DamulButton
            variant="positive"
            className="w-full"
            onClick={() => {
              submitRecipe();
            }}
          >
            {location.pathname.endsWith("edit")
              ? "레시피 수정하기"
              : "레시피 작성하기"}
          </DamulButton>
        )}
    </div>
  );
};

export default CommunityRecipePostPage;
