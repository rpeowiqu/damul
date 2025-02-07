import DamulButton from "../common/DamulButton";

const IngredientEditOverview = () => {
  return (
    <div className="fixed rounded-t-3xl w-full h-48 p-5 flex flex-col bottom-0 max-w-[600px] bg-positive-100">
      <div>개수</div>
      <div>
        <DamulButton className="bg-white text-black">편집하러가자</DamulButton>
        <DamulButton className="bg-white text-black">편집하러가자</DamulButton>
      </div>
    </div>
  );
};

export default IngredientEditOverview;
