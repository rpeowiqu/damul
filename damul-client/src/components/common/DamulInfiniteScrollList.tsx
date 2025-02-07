import { ReactNode, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

interface DamulInfiniteScrollListProps<T> {
  queryKey: string[];
  fetchFn: (pageParam: number) => Promise<T[]>;
  initPage?: number;
  loadSize?: number; // 스켈레톤 개수를 출력할 때 사용
  renderItems: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
  className?: string;
}

const DamulInfiniteScrollList = <T,>({
  queryKey,
  fetchFn,
  initPage = 1,
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
      queryFn: ({ pageParam = 1 }) => fetchFn(pageParam),
      initialPageParam: initPage,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length > 0 ? allPages.length + 1 : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className={className}>
      {data?.pages.map((page, pageIndex) =>
        page.map((item, index) =>
          renderItems(item, index + pageIndex * page.length),
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
