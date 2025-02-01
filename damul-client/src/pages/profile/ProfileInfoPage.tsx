import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProfileInfo } from "@/types/profile";
import DamulButton from "@/components/common/DamulButton";
import useUserStore from "@/stores/user";

const chartConfig = {
  categoryPreference: {
    label: "count",
  },
} satisfies ChartConfig;

const colorList = [
  "#f28b82",
  "#fbbc04",
  "#fdd663",
  "#97d174",
  "#6fcf97",
  "#76d7ea",
  "#4a90e2",
  "#ab7fd0",
  "#f4a9c0",
  "#cfd8dc",
];

const ProfileInfoPage = () => {
  const { user } = useOutletContext();
  const myId = useUserStore((state) => state.myId);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    followerCount: 0,
    followingCount: 0,
    selfIntroduction: "",
    foodPreference: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/mocks/profile/user-profile-info_${user.userId}.json`,
        );
        if (!response.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setProfileInfo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return null;
  }

  const getFavoriteFood = () => {
    const favoriteFood = profileInfo.foodPreference.reduce(
      (maxItem, item, index) =>
        item.categoryPreference > maxItem.item.categoryPreference
          ? { item, index }
          : maxItem,
      { item: profileInfo.foodPreference[0], index: 0 },
    );

    return (
      <span
        className={"font-bold ml-0.5"}
        style={{ color: colorList[favoriteFood.index] }}
      >
        {favoriteFood.item.categoryName}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex font-bold py-6 bg-white">
        <Link
          to={"/friend/follower"}
          className="flex flex-col items-center flex-1 border-r border-normal-50"
        >
          <p className="text-sm">팔로워</p>
          <p className="text-lg">
            {profileInfo.followerCount.toLocaleString()}
          </p>
        </Link>
        <Link
          to={"/friend/following"}
          className="flex flex-col items-center flex-1 border-r border-normal-50"
        >
          <p className="text-sm">팔로잉</p>
          <p className="text-lg">
            {profileInfo.followingCount.toLocaleString()}
          </p>
        </Link>
        {user.userId !== myId && (
          <div className="flex items-center flex-1 gap-2 border-r border-transparent">
            <DamulButton variant="positive" onClick={() => {}}>
              팔로우
            </DamulButton>
            <DamulButton variant="positive" onClick={() => {}}>
              채팅하기
            </DamulButton>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-5 bg-white">
        <h1 className="text-lg font-bold">자기소개</h1>
        <p className="text-normal-600">
          {profileInfo.selfIntroduction}
          <br />
        </p>
      </div>

      <div className="flex flex-col flex-1 gap-2 p-5 bg-white">
        <h1 className="text-lg font-bold">선호 식자재 그래프</h1>
        <p className="text-normal-600">
          {user.nickname}님은 {getFavoriteFood()}을(를) 가장 좋아하시는군요!
        </p>
        <ChartContainer config={chartConfig} className="w-full min-h-80">
          <BarChart
            accessibilityLayer
            data={profileInfo.foodPreference}
            layout="vertical"
          >
            <XAxis className="text-sm" type="number" />
            <YAxis className="text-sm" type="category" dataKey="categoryName" />
            <Bar dataKey="categoryPreference">
              {profileInfo.foodPreference.map((_, index) => (
                <Cell key={index} fill={colorList[index]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default ProfileInfoPage;
