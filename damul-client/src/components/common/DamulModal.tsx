import { ReactNode } from "react";
import clsx from "clsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DamulModalProps {
  isOpen: boolean; // 모달의 열림 상태
  onOpenChange: () => void; // 부모에서 모달 상태를 제어하는 함수
  contentStyle?: string; // 모달창 전체 스타일
  headerStyle?: string; // 모달창 헤더 부분 스타일
  titleStyle?: string; // 모달창 제목 텍스트 스타일
  title?: string; // 모달창 제목 텍스트
  children: ReactNode; // 모달창 본문 요소
  footerComponent?: ReactNode; // 모달창 하단 컴포넌트 요소
}

const defaultContentStyle = "p-5 max-w-88 pc:max-w-96 rounded-xl";
const defaultHeaderStyle = "pb-3 border-b border-b-normal-100";
const defaultTitleStyle = "text-positive-300 text-xl text-center";

const DamulModal = ({
  isOpen,
  onOpenChange,
  contentStyle,
  headerStyle,
  titleStyle,
  title,
  children,
  footerComponent,
}: DamulModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={clsx(defaultContentStyle, contentStyle)}>
        {title ? (
          <DialogHeader className={clsx(defaultHeaderStyle, headerStyle)}>
            <DialogTitle className={clsx(defaultTitleStyle, titleStyle)}>
              {title}
            </DialogTitle>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
        )}

        <DialogDescription>
          <div>{children}</div>
        </DialogDescription>
        {footerComponent && <DialogFooter>{footerComponent}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default DamulModal;
