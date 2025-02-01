import { JSX } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface PostDrawerProps {
  trigerConent: JSX.Element;
  headerContent: JSX.Element;
  footerContent: JSX.Element;
  onFooterClick: () => void;
}

const PostDrawer = ({
  trigerConent,
  headerContent,
  footerContent,
  onFooterClick,
}: PostDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger>{trigerConent}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>{headerContent}</DrawerHeader>
        <DrawerFooter onClick={onFooterClick}>{footerContent}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PostDrawer;
