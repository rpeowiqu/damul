import { useEffect, useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { getUser } from "@/service/user";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UserSearchResult } from "@/types/profile";

const UserSearchInfiniteScroll = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const handleSearch = async (pageParam: number) => {
    try {
      if (searchKeyword.length === 0) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      const response = await getUser({
        keyword: searchKeyword,
        cursor: pageParam,
        size: 3,
      });
      if (response.status === 204) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users", searchKeyword],
      queryFn: ({ pageParam = 0 }) => handleSearch(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage?.meta?.hasNext ? lastPage?.meta?.nextCursor : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      console.log("데이타 출력중:", data);
      fetchNextPage();
    }
  }, [inView]);

  console.log("data 확인:", data);
  console.log("data.pages 확인:", data?.pages["0"].data.length);

  return (
    <div>
      <Command className="relative bg-normal-50 overflow-visible rounded-none">
        <CommandInput
          value={searchKeyword}
          onValueChange={(value) => setSearchKeyword(value)}
          placeholder="찾으시는 유저의 닉네임을 입력해 주세요."
        />

        <CommandList className="absolute left-0 top-full w-full h-24 bg-white shadow-md rounded-none z-20">
          {data?.pages.map((page) =>
            page.data.map((item: UserSearchResult) => (
              <div
                key={item.userId}
                className="flex items-center gap-3 px-5 bg-white rounded-none cursor-pointer"
              >
                <img
                  src={item.profileImageUrl}
                  className="w-8 h-8 xs:w-10 xs:h-10 object-cover rounded-full border border-normal-100"
                />
                {item.nickname}
              </div>
            )),
          )}

          <div ref={ref} className="bg-red-200 h-10">
            {searchKeyword}
          </div>

          {/* {isFetchingNextPage ? (
            Array.from({ length: 5 }).map((_, index) => (
              <CommandItem
                key={index}
                className="h-24 mb-2 animate-pulse bg-normal-100 rounded"
              />
            ))
          ) : (
            <CommandItem ref={ref} className="bg-red-200 h-10" />
          )} */}
        </CommandList>
      </Command>
    </div>
  );
};

export default UserSearchInfiniteScroll;
