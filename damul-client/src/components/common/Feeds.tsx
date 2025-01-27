import FeedCard from "@/components/common/FeedCard";

const Feeds = () => {
  const mockData = [
    {
      id: 1,
      title: "돈가스",
      description:
        "돈가스는 맛있는 음식입니다. 돈가스는 맛있는 음식이죠. 정말 맛있습니다 돈가스는 정말로요 정말로. 돈가스는 정말로 맛있습니다.",
      date: "2025.01.27",
      author: "토마토러버",
      image: "이미지1",
    },
    {
      id: 2,
      title: "김밥",
      description:
        "김밥은 간편하고 맛있어요. 언제 어디서나 먹기 좋은 최고의 간식이죠.",
      date: "2025.01.26",
      author: "김밥러버",
      image: "이미지2",
    },
    {
      id: 3,
      title: "라면",
      description:
        "라면은 짜고 뜨겁고 맛있는 음식입니다. 특히 비오는 날에 더 맛있죠.",
      date: "2025.01.25",
      author: "라면왕",
      image: "이미지3",
    },
  ];

  return (
    <div className="space-y-2">
      {mockData.map((item) => (
        <FeedCard
          key={item.id}
          title={item.title}
          description={item.description}
          date={item.date}
          author={item.author}
          image={item.image}
        />
      ))}
    </div>
  );
};

export default Feeds;
