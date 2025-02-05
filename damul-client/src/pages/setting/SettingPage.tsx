import { ChangeEvent, FormEvent, useState } from "react";
import ImageUploader from "@/components/common/ImageUploader";
import defaultProfile from "@/assets/profile.png";
import defaultProfileBg from "@/assets/profile-background.jpg";
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
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface UserSetting {
  nickname: string;
  selfIntroduction: string;
  profileImage: string;
  backgroundImage: string;
  accessRange: "public" | "friends" | "private";
  isWarning: boolean;
}

const SettingPage = () => {
  const [userSetting, setUserSetting] = useState<UserSetting>({
    nickname: "",
    selfIntroduction: "",
    profileImage: defaultProfile,
    backgroundImage: defaultProfileBg,
    accessRange: "public",
    isWarning: true,
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [infoText, setInfoText] = useState<string>("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 닉네임 유효성 검사 문구가 Falsy일 경우, 회원 정보 수정이 가능하다.
    if (!infoText) {
      alert("회원 정보가 수정되었습니다.");
    }
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "nickname":
        // if (!isValidNickname(value)) {
        //   setInfoText("닉네임은 한글, 영문 2-8자로만 구성되어야 합니다.");
        // } else {
        //   setInfoText("");
        // }
        setUserSetting({ ...userSetting, nickname: value });
        break;
      case "introduction":
        // 자기소개는 255자를 넘을 수 없다.
        if (value.length <= 255) {
          setUserSetting({ ...userSetting, selfIntroduction: value });
        }
        break;
    }
  };

  return (
    <div className="px-10 py-8">
      <h1 className="text-xl font-black text-normal-700">프로필 수정</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-10 mt-3">
        <div>
          <p className="text-sm text-positive-400 font-bold">
            프로필 및 배경 이미지
          </p>

          <div className="relative">
            <ImageUploader
              defaultImage={userSetting.backgroundImage}
              setFile={setBackgroundFile}
              className="relative w-full h-44"
            >
              {({ onEdit, onReset }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 bg-white hover:bg-normal-100 border border-normal-100 rounded-full p-1"
                    >
                      <EditIcon className="w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>프로필 배경 변경하기</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={onReset}>
                      기본 배경으로 변경
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onEdit}>
                      이 기기에서 찾기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </ImageUploader>

            <ImageUploader
              defaultImage={userSetting.profileImage}
              setFile={setProfileFile}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-normal-50 bg-white overflow-hidden"
            >
              {({ onEdit, onReset }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="absolute bottom-3 right-5 bg-white hover:bg-normal-100 border border-normal-100 rounded-full p-1"
                    >
                      <EditIcon className="w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      프로필 이미지 변경하기
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={onReset}>
                      기본 이미지로 변경
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onEdit}>
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
          <p>jongwoo@google.com</p>
        </div>

        <div className="relative">
          <div className="flex w-full items-end space-x-3">
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
                onChange={handleInput}
                className="focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0"
                required
              />
            </div>

            <DamulButton variant="positive" className="text-sm">
              중복 확인
            </DamulButton>
          </div>

          <p className="absolute -bottom-6 text-sm text-negative-400 min-h-5">
            {infoText}
          </p>
        </div>

        <div className="flex flex-col justify-end w-full">
          <Label
            htmlFor="introduction"
            className="text-sm text-positive-400 font-bold"
          >
            자기소개
          </Label>
          <Textarea
            id="introduction"
            name="introduction"
            className="resize-none focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0"
            placeholder="회원님에 대해 자유롭게 소개해 보세요."
            value={userSetting.selfIntroduction}
            onChange={handleInput}
          />
          <p
            className={`text-end text-xs  ${userSetting.selfIntroduction.length === 255 ? "text-negative-400" : "text-normal-400"}`}
          >
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
            onValueChange={(value) =>
              setUserSetting({
                ...userSetting,
                accessRange: value as "public" | "friends" | "private",
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
                  value="public"
                >
                  전체 공개
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="friends"
                >
                  친구만 공개
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="private"
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
              checked={userSetting.isWarning}
              onCheckedChange={(checked: boolean) => {
                setUserSetting({ ...userSetting, isWarning: checked });
              }}
              className="data-[state=checked]:bg-positive-200"
            />
            <p
              className={`text-sm ${userSetting.isWarning ? "text-positive-400" : "text-normal-400"}`}
            >
              {userSetting.isWarning
                ? "재확인 알림이 나타납니다."
                : "재확인 알림이 나타나지 않습니다."}
            </p>
          </div>
        </div>

        <div>
          <Link to={"/login"} className="text-sm text-normal-300 underline">
            로그아웃
          </Link>
        </div>

        <DamulButton type="submit" variant="positive">
          수정하기
        </DamulButton>
      </form>
    </div>
  );
};

export default SettingPage;
