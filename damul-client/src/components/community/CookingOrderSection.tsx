import Skeleton from "react-loading-skeleton";
import Image from "../common/Image";
import { CookingOrder } from "@/types/community";

interface CookingOrdersSectionProps {
  cookingOrders: CookingOrder[];
  isLoading: boolean;
}
const CookingOrdersSection = ({
  cookingOrders,
  isLoading,
}: CookingOrdersSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col text-start gap-3">
        <Skeleton width={60} height={20} className="mt-10" />
        <Skeleton width="100%" height={80} />
        <Skeleton width="100%" height={80} />
      </div>
    );
  }
  return (
    <div className="text-start">
      <h3 className="text-md pc:text-lg font-semibold">조리 순서</h3>
      <div className="flex flex-col gap-3">
        {cookingOrders?.map((order) => (
          <div
            key={order.id}
            className="flex justify-between text-start bg-neutral-100 p-3"
          >
            <p className="pr-2 text-xs pc:text-md flex-1 whitespace-pre-wrap break-words break-all">
              {order.content}
            </p>
            <Image
              src={order.imageUrl}
              className="w-28 pc:w-32 h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CookingOrdersSection;
