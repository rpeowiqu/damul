import { useLocation } from "react-router-dom";
import FeedCard from "@/components/common/FeedCard";

const Feeds = () => {
  const location = useLocation();
  const { pathname } = location;

  const mockDataRecipe = [
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

  const mockDataMarket = [
    {
      id: 1,
      title: "쌀 20kg 공동구매",
      description:
        "쌀을 대량으로 구매하여 저렴하게 나누려고 합니다. 함께 구매하실 분들은 연락 주세요.",
      date: "2025.01.27",
      author: "식자재공구러버",
      image: "이미지1",
    },
    {
      id: 2,
      title: "유기농 달걀 나눔",
      description:
        "유기농 달걀을 나눔합니다. 필요한 분들은 댓글 남겨주세요. 직접 수령 가능합니다.",
      date: "2025.01.26",
      author: "건강한식탁",
      image: "이미지2",
    },
    {
      id: 3,
      title: "한우 1++ 등급 공동구매",
      description:
        "한우를 대량으로 구매하면 저렴하게 살 수 있어서 공구 진행합니다. 관심 있으신 분들은 연락 주세요.",
      date: "2025.01.25",
      author: "고기러버",
      image: "이미지3",
    },
  ];

  // pathname이 "recipe"로 끝나면 recipe 데이터를, "market"으로 끝나면 market 데이터를 사용
  const mockData = pathname.endsWith("recipe") ? mockDataRecipe : mockDataMarket;

  return (
    <div className="space-y-3">
      {mockData.map((item) => (
        <FeedCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default Feeds;
