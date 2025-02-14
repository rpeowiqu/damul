import { Dispatch, SetStateAction, useState } from "react";
import PostRecipeOrderForm from "./PostRecipeOrderForm";
import SubmitButton from "./SubmitButton";
import { OrderProps } from "@/types/community";
import Image from "../common/Image";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import DamulDrawer from "@/components/common/DamulDrawer";

interface PostRecipeStepsProps {
  setTempOrders: Dispatch<SetStateAction<OrderProps[]>>;
  tempOrders: OrderProps[];
}

const PostRecipeSteps = ({
  setTempOrders,
  tempOrders,
}: PostRecipeStepsProps) => {
  const [orderDescription, setOrderDescription] = useState("");
  const [orderImage, setOrderImage] = useState<File | null>(null);
  const [preImage, setPreImage] = useState<string>("");
  const [isOpen, setIsOpen] = useCloseOnBack();

  // 단계 삭제
  const handleRemoveStep = (id: number) => {
    setTempOrders(tempOrders.filter((order) => order.id !== id));
  };

  // 단계 추가
  const handleSubmit = () => {
    if (!orderDescription.trim()) {
      return;
    }

    const newOrder: OrderProps = {
      id: Date.now(),
      content: orderDescription.trim(),
      imageUrl: orderImage,
    };

    setTempOrders((prev) => {
      let updatedOrders = [...prev, newOrder];

      if (updatedOrders.length >= 2 && !updatedOrders[0].content) {
        updatedOrders = updatedOrders.slice(1);
      }

      return updatedOrders;
    });

    // 입력값 초기화
    setOrderDescription("");
    setOrderImage(null);
    setPreImage("");
  };

  return (
    <div className="overflow-x-hidden flex flex-col">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left"></th>
            <th className="text-center">이미지</th>
            <th className="text-center">조리 단계</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-300">
          {tempOrders.map((order, index) => (
            <tr key={order.id}>
              <td className="p-1">
                {order.content && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(order.id)}
                    className="flex items-center justify-center w-5 h-5 rounded-full text-negative-600 hover:text-negative-700 border-2 border-negative-600 text-xl font-semibold"
                  >
                    -
                  </button>
                )}
              </td>
              <td className="p-1 text-center">
                {order.imageUrl ? (
                  <Image
                    src={
                      order.imageUrl instanceof File
                        ? URL.createObjectURL(order.imageUrl)
                        : order.imageUrl
                    }
                    alt={`Step ${index + 1}`}
                    className="w-full h-20 object-cover rounded-sm"
                  />
                ) : (
                  <Image
                    src=""
                    alt={`Step ${index + 1}`}
                    className="w-full h-20 object-cover rounded-sm"
                  />
                )}
              </td>

              <td className="p-2">
                <textarea
                  value={order.content}
                  className="w-full min-h-20 outline-none p-2"
                  disabled
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DamulDrawer
        isOpen={isOpen}
        onOpenChange={() => {
          if (isOpen) {
            history.back();
          }
        }}
        triggerContent={
          <div className="text-blue-400 hover:text-blue-700 text-2xl mt-5">
            +
          </div>
        }
        headerContent={
          <PostRecipeOrderForm
            orderDescription={orderDescription}
            setOrderDescription={setOrderDescription}
            setOrderImage={setOrderImage}
            setPreImage={setPreImage}
            preImage={preImage}
          />
        }
        footerContent={<SubmitButton />}
        onFooterClick={handleSubmit}
        onTriggerClick={() => {
          console.log("추가");
          setIsOpen(true);
        }}
      />
    </div>
  );
};

export default PostRecipeSteps;
