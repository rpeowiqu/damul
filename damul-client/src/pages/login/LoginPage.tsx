import DamulButton from "@/components/common/DamulButton";
import KakaoIcon from "@/components/svg/KakaoIcon";
import GoogleIcon from "@/components/svg/GoogleIcon";
import NaverIcon from "@/components/svg/NaverIcon";

const LoginPage = () => {
  return (
    <main className="px-10">
      <p className="text-4xl mt-40">
        당신의 식자재 관리
        <br />
        오직 <b>다믈램</b>에서
      </p>

      <div className="flex flex-col gap-5 mt-24">
        <div className="flex items-center px-10">
          <hr className="flex-1" />
          <p className="text-normal-300 text-center mx-2">
            SNS 계정으로 간편하게 로그인 하세요.
          </p>
          <hr className="flex-1" />
        </div>

        <div className="w-full relative">
          <KakaoIcon className="absolute w-6 left-12 top-2" />
          <DamulButton
            variant="shadow"
            size="full"
            textSize="base"
            onClick={() => {}}
          >
            카카오로 시작하기
          </DamulButton>
        </div>

        <div className="w-full relative">
          <GoogleIcon className="absolute w-6 left-12 top-2" />
          <DamulButton
            variant="shadow"
            size="full"
            textSize="base"
            onClick={() => {}}
          >
            구글로 시작하기
          </DamulButton>
        </div>

        <div className="w-full relative">
          <NaverIcon className="absolute w-6 left-12 top-2" />
          <DamulButton
            variant="shadow"
            size="full"
            textSize="base"
            onClick={() => {}}
          >
            네이버로 시작하기
          </DamulButton>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
