import { useState } from "react";
import PostDrawer from "@/components/community/PostDrawer";
import PostCard from "@/components/community/PostCard";
import SubmitButton from "@/components/community/SubmitButton";
import PostRecipeTitle from "@/components/community/PostRecipeTitle";
import PostRecipeImage from "@/components/community/PostRecipeImage";
import PostRecipeIngrediants from "@/components/community/PostRecipeIngrediants";
import PostRecipeOrders from "@/components/community/PostRecipeOrders";
import { IngredientProps } from "@/types/interfaces";

const CommunityRecipePostPage = () => {
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [ingredients, setIngredients] = useState<IngredientProps[]>([
    {
      id: 0,
      name: "",
      quantity: "",
      unit: "",
    },
  ]);

  return (
    <main className="flex flex-col px-7 py-4 pc:p-6 gap-5">
      <div className="p-4 space-x-5 font-semibold">
        <span>{"<"}</span>
        <span className="space-y-4">나만의 레시피 작성</span>
      </div>
      <div className="flex flex-col gap-10">
        <PostDrawer
          trigerConent={
            <PostCard title="제목" description="제목을 입력해주세요" />
          }
          headerContent={<PostRecipeTitle setTitle={setTitle} title={title} />}
          footerContent={<SubmitButton />}
          onFooterClick={() => {}}
        />
        <PostDrawer
          trigerConent={
            <PostCard title="사진" description="사진을 업로드해주세요" />
          }
          headerContent={<PostRecipeImage setImage={setImage} image={image} />}
          footerContent={<SubmitButton />}
          onFooterClick={()=>{}}
        />
        <PostDrawer
          trigerConent={
            <PostCard title="재료" description="재료를 입력해주세요" />
          }
          headerContent={
            <PostRecipeIngrediants
              setIngredients={setIngredients}
              ingredients={ingredients}
            />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {}}
        />
        <PostDrawer
          trigerConent={
            <PostCard title="조리순서" description="조리순서를 입력해주세요" />
          }
          headerContent={<PostRecipeOrders setTitle={setTitle} title={title} />}
          footerContent={<SubmitButton />}
          onFooterClick={() => {}}
        />
      </div>
    </main>
  );
};

export default CommunityRecipePostPage;
