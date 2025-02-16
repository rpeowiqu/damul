import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

interface DamulInfiniteScrollListProps<T> {
  queryKey: string[];
  fetchFn: (pageParam: number) => Promise<{
    data: T[];
    meta: { nextCursor: number; hasNext: boolean };
  }>;
  enabled?: boolean;
  initPage?: number;
  renderItems: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
  noContent?: ReactNode;
  className?: string;
}

const DamulInfiniteScrollList = <T,>({
  queryKey,
  fetchFn,
  enabled,
  initPage = 0,
  renderItems,
  skeleton,
  noContent,
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
      enabled,
      initialPageParam: initPage,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  const hasData = data?.pages?.some((page) => page.data.length > 0);

  return (
    <>
      {hasData ? (
        <div className={className}>
          {data?.pages.map((page, pageIndex) =>
            page.data.map((item, index) =>
              renderItems(item, index + pageIndex * page.data.length),
            ),
          )}
          {isFetchingNextPage ? skeleton : <div ref={ref}></div>}
        </div>
      ) : (
        noContent
      )}
    </>
  );
};

export default DamulInfiniteScrollList;
