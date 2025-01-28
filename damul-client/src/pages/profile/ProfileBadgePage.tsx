import BadgeShowcase from "@/components/profile/BadgeShowcase";

const dummyBadgeData = [
  {
    level: 5,
    title: "육식 공룡",
    condition: "육류 식자재 500회 이상 등록",
    description:
      "“육식 공룡은 커다란 머리, 강한 턱, 날카로운 이빨을 주로 사용하였습니다.”",
  },
  {
    level: 5,
    title: "Divider",
    condition: "나눔 게시글 500회 이상 작성",
    description: "“나눔은 여유가 있어야만 할 수 있는게 아니야.”",
  },
  {
    level: 4,
    title: "농부의 피땀을 아는 자",
    condition: "곡류 식자재 100회 이상 등록",
    description: "“밥그릇에 밥알 하나 남기지 않는다.”",
  },
  {
    level: 3,
    title: "포세이돈",
    condition: "수산물 식자재 50회 이상 등록",
    description: "“Under the sea, under the sea~”",
  },
  {
    level: 2,
    title: "넌 부화할 수 없다",
    condition: "달걀류 식자재 10회 이상 등록",
    description: "“단지 껍질 까는 시간조차 아까웠을 뿐이다.”",
  },
  {
    level: 1,
    title: "간장공장공장장",
    condition: "양념류 1회 이상 등록",
    description: "“간장공장공장장이 간ㅈ...그만 하입시다.”",
  },
  {
    level: 1,
    title: "목표키 2m",
    condition: "유제품 식자재 1회 이상 등록",
    description: "“그래서 성장판 오픈일이 언제라구요?”",
  },
];

const ProfileBadgePage = () => {
  return (
    <div className="flex flex-col gap-2 h-full p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">토마토러버전종우님의 뱃지 전시대</h1>
        <p className="text-normal-600">그동안 획득한 뱃지들을 살펴보세요!</p>
      </div>

      <BadgeShowcase badgeList={dummyBadgeData} />
    </div>
  );
};

export default ProfileBadgePage;
