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
  renderItems: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
  className?: string;
}

const DamulInfiniteScrollList = <T,>({
  queryKey,
  fetchFn,
  initPage = 0,
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
      queryKey,
      queryFn: ({ pageParam = 0 }) => fetchFn(pageParam),
      initialPageParam: initPage,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className={className}>
      {data?.pages.map((page, pageIndex) =>
        page.data?.map((item, index) =>
          renderItems(item, index + pageIndex * page.data.length),
        ),
      )}
      {isFetchingNextPage ? skeleton : <div ref={ref}></div>}
    </div>
  );
};

export default DamulInfiniteScrollList;
