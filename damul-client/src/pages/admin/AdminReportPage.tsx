import DamulSearchBox from "@/components/common/DamulSearchBox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useRef } from "react";
import { Report } from "@/types/admin";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AdminReportPage = () => {
  const [searchType, setSearchType] = useState<"all" | "reportId" | "nickname">(
    "all",
  );
  const keyword = useRef<string>("");
  const [reportList, setReportList] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getFilteredData = () => {
    switch (searchType) {
      case "reportId":
        return reportList.filter((item) => String(item.id) === keyword.current);
      case "nickname":
        return reportList.filter((item) =>
          item.nickname.toLowerCase().includes(keyword.current.toLowerCase()),
        );
      default:
        return reportList;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/mocks/admin/admin-report.json");
        if (!response.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }

        const data = await response.json();
        console.log(data);
        setReportList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return null;
  }
  return (
    <div className="flex flex-col gap-5 w-full h-full p-6">
      <div className="flex items-center gap-3">
        <Select
          value={searchType}
          onValueChange={(value) =>
            setSearchType(value as "all" | "reportId" | "nickname")
          }
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>검색 조건</SelectLabel>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="all"
              >
                전체
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="reportId"
              >
                신고번호
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="nickname"
              >
                닉네임
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <DamulSearchBox
          placeholder="검색어를 입력해 주세요."
          className="w-full"
          inputValue={keyword.current}
          //   setInputValue={(value) => (keyword.current = value)}
        />
      </div>

      <table className="w-full text-normal-700 text-center">
        <thead className="bg-positive-300 text-white">
          <tr>
            <th scope="col" className="p-2 w-[10%]">
              신고 번호
            </th>
            <th scope="col" className="p-2 w-1/5">
              닉네임
            </th>
            <th scope="col" className="p-2 w-[10%]">
              구분
            </th>
            <th scope="col" className="p-2 w-1/2">
              내용
            </th>
            <th scope="col" className="p-2 w-[10%]">
              처리 상태
            </th>
          </tr>
        </thead>
        <tbody>
          {getFilteredData().map((item) => (
            <tr
              key={item.id}
              className="bg-white border-b border-normal-100 hover:bg-positive-50 cursor-pointer"
            >
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.nickname}</td>
              <td className="p-2">{item.categoryName}</td>
              <td className="p-2 line-clamp-1">{item.description}</td>
              <td
                className={`p-2 ${item.status === "미완료" ? "text-negative-400 " : "text-positive-400"}`}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination>
        <PaginationContent className="cursor-pointer">
          <PaginationItem>
            <PaginationLink onClick={() => {}}>처음</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => {}}>이전</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => {}}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => {}}>다음</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => {}}>끝</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AdminReportPage;
