import { useState, useEffect } from "react";
import FeedCard from "@/components/common/RecipeFeedCard";

interface FeedListProps {
  type: string;
}

interface Feed {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorname: string;
}

const FeedList = ({ type }: FeedListProps) => {
  const mockDataRecipe: Feed[] = [
    {
      id: 1,
      title: "돈가스",
      thumbnailUrl: "이미지1",
      content:
        "돈가스는 맛있는 음식입니다. 돈가스는 맛있는 음식이죠. 정말 맛있습니다 돈가스는 정말로요 정말로. 돈가스는 정말로 맛있습니다.",
      createdAt: "2025-01-27",
      authorId: 101,
      authorname: "토마토러버",
    },
    {
      id: 2,
      title: "김밥",
      thumbnailUrl: "이미지2",
      content:
        "김밥은 간편하고 맛있어요. 언제 어디서나 먹기 좋은 최고의 간식이죠.",
      createdAt: "2025-01-26",
      authorId: 102,
      authorname: "김밥러버",
    },
    {
      id: 3,
      title: "라면",
      thumbnailUrl: "이미지3",
      content:
        "라면은 짜고 뜨겁고 맛있는 음식입니다. 특히 비오는 날에 더 맛있죠.",
      createdAt: "2025-01-25",
      authorId: 103,
      authorname: "라면왕",
    },
    {
      id: 4,
      title: "돈가스",
      thumbnailUrl: "이미지1",
      content:
        "돈가스는 맛있는 음식입니다. 돈가스는 맛있는 음식이죠. 정말 맛있습니다 돈가스는 정말로요 정말로. 돈가스는 정말로 맛있습니다.",
      createdAt: "2025-01-27",
      authorId: 101,
      authorname: "토마토러버",
    },
  ];

  const mockDataMarket: Feed[] = [
    {
      id: 1,
      title: "쌀 20kg 공동구매",
      thumbnailUrl: "이미지1",
      content:
        "쌀을 대량으로 구매하여 저렴하게 나누려고 합니다. 함께 구매하실 분들은 연락 주세요.",
      createdAt: "2025-01-27",
      authorId: 201,
      authorname: "식자재공구러버",
    },
    {
      id: 2,
      title: "유기농 달걀 나눔",
      thumbnailUrl: "이미지2",
      content:
        "유기농 달걀을 나눔합니다. 필요한 분들은 댓글 남겨주세요. 직접 수령 가능합니다.",
      createdAt: "2025-01-26",
      authorId: 202,
      authorname: "건강한식탁",
    },
    {
      id: 3,
      title: "한우 1++ 등급 공동구매",
      thumbnailUrl: "이미지3",
      content:
        "한우를 대량으로 구매하면 저렴하게 살 수 있어서 공구 진행합니다. 관심 있으신 분들은 연락 주세요.",
      createdAt: "2025-01-25",
      authorId: 203,
      authorname: "고기러버",
    },
  ];

  const [mockData, setMockData] = useState<Feed[] | undefined>(undefined);

  useEffect(() => {
    let dataToSet: Feed[] | undefined = undefined;

    switch (type) {
      case "community/market":
        dataToSet = mockDataMarket;
        break;
      case "community/recipe":
        dataToSet = mockDataRecipe;
        break;
      case "community/market/search":
        dataToSet = mockDataMarket;
        break;
      case "community/recipe/search":
        dataToSet = mockDataRecipe;
        break;
      case "profile/recipe":
        dataToSet = mockDataRecipe;
        break;
      case "profile/bookmark":
        dataToSet = mockDataRecipe;
        break;
    }

    setMockData(dataToSet);
  }, [type]);
  if (!mockData) {
    return <div>게시물이 없어요</div>;
  }

  return (
    <div className="space-y-3">
      {mockData.map((item) => (
        <FeedCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default FeedList;
