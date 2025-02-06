import { Dispatch, SetStateAction } from "react";
import { PAGE_SIZE, NAVIGATION_SIZE } from "@/constants/pagenation";

interface PagenationProps {
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
}

const Pagenation = ({ page, setPage, totalPage }: PagenationProps) => {
  const curRangeStartPage =
    Math.floor((page - 1) / NAVIGATION_SIZE) * NAVIGATION_SIZE + 1;
  const curRangeEndPage =
    curRangeStartPage + NAVIGATION_SIZE - 1 > totalPage
      ? totalPage
      : curRangeStartPage + NAVIGATION_SIZE - 1;
  const isInEndRange =
    page >= Math.floor((totalPage - 1) / NAVIGATION_SIZE) * NAVIGATION_SIZE + 1;

  return (
    <nav className="flex justify-center text-xs pc:text-sm">
      <ul className="flex gap-3">
        <li
          className="p-1 text-normal-600 font-bold rounded-full cursor-pointer hover:bg-normal-50"
          onClick={() => setPage(1)}
        >
          처음
        </li>
        <li
          className="p-1 text-normal-600 font-bold rounded-full cursor-pointer hover:bg-normal-50"
          onClick={() =>
            setPage(curRangeStartPage === 1 ? 1 : curRangeStartPage - 1)
          }
        >
          이전
        </li>

        {Array.from(
          { length: curRangeEndPage - curRangeStartPage + 1 },
          (_, index) => (
            <li
              key={index}
              className={`p-1 font-bold rounded-full cursor-pointer hover:bg-normal-50 ${curRangeStartPage + index === page ? "text-positive-400" : "text-normal-600"}`}
              onClick={() => setPage(curRangeStartPage + index)}
            >
              {curRangeStartPage + index}
            </li>
          ),
        )}

        <li
          className="p-1 text-normal-600 font-bold rounded-full cursor-pointer hover:bg-normal-50"
          onClick={() =>
            setPage(isInEndRange ? totalPage : curRangeEndPage + 1)
          }
        >
          다음
        </li>
        <li
          className="p-1 text-normal-600 font-bold rounded-full cursor-pointer hover:bg-normal-50"
          onClick={() => setPage(totalPage)}
        >
          끝
        </li>
      </ul>
    </nav>
  );
};

export default Pagenation;
