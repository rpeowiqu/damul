import DamulButton from "@/components/common/DamulButton";
import AlarmIcon from "@/components/svg/AlarmIcon";

const LoginPage = () => {
  return (
    <div className="text-center">
      <p>로그인 페이지</p>

      <div className="flex flex-col gap-10">
        <div className="flex justify-center gap-3">
          <DamulButton variant="positive" onClick={() => {}}>
            <AlarmIcon />
            식자재 제거하기
          </DamulButton>
          <DamulButton variant="positive-outline" onClick={() => {}}>
            식자재 제거하기
          </DamulButton>
        </div>
        <div className="flex justify-center gap-3">
          <DamulButton variant="negative" onClick={() => {}}>
            <AlarmIcon />
            식자재 제거하기
          </DamulButton>
          <DamulButton variant="negative-outline" onClick={() => {}}>
            식자재 제거하기
          </DamulButton>
        </div>
        <div className="flex justify-center gap-3">
          <DamulButton variant="normal" onClick={() => {}}>
            <AlarmIcon />
            식자재 제거하기
          </DamulButton>
          <DamulButton variant="normal-outline" onClick={() => {}}>
            식자재 제거하기
          </DamulButton>
        </div>
        <div className="flex justify-center gap-3">
          <DamulButton variant="positive" onClick={() => {}}>
            1
          </DamulButton>
          <DamulButton
            variant="positive-outline"
            size="sm"
            textSize="lg"
            onClick={() => {}}
          >
            1
          </DamulButton>
          <DamulButton variant="positive-outline" onClick={() => {}}>
            <AlarmIcon />
          </DamulButton>
        </div>
        <div className="flex justify-center gap-3">
          <DamulButton
            variant="positive"
            size="full"
            textSize="lg"
            onClick={() => {}}
          >
            저장하기
          </DamulButton>
        </div>
        <div className="flex justify-center gap-3">
          <DamulButton
            variant="shadow"
            size="full"
            textSize="lg"
            onClick={() => {}}
          >
            카카오로 시작하기
          </DamulButton>
        </div>
      </div>

      <div className="h-24 bg-red-400"></div>
      <div className="h-24 bg-blue-400"></div>
      <div className="h-24 bg-red-400"></div>
      <div className="h-24 bg-blue-400"></div>
      <div className="h-24 bg-red-400"></div>
      <div className="h-24 bg-blue-400"></div>
      <div className="h-24 bg-red-400"></div>
      <div className="h-24 bg-blue-400"></div>
    </div>
  );
};

export default LoginPage;
