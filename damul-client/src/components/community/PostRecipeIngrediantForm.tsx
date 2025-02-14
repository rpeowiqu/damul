import { Dispatch, SetStateAction } from "react";

interface PostRecipeIngrediantFormProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  unit: string;
  setUnit: Dispatch<SetStateAction<string>>;
}

const PostRecipeIngrediantForm = ({
  name,
  setName,
  amount,
  setAmount,
  unit,
  setUnit,
}: PostRecipeIngrediantFormProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="py-6 text-xl text-neutral-800">
        재료의 수량과 단위를 정해주세요
      </h3>
      <p className="text-start">재료명</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="재료"
        className="p-2 border focus:ring-0 focus:outline-none focus:border-neutral-400"
      />
      <p className="text-start">수량</p>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="수량"
        className="p-2 border focus:ring-0 focus:outline-none focus:border-neutral-400"
      />
      <p className="text-start">단위</p>
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="단위"
        className="p-2 border focus:ring-0 focus:outline-none focus:border-neutral-400"
      />
    </div>
  );
};

export default PostRecipeIngrediantForm;
