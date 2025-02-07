import { ReactNode, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Divide } from "lucide-react";

interface DamulInfiniteScrollListProps<T> {
  queryKey: string[];
  fetchFn: (pageParam: number) => Promise<T[]>;
  renderItems: (item: T, index: number) => ReactNode;
  direction?: "forward" | "backward";
  loadSize?: number; // 스켈레톤 개수를 출력할 때 사용
  className?: string;
}

const DamulInfiniteScrollList = <T,>({
  queryKey,
  fetchFn,
  renderItems,
  direction = "forward",
  className,
}: DamulInfiniteScrollListProps<T>) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
  });
  const prevScrollHeight = useRef<number>(0);
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length + 1 : undefined,
    getPreviousPageParam: (firstPage, allPages) =>
      firstPage.length > 0 ? allPages.length - 1 : undefined,
  });

  useEffect(() => {
    if (inView) {
      switch (direction) {
        case "forward":
          if (hasNextPage) {
            fetchNextPage();
          }
          break;
        case "backward":
          if (hasPreviousPage) {
            fetchPreviousPage();
          }
          break;
      }
    }
  }, [inView]);

  return (
    <div className={className}>
      {direction === "forward" && <div ref={ref}></div>}

      {data?.pages.map((page, pageIndex) =>
        page.map((item, index) =>
          renderItems(item, index + pageIndex * page.length),
        ),
      )}

      {direction === "forward" && <div ref={ref}></div>}
    </div>
  );
};

export default DamulInfiniteScrollList;
