import { useEffect, useState } from "react";
import DamulDrawer from "@/components/common/DamulDrawer";
import PostCard from "@/components/community/PostCard";
import SubmitButton from "@/components/community/SubmitButton";
import PostRecipeTitle from "@/components/community/PostTitle";
import PostRecipeImage from "@/components/community/PostImage";
import PostContent from "@/components/community/PostContent";
import PostRecipeIngrediants from "@/components/community/PostRecipeIngrediants";
import PostRecipeOrders from "@/components/community/PostRecipeOrders";
import DamulButton from "@/components/common/DamulButton";
import { IngredientProps, OrderProps } from "@/types/community";
import useCloseOnBack from "@/hooks/useCloseOnBack";

const CommunityRecipePostPage = () => {
  const [title, setTitle] = useState<string>("");
  const [tempTitle, setTempTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [tempContent, setTempContent] = useState<string>("");
  const [ingredients, setIngredients] = useState<IngredientProps[]>([
    {
      id: 0,
      name: "",
      quantity: "",
      unit: "",
    },
  ]);
  const [tempIngredients, setTempIngredients] = useState<IngredientProps[]>([
    {
      id: 0,
      name: "",
      quantity: "",
      unit: "",
    },
  ]);
  const [orders, setOrders] = useState<OrderProps[]>([
    {
      id: 0,
      description: "",
      image: null,
    },
  ]);
  const [tempOrders, setTempOrders] = useState<OrderProps[]>([
    {
      id: 0,
      description: "",
      image: null,
    },
  ]);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useCloseOnBack(() => setCurrentDrawerIndex(-1));

  useEffect(() => {
    if (currentDrawerIndex > -1) {
      setIsOpen(true);
    }
  }, [currentDrawerIndex]);

  return (
    <main className="flex flex-col px-7 py-4 pc:p-6 gap-5">
      <div
        className="p-4 space-x-5 font-semibold cursor-pointer"
        onClick={() => window.history.back()}
      >
        <span>{"<"}</span>
        <span className="space-y-4">나만의 레시피 작성</span>
      </div>
      <div className="flex flex-col gap-5">
        <DamulDrawer
          isOpen={currentDrawerIndex === 0}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="제목"
              description="제목을 입력해주세요"
              isEmpty={!title}
            />
          }
          headerContent={
            <PostRecipeTitle
              setTempTitle={setTempTitle}
              tempTitle={tempTitle}
            />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setTitle(tempTitle);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(0)}
        />
        <DamulDrawer
          isOpen={currentDrawerIndex === 1}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="사진"
              description="사진을 업로드해주세요"
              isEmpty={!image}
            />
          }
          headerContent={<PostRecipeImage setTempImage={setTempImage} />}
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setImage(tempImage);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(1)}
        />
        <DamulDrawer
          isOpen={currentDrawerIndex === 2}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="소개"
              description="소개글을 입력해주세요"
              isEmpty={!content}
            />
          }
          headerContent={
            <PostContent
              setTempContent={setTempContent}
              tempContent={tempContent}
            />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setContent(tempContent);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(2)}
        />
        <DamulDrawer
          isOpen={currentDrawerIndex === 3}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="재료"
              description="재료를 입력해주세요"
              isEmpty={!ingredients[0].name}
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
          isOpen={currentDrawerIndex === 4}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="조리순서"
              description="조리순서를 입력해주세요"
              isEmpty={!orders[0].description}
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
        ingredients[0].name &&
        orders[0].description && (
          <div className="absolute bottom-16 left-0 w-full p-6">
            <DamulButton
              variant="positive-outline"
              size="full"
              textSize="sm"
              onClick={() => {}}
            >
              레시피 작성하기
            </DamulButton>
          </div>
        )}
    </main>
  );
};

export default CommunityRecipePostPage;
