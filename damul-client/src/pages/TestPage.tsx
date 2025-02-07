import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";

const TestPage = () => {
  const fetchItems = async (pageParam: number) => {
    console.log(pageParam);
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
    );
    if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
    return response.json();
  };

  return (
    <DamulInfiniteScrollList
      queryKey={["posts"]}
      fetchFn={fetchItems}
      renderItems={(item: { id: number; title: string; body: string }) => (
        <div key={item.id} className="p-3 my-2 rounded-md bg-normal-50">
          <h3 className="font-semibold">{item.title}</h3>
          <p>{item.body}</p>
        </div>
      )}
    />
  );
};

export default TestPage;
