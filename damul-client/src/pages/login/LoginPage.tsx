import DamulButton from "@/components/common/DamulButton";
import KakaoIcon from "@/components/svg/KakaoIcon";
import GoogleIcon from "@/components/svg/GoogleIcon";
import NaverIcon from "@/components/svg/NaverIcon";

const LoginPage = () => {
  const onClickKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
      import.meta.env.VITE_KAKAO_APP_KEY
    }&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`;
  };

  const onClickGoogleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
  };

  const onClickNaverLogin = () => {
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_NAVER_REDIRECT_URI}&state=damul`;
  };

  return (
    <main className="px-10">
      <p className="mt-40 text-4xl">
        효율적인 식자재 관리
        <br />
        오직
        <div className="inline-block m-2 font-bold animate-bounce">다믈램</div>
        에서
      </p>

      <div className="flex flex-col gap-5 mt-36">
        <div className="flex items-center px-10">
          <hr className="flex-1" />
          <p className="mx-2 text-center text-normal-300">
            SNS 계정으로 간편하게 로그인 하세요.
          </p>
          <hr className="flex-1" />
        </div>

        <div className="relative w-full">
          <KakaoIcon className="absolute w-6 left-12 top-2" />
          <DamulButton
            variant="shadow"
            size="full"
            textSize="base"
            onClick={onClickKakaoLogin}
          >
            카카오로 시작하기
          </DamulButton>
        </div>

        <div className="relative w-full">
          <GoogleIcon className="absolute w-6 left-12 top-2" />
          <DamulButton
            variant="shadow"
            size="full"
            textSize="base"
            onClick={onClickGoogleLogin}
          >
            구글로 시작하기
          </DamulButton>
        </div>

        <div className="relative w-full">
          <NaverIcon className="absolute w-6 left-12 top-2" />
          <DamulButton
            variant="shadow"
            size="full"
            textSize="base"
            onClick={onClickNaverLogin}
          >
            네이버로 시작하기
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
    </main>
  );
};

export default LoginPage;
