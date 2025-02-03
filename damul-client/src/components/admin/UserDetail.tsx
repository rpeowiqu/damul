import { useNavigate, useParams } from "react-router-dom";
import Image from "../common/Image";
import DamulButton from "../common/DamulButton";

const UserDetail = () => {
  const { userId } = useParams();
  const nav = useNavigate();

  return (
    <div className="w-full max-w-[50rem] mx-auto border border-normal-100 mt-5 px-5 pb-4 rounded-lg">
      <h1 className="text-xl font-black text-center p-3 mb-3 border-b border-normal-100">
        유저 상세 정보
      </h1>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">계정 활성화 여부</p>
          <p className="text-positive-400">활성화</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">유저 아이디</p>
          <p>{userId}</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">누적 신고 횟수</p>
          <p>10회</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">연동된 이메일 계정</p>
          <p>jongwoo@gmail.com</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">닉네임</p>
          <p>토마토러버전종우</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">자기소개</p>
          <p>
            토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛
          </p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">프로필 이미지</p>
          <div className="flex flex-col">
            <Image className="w-24" />
            <p>profile.png</p>
          </div>
        </div>

        <div className="flex justify-center gap-5 mt-5">
          <DamulButton variant="negative" size="md" onClick={() => {}}>
            계정 비활성화
          </DamulButton>

          <DamulButton variant="normal" size="md" onClick={() => nav(-1)}>
            목록
          </DamulButton>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
