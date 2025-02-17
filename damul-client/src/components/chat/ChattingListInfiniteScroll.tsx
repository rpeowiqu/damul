import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getKSTISOString } from "@/utils/date";

interface ChattingListInfiniteScrollProps<T> {
  queryKey: string[];
  fetchFn: (pageParam: { cursor: number; cursorTime?: string }) => Promise<{
    data: T[];
    meta: {
      nextCursor: number | null;
      hasNext: boolean;
      nextCursorTime?: string;
    };
  }>;
  initPage?: { cursor: number; cursorTime?: string };
  renderItems: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
  noContent?: ReactNode;
  className?: string;
}

const ChattingListInfiniteScroll = <T,>({
  queryKey,
  fetchFn,
  initPage = { cursor: 0, cursorTime: getKSTISOString() }, // KST 적용
  renderItems,
  skeleton,
  noContent,
  className,
}: ChattingListInfiniteScrollProps<T>) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => {
        return fetchFn({
          cursor: pageParam?.cursor ?? 0,
          cursorTime: pageParam?.cursorTime ?? undefined,
        });
      },
      initialPageParam: initPage,
      getNextPageParam: (lastPage) => {
        if (lastPage.meta?.hasNext) {
          return {
            cursor: lastPage.meta.nextCursor ?? 0,
            cursorTime: lastPage.meta.nextCursorTime ?? undefined,
          };
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const hasData = data?.pages?.some((page) => page.data.length > 0);

  return (
    <>
      {hasData ? (
        <div className={className}>
          {data?.pages.map((page, pageIndex) =>
            page.data?.map((item, index) =>
              renderItems(item, index + pageIndex * page.data.length),
            ),
          )}
          {isFetchingNextPage ? skeleton : <div ref={ref} className="h-10" />}
        </div>
      ) : (
        noContent
      )}
    </>
  );
};

export default ChattingListInfiniteScroll;
