const IngredientItem = () => {
  return (
    <div className="flex w-full border-1 p-4 rounded-lg gap-5">
      <div className="flex justify-center items-center px-2">
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center justify-center w-5 h-5 rounded-full text-negative-600 hover:negative-700 border-2 border-negative-600 text-xl font-semibold"
        >
          -
        </button>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full justify-between">
          <label className="w-20">상품명</label>
          <input type="text" className="border-1 w-full" />
        </div>
        <div className="flex w-full justify-between">
          <label className="w-20">분류</label>
          <input type="text" className="border-1 w-full" />
        </div>
        <div className="flex w-full justify-between">
          <label className="w-20">가격</label>
          <input type="text" className="border-1 w-full" />
        </div>
        <div className="flex w-full justify-between">
          <label className="w-20">소비기한</label>
          <input type="text" className="border-1 w-full" />
        </div>
        <div className="flex w-full justify-between">
          <label className="w-20">보관장소</label>
          <input type="text" className="border-1 w-full" />
        </div>
      </div>
    </div>
  );
};

export default IngredientItem;
