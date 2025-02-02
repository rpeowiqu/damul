import Image from "@/components/common/Image";
import AlarmIcon from "@/components/svg/AlarmIcon";

const CommunityRecipeDetailPage = () => {
  const mockData = {
    id: 1,
    title: "일본 현지 돈가스 만들기",
    isBookmarked: true,
    isLiked: false,
    createdAt: "2024-01-19 23:23",
    authorId: 2,
    authorName: "요리사서히",
    profileImageUrl: "string",
    viewCnt: 152,
    likeCnt: 32,
    contentImageUrl: "string",
    ingredients: [
      {
        id: 1,
        name: "당근",
        amount: "1/2",
        unit: "개",
      },
      {
        id: 2,
        name: "상추",
        amount: "100",
        unit: "g",
      },
      {
        id: 3,
        name: "진간장",
        amount: "2",
        unit: "T",
      },
    ],
    cookingOrders: [
      {
        id: 1,
        content: "당근 준비하숑",
        imageUrl: "string",
      },
      {
        id: 2,
        content: "당근을 자릅니다",
        imageUrl: "string",
      },
      {
        id: 3,
        content: "당근을 볶아요 아주그냥 볶아요",
        imageUrl: "string",
      },
    ],
    comments: [
      {
        id: 1,
        userId: 1,
        nickname: "요리사서히",
        profileImageUrl: "string",
        comment: "우와 맛있겠당",
        createdAt: "2025-01-29",
      },
      {
        id: 1,
        userId: 2,
        nickname: "토마토러버전종우",
        profileImageUrl: "string",
        comment: "인정하는 부분",
        parentId: 1,
        createdAt: "2025-01-30",
      },
    ],
  };

  return (
    <main className="text-center p-4 pc:p-6">
      <div className="flex justify-between p-2 border-b-1 border-neutral-300">
        <div className="text-start">
          <p className="text-sm text-neutral-600">레시피 게시판</p>
          <h3 className="text-lg font-semibold">{mockData.title}</h3>
        </div>
        <div className="flex flex-col justify-between items-end py-0.5">
          <AlarmIcon className="w-5 h-5" />
          <p className="text-xs text-neutral-500">{mockData.createdAt}</p>
        </div>
      </div>
      <div className="flex justify-between h-20 px-2">
        <div className="flex items-center">
          <Image
            src={mockData.profileImageUrl}
            className="w-12 h-12 rounded-full"
          />
          <p className="p-2 text-sm">{mockData.authorName}</p>
        </div>
        <div className="flex flex-col justify-between py-2">
          <div className="flex gap-2 items-center justify-end">
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">{mockData.viewCnt}</p>
            </div>
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">{mockData.likeCnt}</p>
            </div>
          </div>
          <div className="flex gap-2 py-2">
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">신고하기</p>
            </div>
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">수정하기</p>
            </div>
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">삭제</p>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={mockData.contentImageUrl}
        className="w-full h-52 object-cover rounded-lg"
      />
      <h3>소개</h3>
      <div>돈가스는 오스트리아의 슈니첼을 원형으로, 서양</div>
    </main>
  );
};

export default CommunityRecipeDetailPage;
