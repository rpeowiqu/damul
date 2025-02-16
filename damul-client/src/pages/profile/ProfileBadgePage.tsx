import DamulHoverCard from "@/components/common/DamulHoverCard";
import BadgeShowcase from "@/components/profile/BadgeShowcase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBadges } from "@/service/profile";
import { BadgeBasic } from "@/types/profile";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const ProfileBadgePage = () => {
  const { user } = useOutletContext();
  const [badgeList, setBadgeList] = useState<BadgeBasic[]>([]);
  const [isFetched, setIsFetched] = useState<boolean>();
  const [sortType, setSortType] = useState<"level" | "title">("level");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBadges(parseInt(user.userId));
        if (response.status == 200) {
          setBadgeList(response.data.list);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetched(true);
      }
    };

    fetchData();
  }, [user]);

  if (!isFetched) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">{user.nickname}님의 뱃지 전시대</h1>
        <div className="flex justify-between items-center">
          <p className="text-normal-600">그동안 획득한 뱃지들을 살펴보세요!</p>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4">
        <DamulHoverCard
          hoverCardTrigger={
            <AlertCircleIcon className="size-4 stroke-normal-200" />
          }
        >
          <p className="text-sm">뱃지는 매일 오전 12시에 갱신 됩니다.</p>
        </DamulHoverCard>

        <Select
          value={sortType}
          onValueChange={(value: "level" | "title") => setSortType(value)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬 방식</SelectLabel>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="level"
              >
                등급순
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="title"
              >
                제목순
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <BadgeShowcase list={badgeList} sortType={sortType} />
    </div>
  );
};

export default ProfileBadgePage;
