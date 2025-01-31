import { useNavigate } from "react-router-dom";
import DamulButton from "../common/DamulButton";
import WriteIcon from "../svg/WriteIcon";

interface PostButtonProps {
  to: string;
}

const PostButton = ({ to }: PostButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-20 right-5">
      <DamulButton
        variant="round"
        px={3}
        onClick={() => {
          navigate(`/community/${to}/post`);
        }}
      >
        <WriteIcon />
      </DamulButton>
    </div>
  );
};

export default PostButton;
