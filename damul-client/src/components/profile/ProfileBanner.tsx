import Image from "@/components/common/Image";
import defaultProfile from "@/assets/profile.png";
import defaultProfileBg from "@/assets/profile-background.jpg";

interface ProfileBannerProps {
  nickname: string;
  imageUrl?: string;
  bgImageUrl?: string;
}

const ProfileBanner = ({
  nickname,
  imageUrl,
  bgImageUrl,
}: ProfileBannerProps) => {
  return (
    <div className="relative w-full h-44 select-none">
      <Image
        src={bgImageUrl ? bgImageUrl : defaultProfileBg}
        className="w-full h-full object-cover"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-normal-50 bg-white overflow-hidden">
        <Image
          src={imageUrl ? imageUrl : defaultProfile}
          className="w-full h-full"
        />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-white shadow-md rounded-full px-3 font-bold">
        {nickname}
      </div>
    </div>
  );
};

export default ProfileBanner;
