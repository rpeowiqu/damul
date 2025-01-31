import { Dispatch, ReactNode, SetStateAction } from "react";
import clsx from "clsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DamulModalProps {
  isOpen: boolean; // 모달의 열림 상태
  setIsOpen: Dispatch<SetStateAction<boolean>>; // 부모에서 모달 상태를 제어하는 함수
  triggerComponent: ReactNode; // 모달창을 열기 위한 컴포넌트 요소
  contentStyle?: string; // 모달창 전체 스타일
  headerStyle?: string; // 모달창 헤더 부분 스타일
  titleStyle?: string; // 모달창 제목 텍스트 스타일
  title: string; // 모달창 제목 텍스트
  children: ReactNode; // 모달창 본문 요소
  footerComponent?: ReactNode; // 모달창 하단 컴포넌트 요소
}

const defaultContentStyle = "p-5 max-w-96 rounded-xl";
const defaultHeaderStyle = "pb-3 border-b border-b-normal-100";
const defaultTitleStyle = "text-positive-300 text-xl";

const DamulModal = ({
  isOpen,
  setIsOpen,
  triggerComponent,
  contentStyle,
  headerStyle,
  titleStyle,
  title,
  children,
  footerComponent,
}: DamulModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className={clsx(defaultContentStyle, contentStyle)}>
        <DialogHeader className={clsx(defaultHeaderStyle, headerStyle)}>
          <DialogTitle className={clsx(defaultTitleStyle, titleStyle)}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{children}</DialogDescription>
        {footerComponent && <DialogFooter>{footerComponent}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default DamulModal;
