import DamulButton from "@/components/common/DamulButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

interface ReportData {
  reportCategoryId: number;
  reportType: string;
  targetId: number;
  reportImageFile: File | null;
  description: string;
}

const ReportPage = () => {
  const [reportData, setReportData] = useState<ReportData>({
    reportCategoryId: 0,
    reportType: "레시피",
    targetId: 0,
    reportImageFile: null,
    description: "",
  });
  const fileInput = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReportData({ ...reportData, reportImageFile: e.target.files[0] });
    }
  };

  const onAddFile = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  return (
    <div className="px-10 py-8">
      <h1 className="text-xl font-black text-normal-700">신고 접수하기</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-10 mt-3">
        <div className="flex flex-col justify-end w-full">
          <Label
            htmlFor="nickname"
            className="text-sm text-positive-400 font-bold"
          >
            신고 분류
          </Label>
          <Select
            value={String(reportData.reportCategoryId)}
            onValueChange={(value) =>
              setReportData({
                ...reportData,
                reportCategoryId: parseInt(value),
              })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="정렬 방식" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>분류</SelectLabel>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="0"
                >
                  도배
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="1"
                >
                  욕설
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                  value="2"
                >
                  사행성
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full items-end space-x-3">
          <div className="flex flex-col justify-end w-full">
            <p className="text-sm text-positive-400 font-bold">스크린샷</p>
            <p className="flex items-center h-10 px-3 rounded-lg border border-normal-200">
              {reportData.reportImageFile?.name}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onChangeFile}
              ref={fileInput}
            />
          </div>

          <DamulButton variant="positive" onClick={onAddFile}>
            사진 추가
          </DamulButton>
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
            placeholder="신고 내용을 입력해 주세요."
            // value={userSetting.selfIntroduction}
            // onChange={handleInput}
          />
          {/* <p
            className={`text-end text-xs ${userSetting.selfIntroduction.length === 255 ? "text-negative-400" : "text-normal-400"}`}
          >
            {userSetting.selfIntroduction.length} / 255
          </p> */}
        </div>

        <DamulButton
          variant="positive"
          size="full"
          textSize="base"
          onClick={() => {}}
        >
          신고하기
        </DamulButton>
      </form>
    </div>
  );
};

export default ReportPage;
