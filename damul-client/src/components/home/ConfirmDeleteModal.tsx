import DeleteIcon from "../svg/DeleteIcon";

const ConfirmDeleteModal = () => {
  return (
    <div className="flex flex-col items-center px-[10px] border-4 border-normal-50 rounded-xl w-96">
      <p className="w-full py-4 text-xl font-bold text-center border-b-2 text-positive-300 border-b-normal-50">
        정말 삭제할까요?
      </p>
      <p className="text-center text-md text-normal-300 pt-4">
        삭제된 데이터는 복구할 수 없습니다.
      </p>
      <div className="flex justify-between w-full py-6">
        <button className="flex items-center justify-center w-[170px] gap-2 py-2 rounded-lg bg-negative-300 px-7">
          <DeleteIcon />
          <p className="text-sm text-white">삭제하기</p>
        </button>
        <button className="flex items-center justify-center w-[170px] gap-2 py-2 rounded-lg bg-normal-400 px-7">
          <p className="text-sm text-white">뒤로가기</p>
        </button>
      </div>

      <div className="flex items-center w-full pb-4 pl-5">
        <input type="checkbox" id="delete-check" name="delete-check" />
        <p className="text-sm text-normal-300 pl-2">
          재확인 팝업 다시 보지 않기
        </p>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
