import DamulButton from "@/components/common/DamulButton";
import KakaoIcon from "@/components/svg/KakaoIcon";
import GoogleIcon from "@/components/svg/GoogleIcon";
import NaverIcon from "@/components/svg/NaverIcon";

const LoginPage = () => {
  const onLoginGoogle = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_OAUTH2_LOGIN_URI;
  };

  const onLoginKakao = () => {
    window.location.href = import.meta.env.VITE_KAKAO_OAUTH2_LOGIN_URI;
  };

  const onLoginNaver = () => {
    window.location.href = import.meta.env.VITE_NAVER_OAUTH2_LOGIN_URI;
  };

  return (
    <div className="flex flex-col justify-center gap-36 h-full px-10">
      <p className="text-3xl sm:text-4xl">
        효율적인 식자재 관리
        <br />
        오직
        <div className="inline-block m-2 font-bold animate-bounce">다믈랭</div>
        에서
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex items-center">
          <hr className="flex-1 border-normal-50" />
          <p className="mx-2 text-center text-normal-300 text-sm sm:text-base">
            SNS 계정으로 간편하게 로그인 하세요.
          </p>
          <hr className="flex-1 border-normal-50" />
        </div>

        <DamulButton
          variant="shadow"
          className="w-full"
          onClick={onLoginGoogle}
        >
          <div className="flex items-center px-8 w-full">
            <GoogleIcon />
            <p className="flex-1 text-sm sm:text-base">구글로 시작하기</p>
          </div>
        </DamulButton>

        <DamulButton variant="shadow" className="w-full" onClick={onLoginKakao}>
          <div className="flex items-center px-8 w-full">
            <KakaoIcon className="w-6" />
            <p className="flex-1 text-sm sm:text-base">카카오로 시작하기</p>
          </div>
        </DamulButton>

        <DamulButton variant="shadow" className="w-full" onClick={onLoginNaver}>
          <div className="flex items-center px-8 w-full">
            <NaverIcon />
            <p className="flex-1 text-sm sm:text-base">네이버로 시작하기</p>
          </div>
        </DamulButton>
      </div>
    </div>
  );
};

export default LoginPage;
