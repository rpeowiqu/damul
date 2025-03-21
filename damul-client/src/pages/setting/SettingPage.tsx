import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ImageUploader from "@/components/common/ImageUploader";
import defaultProfileImage from "@/assets/profile.png";
import defaultBackgroundImage from "@/assets/profile-background.jpg";
import EditIcon from "@/components/svg/EditIcon";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DamulButton from "@/components/common/DamulButton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/service/auth";
import {
  checkNicknameDuplication,
  getUserSetting,
  modifyUserSetting,
} from "@/service/user";
import { isValidNickname } from "@/utils/regex";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@/components/svg/GoogleIcon";
import KakaoIcon from "@/components/svg/KakaoIcon";
import NaverIcon from "@/components/svg/NaverIcon";
import useAuth from "@/hooks/useAuth";
import DamulSection from "@/components/common/DamulSection";

interface UserSetting {
  nickname: string;
  email: string;
  selfIntroduction: string;
  profileImageUrl: string;
  profileBackgroundImageUrl: string;
  accessRange: "PUBLIC" | "FRIENDS" | "PRIVATE";
  warningEnabled: boolean;
  profileImageDefault: boolean;
  backgroundImageDefault: boolean;
}

const SettingPage = () => {
  const { data, isLoading, refetch } = useAuth();
  const [userSetting, setUserSetting] = useState<UserSetting>({
    nickname: "",
    email: "",
    selfIntroduction: "",
    profileImageUrl: "",
    profileBackgroundImageUrl: "",
    accessRange: "PUBLIC",
    warningEnabled: true,
    profileImageDefault: false,
    backgroundImageDefault: false,
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "none" | "available" | "duplicate" | "validLength"
  >("none");
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchUserSetting = async () => {
      try {
        const response = await getUserSetting();
        if (response) {
          setUserSetting({
            ...response.data,
            profileImageDefault: response.data.profileImageUrl ? false : true,
            backgroundImageDefault: response.data.profileBackgroundImageUrl
              ? false
              : true,
          });
        }
      } catch (error) {
        // console.log(error);
      } finally {
        setIsFetched(true);
      }
    };

    fetchUserSetting();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newStatus = await checkNickname();
      if (newStatus === "available") {
        const response = await modifyUserSetting(
          {
            nickname: userSetting.nickname,
            selfIntroduction: userSetting.selfIntroduction,
            accessRange: userSetting.accessRange,
            warningEnabled: userSetting.warningEnabled,
            profileImageDefault:
              !profileFile && userSetting.profileImageDefault,
            backgroundImageDefault:
              !backgroundFile && userSetting.backgroundImageDefault,
          },
          profileFile,
          backgroundFile,
        );
        if (response?.status === 200) {
          refetch();
          alert("회원정보가 변경 되었습니다.");
          return;
        }
      }
      setStatus(newStatus!);
    } catch (error) {
      // console.error(error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "nickname":
        if (!isValidNickname(value)) {
          setStatus("validLength");
        } else {
          setStatus("none");
        }
        setUserSetting({ ...userSetting, nickname: value });
        break;
      case "selfIntroduction":
        if (value.length <= 255) {
          setUserSetting({ ...userSetting, selfIntroduction: value });
        }
        break;
    }
  };

  const handleDuplicationCheck = async () => {
    try {
      const newStatus = await checkNickname();
      setStatus(newStatus!);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleBackgroundImageChange = (isDefault: boolean) => {
    setUserSetting({
      ...userSetting,
      backgroundImageDefault: isDefault,
    });
  };

  const handleProfileImageChange = (isDefault: boolean) => {
    setUserSetting({
      ...userSetting,
      profileImageDefault: isDefault,
    });
  };

  const checkNickname = async () => {
    // 동일한 닉네임을 사용할 경우 사용 가능하다는 문구를 출력한다.
    if (userSetting.nickname === data?.data.nickname) {
      return "available";
    }

    if (!isValidNickname(userSetting.nickname)) {
      return "validLength";
    } else {
      try {
        const response = await checkNicknameDuplication(userSetting.nickname);
        if (!response.data) {
          return "available";
        } else {
          return "duplicate";
        }
      } catch (error) {
        // console.log(error);
      }
    }
  };

  const getInfoText = () => {
    switch (status) {
      case "available":
        return "사용 가능한 닉네임입니다!";
      case "duplicate":
        return "이미 사용중인 닉네임입니다.";
      case "validLength":
        return "닉네임은 한글, 영문 2-8자로만 구성되어야 합니다.";
    }

    return "";
  };

  const onLogout = async () => {
    const response = await logout();
    if (response?.status === 200) {
      alert("로그아웃 되었습니다.");
      sessionStorage.removeItem("user");
      nav("/login", { replace: true });
    }
  };

  const getEmailIcon = () => {
    if (userSetting.email.endsWith("gmail.com")) {
      return <GoogleIcon className="size-4" />;
    } else if (userSetting.email.endsWith("kakao.com")) {
      return <KakaoIcon className="size-4" />;
    } else if (userSetting.email.endsWith("naver.com")) {
      return <NaverIcon className="size-4" />;
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isFetched) {
    return null;
  }

  return (
    <DamulSection
      title={
        <div className="flex items-center gap-3">
          <button className="font-black" onClick={() => nav(-1)}>
            &lt;
          </button>
          <h1>설정</h1>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div>
          <p className="text-sm text-positive-400 font-bold">
            프로필 및 배경 이미지
          </p>

          <div className="relative">
            <ImageUploader
              defaultImage={defaultBackgroundImage}
              initImage={userSetting.profileBackgroundImageUrl}
              setFile={setBackgroundFile}
              onChange={() => handleBackgroundImageChange(false)}
              className="relative w-full h-44"
            >
              {({ onEdit, onReset }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 bg-white hover:bg-positive-50 border border-positive-300 rounded-full p-1"
                    >
                      <EditIcon className="size-4 fill-positive-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>프로필 배경 변경하기</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        handleBackgroundImageChange(true);
                        onReset();
                      }}
                      className="data-[highlighted]:bg-positive-50"
                    >
                      기본 배경으로 변경
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={onEdit}
                      className="data-[highlighted]:bg-positive-50"
                    >
                      이 기기에서 찾기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </ImageUploader>

            <ImageUploader
              defaultImage={defaultProfileImage}
              initImage={userSetting.profileImageUrl}
              setFile={setProfileFile}
              onChange={() => handleProfileImageChange(false)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-normal-50 bg-white overflow-hidden"
            >
              {({ onEdit, onReset }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="absolute bottom-3 right-5 bg-white hover:bg-positive-50 border border-positive-300 rounded-full p-1"
                    >
                      <EditIcon className="size-4 fill-positive-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      프로필 이미지 변경하기
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        handleProfileImageChange(true);
                        onReset();
                      }}
                      className="data-[highlighted]:bg-positive-50"
                    >
                      기본 이미지로 변경
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={onEdit}
                      className="data-[highlighted]:bg-positive-50"
                    >
                      이 기기에서 찾기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </ImageUploader>
          </div>
        </div>

        <div>
          <p className="text-sm text-positive-400 font-bold">
            연동된 이메일 계정
          </p>
          <div className="flex items-center gap-2">
            {getEmailIcon()}
            <p className="text-sm">{userSetting.email}</p>
          </div>
        </div>

        <div className="relative">
          <div className="flex w-full items-end gap-3">
            <div className="flex flex-col justify-end w-full">
              <Label
                htmlFor="nickname"
                className="text-sm text-positive-400 font-bold"
              >
                닉네임
              </Label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="닉네임을 입력해 주세요."
                value={userSetting.nickname}
                onChange={handleInputChange}
                className={clsx(
                  "focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0 text-sm",
                  {
                    "focus-visible:ring-negative-400":
                      status === "duplicate" || status === "validLength",
                  },
                )}
              />
            </div>

            <DamulButton
              variant="positive"
              className="text-sm"
              onClick={handleDuplicationCheck}
            >
              중복 확인
            </DamulButton>
          </div>

          <p
            className={clsx("absolute text-sm text-negative-400", {
              "text-positive-400": status === "available",
            })}
          >
            {getInfoText()}
          </p>
        </div>

        <div className="relative flex flex-col justify-end w-full">
          <Label
            htmlFor="selfIntroduction"
            className="text-sm text-positive-400 font-bold"
          >
            자기소개
          </Label>
          <Textarea
            id="selfIntroduction"
            name="selfIntroduction"
            className="resize-none focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0 text-sm"
            placeholder="회원님에 대해 자유롭게 소개해 보세요."
            value={userSetting.selfIntroduction}
            onChange={handleInputChange}
          />
          <p className="absolute right-0 -bottom-5 text-xs">
            {userSetting.selfIntroduction.length} / 255
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-positive-400 font-bold">
            내 식자재 공개 범위
          </p>
          <Select
            name="accessRange"
            value={userSetting.accessRange}
            onValueChange={(value: "PUBLIC" | "FRIENDS" | "PRIVATE") =>
              setUserSetting({
                ...userSetting,
                accessRange: value,
              })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="정렬 방식" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="PUBLIC"
                >
                  전체 공개
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="FRIENDS"
                >
                  친구만 공개
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="PRIVATE"
                >
                  비공개
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label
            htmlFor="warning"
            className="text-sm text-positive-400 font-bold"
          >
            식자재 삭제 재확인 여부
          </Label>
          <div className="flex items-center gap-3">
            <Switch
              id="warning"
              checked={userSetting.warningEnabled}
              onCheckedChange={(checked: boolean) => {
                setUserSetting({ ...userSetting, warningEnabled: checked });
              }}
              className="data-[state=checked]:bg-positive-200"
            />
            <p
              className={clsx(
                "text-sm",
                userSetting.warningEnabled
                  ? "text-positive-400"
                  : "text-normal-400",
              )}
            >
              {userSetting.warningEnabled
                ? "재확인 알림이 나타납니다."
                : "재확인 알림이 나타나지 않습니다."}
            </p>
          </div>
        </div>

        <p
          className="w-fit text-sm text-normal-300 underline cursor-pointer"
          onClick={onLogout}
        >
          로그아웃
        </p>

        <DamulButton type="submit" variant="positive" className="w-full">
          수정하기
        </DamulButton>
      </form>
    </DamulSection>
  );
};

export default SettingPage;
