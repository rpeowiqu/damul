import { Dispatch, SetStateAction } from "react";

interface PagenationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalItems: number;
  totalPages: number;
}

const Pagenation = ({
  page,
  setPage,
  totalItems,
  totalPage,
}: PagenationProps) => {
  return (
    <nav className="flex justify-center">
      <ul className="flex gap-6">
        <li
          className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50"
          onClick={() => setPage(1)}
        >
          처음
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          이전
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          1
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          2
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          3
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          4
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          5
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          다음
        </li>
        <li className="p-1 text-sm rounded-full cursor-pointer hover:bg-normal-50">
          끝
        </li>
      </ul>
    </nav>
  );
};

export default Pagenation;
