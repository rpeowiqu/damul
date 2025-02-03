import { Dispatch, SetStateAction, useState } from "react";
import PostDrawer from "@/components/community/PostDrawer";
import PostRecipeOrderForm from "./PostRecipeOrderForm";
import SubmitButton from "./SubmitButton";
import { OrderProps } from "@/types/interfaces";

interface PostRecipeStepsProps {
  setTempOrders: Dispatch<SetStateAction<OrderProps[]>>;
  tempOrders: OrderProps[];
}

const PostRecipeSteps = ({ setTempOrders, tempOrders }: PostRecipeStepsProps) => {
  const [orderDescription, setOrderDescription] = useState("");
  const [orderImage, setOrderImage] = useState<File | null>(null);
  const [preImage, setPreImage] = useState<string>("");

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
      description: orderDescription.trim(),
      image: orderImage,
    };

    setTempOrders((prev) => {
      let updatedOrders = [...prev, newOrder];

      if (updatedOrders.length >= 2 && !updatedOrders[0].description) {
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
    <div className="overflow-x-hidden">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left"></th>
            <th className="text-center">이미지</th>
            <th className="text-left">조리 단계</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-300">
          {tempOrders.map((order, index) => (
            <tr key={order.id}>
              <td className="p-1">
                <button
                  type="button"
                  onClick={() => handleRemoveStep(order.id)}
                  className="flex items-center justify-center w-5 h-5 rounded-full text-negative-600 hover:text-negative-700 border-2 border-negative-600 text-xl font-semibold"
                >
                  -
                </button>
              </td>
              <td className="p-2">
                {order.image ? (
                  <img
                    src={URL.createObjectURL(order.image)}
                    alt={`Step ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">사진 없음</span>
                )}
              </td>
              <td className="p-2">
                <textarea
                  value={order.description}
                  className="w-full min-h-20 outline-none p-2"
                  disabled
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PostDrawer
        trigerConent={
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 text-xl"
          >
            +
          </button>
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
      />
    </div>
  );
};

export default PostRecipeSteps;
