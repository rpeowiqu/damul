import { useNavigate } from "react-router-dom";
import DamulButton from "../common/DamulButton";
import WriteIcon from "../svg/WriteIcon";

interface PostButtonProps {
  to: string;
}

const PostButton = ({ to }: PostButtonProps) => {
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
