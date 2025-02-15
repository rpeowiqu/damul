import Image from "../common/Image";
import { CookingOrder } from "@/types/community";

interface CookingOrdersSectionProps {
  cookingOrders: CookingOrder[];
}
const CookingOrdersSection = ({ cookingOrders }: CookingOrdersSectionProps) => {
  return (
    <div className="py-3 text-start">
      <h3 className="p-3 text-lg font-semibold">조리 순서</h3>
      <div className="flex flex-col gap-3">
        {cookingOrders?.map((order) => (
          <div
            key={order.id}
            className="flex justify-between text-start bg-neutral-100 p-3"
          >
            <p className="pr-2 text-sm">{order.content}</p>
            <Image src={order.imageUrl} className="w-32 h-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CookingOrdersSection;
