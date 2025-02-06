import { useNavigate } from "react-router-dom";
import DamulButton from "../common/DamulButton";

interface PostButtonProps {
  to: string;
  icon: JSX.Element;
}

const PostButton = ({ to, icon }: PostButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed left-0 -right-[30rem] bottom-20 mx-auto">
      <DamulButton
        className="size-12 rounded-full bg-white hover:bg-normal-50 border border-normal-200"
        onClick={() => navigate(`/community/${to}/post`)}
      >
        <WriteIcon />
      </DamulButton>
    </div>
  );
};

export default PostButton;
