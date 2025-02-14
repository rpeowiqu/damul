import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";

const TestPage = () => {
  const fetchItems = async (pageParam: number) => {
    if (pageParam > 1) {
      // 스켈레톤을 확인하기 위해, 지연시간을 일부로 추가
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
    );
    if (!response.ok) {
      throw new Error("데이터를 불러오지 못했습니다.");
    }

    return response.json();
  };

  return (
    <DamulInfiniteScrollList
      queryKey={["posts"]}
      fetchFn={fetchItems}
      loadSize={5}
      renderItems={(item: { id: number; title: string; body: string }) => (
        <div key={item.id} className="p-3 mb-2 rounded-md bg-normal-50">
          <h3 className="font-semibold">{item.title}</h3>
          <p>{item.body}</p>
        </div>
      )}
      skeleton={
        <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
      }
    />
  );
};

export default TestPage;
