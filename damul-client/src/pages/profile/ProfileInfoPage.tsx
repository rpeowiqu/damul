import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProfileInfo } from "@/types/profile";
import DamulButton from "@/components/common/DamulButton";
import { getProfileDetail } from "@/service/profile";
import { toggleFollow } from "@/service/user";
import useAuth from "@/hooks/useAuth";
import { postIntoPrivateRoom } from "@/service/chatting";
import { CATEGORY_COLOR_MAPPER } from "@/constants/category";
import DamulSection from "@/components/common/DamulSection";

const chartConfig = {
  categoryPreference: {
    label: "등록 횟수",
  },
} satisfies ChartConfig;

const ProfileInfoPage = () => {
  const { user } = useOutletContext();
  const { data, isLoading } = useAuth();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    followed: false,
    followerCount: 0,
    followingCount: 0,
    selfIntroduction: "",
    foodPreference: [],
  });
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchProfileDetail = async () => {
      try {
        const response = await getProfileDetail(parseInt(user.userId));
        if (response) {
          setProfileInfo(response.data);
        }
      } catch (error) {
        // console.error(error);
      } finally {
        setIsFetched(true);
      }
    };

    fetchProfileDetail();
  }, [user.userId]);

  const enterPrivateChat = async (userId: number) => {
    try {
      const response = await postIntoPrivateRoom({ userId });
      if (response) {
        const chatId = response.data.id;
        nav(`/chatting/${chatId}`);
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const handleFollowState = async () => {
    try {
      const response = await toggleFollow({
        targetId: user.userId,
      });
      if (response) {
        const followed = response.data.followed;
        setProfileInfo({
          ...profileInfo,
          followed,
          followerCount: followed
            ? profileInfo.followerCount + 1
            : profileInfo.followerCount - 1,
        });
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const getFavoriteFoodText = () => {
    const favoriteFood = profileInfo.foodPreference.reduce(
      (maxItem, item, index) =>
        item.categoryPreference > maxItem.item.categoryPreference
          ? { item, index }
          : maxItem,
      { item: profileInfo.foodPreference[0], index: 0 },
    );

    if (favoriteFood.item.categoryPreference === 0) {
      return "아직 등록된 식자재가 없어요.";
    }

    return (
      <>
        {user.nickname}님은
        <span
          className={"font-bold ml-0.5"}
          style={{
            color: CATEGORY_COLOR_MAPPER[favoriteFood.item.categoryName],
          }}
        >
          {favoriteFood.item.categoryName}
        </span>
        을(를) 가장 좋아하시는군요!
      </>
    );
  };

  if (isLoading) {
    return null;
  }

  if (!isFetched) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <DamulSection className="px-0">
        <div className="flex justify-center items-center bg-white">
          <Link
            to={`/profile/${user.userId}/friend/follower`}
            className="flex flex-col items-center flex-1 font-bold border-r border-normal-100 hover:text-normal-500"
          >
            <p className="text-sm">팔로워</p>
            <p className="text-lg">
              {profileInfo.followerCount.toLocaleString()}
            </p>
          </Link>
          <Link
            to={`/profile/${user.userId}/friend/following`}
            className={`flex flex-col items-center flex-1 font-bold border-r ${data?.data.id !== user.userId ? "border-normal-100" : "border-transparent"} hover:text-normal-500`}
          >
            <p className="text-sm">팔로잉</p>
            <p className="text-lg">
              {profileInfo.followingCount.toLocaleString()}
            </p>
          </Link>
          {data?.data.id !== user.userId && (
            <div className="flex flex-col justify-center items-center gap-2 flex-1 border-r border-transparent">
              <DamulButton
                variant="positive"
                className="w-20 sm:w-24 h-7 text-sm"
                onClick={() => enterPrivateChat(user.userId)}
              >
                채팅 시작
              </DamulButton>
              <DamulButton
                variant={`${profileInfo.followed ? "negative" : "positive"}`}
                className="w-20 sm:w-24 h-7 text-sm"
                onClick={handleFollowState}
              >
                {profileInfo.followed ? "언팔로우" : "팔로우"}
              </DamulButton>
            </div>
          )}
        </div>
      </DamulSection>

      <DamulSection title={"자기소개"}>
        <p className="text-normal-600 whitespace-pre-wrap">
          {profileInfo.selfIntroduction}
        </p>
      </DamulSection>

      <DamulSection
        title={"선호 식자재 그래프"}
        description={getFavoriteFoodText()}
      >
        <ChartContainer config={chartConfig} className="w-full min-h-80">
          <BarChart
            accessibilityLayer
            data={profileInfo.foodPreference}
            layout="vertical"
          >
            <CartesianGrid vertical={true} />
            <XAxis className="text-xs sm:text-sm" type="number" />
            <YAxis
              className="text-xs sm:text-sm"
              type="category"
              dataKey="categoryName"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="categoryPreference">
              {profileInfo.foodPreference.map((item) => (
                <Cell
                  key={item.categoryId}
                  fill={CATEGORY_COLOR_MAPPER[item.categoryName]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </DamulSection>
    </div>
  );
};

export default ProfileInfoPage;
