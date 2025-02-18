import DamulModal from "./DamulModal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import DamulButton from "./DamulButton";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import { report } from "@/service/report";
import { ReportForm } from "@/types/report";

interface ReportButtonProps {
  contentId: number;
  targetId: number;
  className?: string;
  children: ReactNode;
}

const ReportButton = ({
  contentId,
  targetId,
  className,
  children,
}: ReportButtonProps) => {
  const [isOpen, setIsOpen] = useCloseOnBack();
  const [reportForm, setReportForm] = useState<ReportForm>({
    reportCategoryId: 1,
    reportType: "RECIPE",
    contentType: "",
    targetId: 0,
    description: "",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await report({
        reportCategoryId: reportForm.reportCategoryId,
        reportType: reportForm.reportType,
        contentId,
        targetId,
        description: reportForm.description,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      alert("신고 처리 되었습니다.");
    }
  };

  const onChangeReportData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log(e.target.name, e.target.value);
    setReportForm({ ...reportForm, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className={className} onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <DamulModal
        isOpen={isOpen}
        onOpenChange={() => {
          if (isOpen) {
            history.back();
          }
        }}
        contentStyle="max-w-96"
      >
        <div>
          <h1 className="text-xl font-black text-normal-700">신고 접수하기</h1>
          <p className="text-negative-400">
            허위로 신고할 경우 서비스 이용이 제한될 수 있습니다.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-positive-400 font-bold">신고 대상</p>
              <p className="text-base">토마토러버전종우</p>
            </div>

            <div className="flex flex-col justify-end w-full gap-1">
              <Label
                htmlFor="nickname"
                className=" text-positive-400 font-bold"
              >
                신고 분류
              </Label>
              <Select
                name="reportCategoryId"
                value={String(reportForm.reportCategoryId)}
                onValueChange={(value) =>
                  setReportForm({
                    ...reportForm,
                    reportCategoryId: parseInt(value),
                  })
                }
                required
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="정렬 방식" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                      value="1"
                    >
                      도배
                    </SelectItem>
                    <SelectItem
                      className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                      value="2"
                    >
                      욕설
                    </SelectItem>
                    <SelectItem
                      className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                      value="3"
                    >
                      사행성
                    </SelectItem>
                    <SelectItem
                      className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                      value="4"
                    >
                      개인정보 침해
                    </SelectItem>
                    <SelectItem
                      className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                      value="5"
                    >
                      기타
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="reportCategoryId"
                value={reportForm.reportCategoryId || ""}
                required
              />
            </div>

            <div className="flex flex-col justify-end w-full gap-1">
              <Label
                htmlFor="description"
                className=" text-positive-400 font-bold"
              >
                신고 사유
              </Label>
              <Textarea
                id="description"
                name="description"
                className="h-28 resize-none focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0"
                placeholder="신고 내용을 입력해 주세요."
                value={reportForm.description}
                onChange={onChangeReportData}
                required
              />
            </div>

            <DamulButton type="submit" variant="positive" className="w-full">
              신고 하기
            </DamulButton>
          </form>
        </div>
      </DamulModal>
    </div>
  );
};

export default ReportButton;
