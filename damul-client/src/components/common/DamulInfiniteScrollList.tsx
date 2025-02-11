import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

interface DamulInfiniteScrollListProps<T> {
  queryKey: string[];
  fetchFn: (pageParam: number) => Promise<{
    data: T[];
    meta: { nextCursor: number | null; hasNextData: boolean };
  }>;
  initPage?: number;
  loadSize?: number; // 스켈레톤 개수를 출력할 때 사용
  renderItems: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
  className?: string;
}

const DamulInfiniteScrollList = <T,>({
  queryKey,
  fetchFn,
  initPage = 0,
  loadSize = 1,
  renderItems,
  skeleton,
  className,
}: DamulInfiniteScrollListProps<T>) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: ({ pageParam }) => fetchFn(pageParam),
      initialPageParam: initPage,
      getNextPageParam: (lastPage) =>
        lastPage.meta?.hasNextData ? lastPage.meta.nextCursor : undefined, // 커서 사용
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
      console.log(data);
    }
  }, [inView]);

  return (
    <div className={className}>
      {data?.pages.map((page, pageIndex) =>
        page.data?.map((item, index) =>
          renderItems(item, index + pageIndex * page.data.length),
        ),
      )}

      {isFetchingNextPage ? (
        Array.from({ length: loadSize }).map((_, index) => (
          <div key={index}>{skeleton}</div>
        ))
      ) : (
        <div ref={ref}></div>
      )}
    </div>
  );
};

export default DamulInfiniteScrollList;
