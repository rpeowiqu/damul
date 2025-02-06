import { Link, useNavigate, useParams } from "react-router-dom";
import DamulButton from "../common/DamulButton";

const ReportDetail = () => {
  const { reportId } = useParams();
  const nav = useNavigate();

  return (
    <div className="w-full max-w-[50rem] mx-auto border border-normal-100 mt-5 px-5 pb-4 rounded-lg">
      <h1 className="text-xl font-black text-center p-3 mb-3 border-b border-normal-100">
        신고 상세 내역
      </h1>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">처리 상태</p>
          <p className="text-positive-400">처리 완료</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">신고 번호</p>
          <p>{reportId}</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">작성자</p>
          <p>토마토헤이터12</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">신고 대상</p>
          <div>
            <Link to={"/admin/users/1"} className="text-blue-400 underline">
              토마토러버전종우
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">게시글 분류</p>
          <p>레시피 게시판</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">구분</p>
          <p>도배</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">신고 사유</p>
          <p>토마토를 자꾸 도배하네요;; 제재 좀 부탁드립니다.</p>
        </div>

        <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
          <p className="text-center font-extrabold">URL</p>
          <div>
            <Link
              to={"/community/recipe/1"}
              className="text-blue-400 underline"
            >
              바로가기
            </Link>
          </div>
        </div>

        <div className="flex justify-center gap-5 mt-5">
          <DamulButton variant="positive" size="md" onClick={() => {}}>
            신고 반영
          </DamulButton>

          <DamulButton variant="negative" size="md" onClick={() => {}}>
            신고 기각
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
