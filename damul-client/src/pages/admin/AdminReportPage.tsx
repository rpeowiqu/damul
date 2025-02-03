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
import { useEffect, useState } from "react";
import { Report } from "@/types/admin";
import Pagenation from "@/components/common/Pagenation";

const AdminReportPage = () => {
  const [searchType, setSearchType] = useState<"all" | "reportId" | "nickname">(
    "all",
  );
  const [keyword, setKeyword] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(0);
  const [totalElement, setTotalElement] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [reportList, setReportList] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/mocks/admin/admin-report_${page}.json`);
        if (!response.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }

        const data = await response.json();
        console.log(data);
        setReportList(data.content);
        setPage(data.pageInfo.currentPage);
        setTotalElement(data.pageInfo.totalElements);
        setTotalPage(data.pageInfo.totalPages);
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
          inputValue={keyword}
          setInputValue={setKeyword}
        />
      </div>
      <table className="w-full text-normal-700 text-center">
        <thead className="bg-positive-300 text-white">
          <tr>
            <th scope="col" className="p-2">
              신고 번호
            </th>
            <th scope="col" className="p-2">
              구분
            </th>
            <th scope="col" className="p-2">
              닉네임
            </th>
            <th scope="col" className="p-2">
              처리 상태
            </th>
          </tr>
        </thead>
        <tbody>
          {reportList.map((item) => (
            <tr
              key={item.id}
              className="bg-white border-b border-normal-100 hover:bg-positive-50 cursor-pointer"
            >
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.categoryName}</td>
              <td className="p-2">{item.nickname}</td>
              <td
                className={`p-2 ${item.status === "미완료" ? "text-negative-400 " : "text-positive-400"}`}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagenation />
    </div>
  );
};

export default AdminReportPage;
