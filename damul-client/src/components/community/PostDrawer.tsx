import { useState, ReactNode, Dispatch, SetStateAction } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PostCard from "@/components/community/PostCard";
import DamulButton from "@/components/common/DamulButton";

interface PostDrawerProps {
  title: string;
  description: string;
  headerContent: (
    _setTitle: Dispatch<SetStateAction<string>>,
    _title: string,
  ) => ReactNode;
}

const PostDrawer = ({ title, description, headerContent }: PostDrawerProps) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Drawer>
      <DrawerTrigger>
        <PostCard title={title} description={description} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>{headerContent(setInputValue, inputValue)}</DrawerHeader>
        <DrawerFooter>
          <DamulButton variant="positive" onClick={() => {}}>
            완료
          </DamulButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PostDrawer;
