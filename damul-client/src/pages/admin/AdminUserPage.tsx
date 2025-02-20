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
import Pagenation from "@/components/common/Pagenation";
import { useSearchParams, useNavigate } from "react-router-dom";
import { User } from "@/types/admin";

const AdminUserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(0);
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const nav = useNavigate();

  // URL의 쿼리 파라미터에서 검색 타입과, 현재 페이지를 가져온다.
  // 검색어는 onChange 이벤트가 호출될 때마다 URL이 바뀌면 안되기 때문에 별도의 STATE로 관리한다.
  const searchType = searchParams.get("searchType") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/mocks/admin/admin-user_${page}.json`);
        if (!response.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setUserList(data.content);
        setTotalPage(data.pageInfo.totalPages);
      } catch (error) {
        // console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6">
      <div className="flex items-center gap-3">
        <Select
          value={searchType}
          onValueChange={(value: "all" | "nickname" | "email") =>
            setSearchParams((prev) => {
              prev.set("searchType", value);
              return prev;
            })
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
                value="nickname"
              >
                닉네임
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="email"
              >
                이메일
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <DamulSearchBox
          placeholder="검색어를 입력해 주세요."
          className="w-full focus-visible:ring-1 focus-visible:ring-offset-0"
          inputValue={keyword}
          setInputValue={setKeyword}
          onButtonClick={() => {
            setSearchParams({ keyword, searchType, page: "1" });
          }}
        />
      </div>

      <div className="min-h-[450px] mb-10">
        <table className="w-full text-normal-700 text-center  xs:text-xs pc:text-sm pc_admin:text-base">
          <thead className="bg-positive-300 text-white">
            <tr>
              <th scope="col" className="p-2">
                유저 번호
              </th>
              <th scope="col" className="p-2">
                닉네임
              </th>
              <th scope="col" className="p-2">
                이메일
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.map((item: User) => (
              <tr
                key={item.userId}
                className="bg-white border-b border-normal-100 hover:bg-positive-50 cursor-pointer"
                onClick={() => nav(`${item.userId}`)}
              >
                <td className="p-2">{item.userId}</td>
                <td className="p-2">{item.nickname}</td>
                <td className="p-2">{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagenation
        page={page}
        setPage={(newPage: number) =>
          setSearchParams((prev) => {
            prev.set("page", `${newPage}`);
            return prev;
          })
        }
        totalPage={totalPage}
      />
    </div>
  );
};

export default AdminUserPage;
