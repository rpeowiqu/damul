import AlarmIcon from "../svg/AlarmIcon";
import TitleIcon from "../svg/TitleIcon";
import PictureIcon from "../svg/PictureIcon";
import ContentIcon from "../svg/ContentIcon";
import IngredientsIcon from "../svg/IngredientsIcon";
import OrdersIcon from "../svg/OrdersIcon";
import MemberIcon from "../svg/MemberIcon";

const iconSelect = {
  제목: <TitleIcon className="w-6 h-6" />,
  사진: <PictureIcon className="w-6 h-6" />,
  소개: <ContentIcon className="w-7 h-7" />,
  내용: <ContentIcon className="w-7 h-7" />,
  재료: <IngredientsIcon className="w-7 h-7" />,
  조리순서: <OrdersIcon className="w-7 h-7" />,
  인원수: <MemberIcon className="w-7 h-7" />,
};

interface PostCardsProps {
  title: keyof typeof iconSelect;
  description: string;
  isEmpty: boolean;
}

const PostCard = ({ title, description, isEmpty }: PostCardsProps) => {
  return (
    <div
      className={`flex flex-1 items-center justify-between gap-2 p-5 pc:p-7 border-2 rounded-lg border-positive-300 hover:bg-positive-50 active:bg-positive-100 text-sm pc:text-md font-semibold shadow-md ${!isEmpty ? "bg-positive-200" : ""}`}
    >
      <div className="flex items-center gap-2 w-28">
        {iconSelect[title]}
        <div className="w-full">{title}</div>
      </div>
      <div className="flex w-48 pc:w-64">
        {!isEmpty ? (
          <>
            <div className="w-full text-normal-700 text-center">입력 완료</div>
            <AlarmIcon />
          </>
        ) : (
          <div className="w-full text-normal-700 text-center">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
