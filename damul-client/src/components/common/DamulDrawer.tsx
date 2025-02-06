import { JSX } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface DamulDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  triggerContent: JSX.Element;
  headerContent: JSX.Element;
  footerContent: JSX.Element;
  onFooterClick?: () => void;
  onTriggerClick?: () => void;
}

const DamulDrawer = ({
  isOpen,
  onOpenChange,
  triggerContent,
  headerContent,
  footerContent,
  onFooterClick,
  onTriggerClick,
}: DamulDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger onClick={onTriggerClick}>{triggerContent}</DrawerTrigger>
      <DrawerContent className="bottom-16 z-40">
        <DrawerTitle></DrawerTitle>
        <DrawerHeader>{headerContent}</DrawerHeader>
        <DrawerDescription></DrawerDescription>
        <DrawerFooter onClick={onFooterClick}>{footerContent}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DamulDrawer;
