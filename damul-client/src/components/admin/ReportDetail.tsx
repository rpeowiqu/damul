import { useNavigate, useParams } from "react-router-dom";
import Image from "../common/Image";
import DamulButton from "../common/DamulButton";

const ReportDetail = () => {
  const { reportId } = useParams();
  const nav = useNavigate();

  return (
    <div className="w-full max-w-[50rem] mx-auto border border-normal-100 mt-5 px-5 pb-3 rounded-lg">
      <h1 className="text-xl font-black text-center p-3 mb-3 border-b border-normal-100">
        신고 상세 내역
      </h1>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">처리 상태</p>
          <p className="text-positive-400">처리 완료</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">신고번호</p>
          <p>{reportId}</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">닉네임</p>
          <p>토마토러버전종우</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">구분</p>
          <p>도배</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">내용</p>
          <p>
            토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛토맛토마토토맛
          </p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">첨부 파일</p>
          <div className="flex flex-col">
            <Image className="w-24" />
            <p>evidence.png</p>
          </div>
        </div>

        <div className="flex justify-center gap-5 mt-5">
          <DamulButton variant="positive" size="md" onClick={() => {}}>
            기각
          </DamulButton>

          <DamulButton variant="negative" size="md" onClick={() => {}}>
            정지
          </DamulButton>

          <DamulButton variant="normal" size="md" onClick={() => nav(-1)}>
            목록
          </DamulButton>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
