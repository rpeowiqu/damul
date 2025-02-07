import { useNavigate } from "react-router-dom";
import DamulButton from "../common/DamulButton";
import WriteIcon from "../svg/WriteIcon";

interface PostButtonProps {
  to: string;
}

const PostButton = ({ to }: PostButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed w-full flex justify-end bottom-0 max-w-[600px]">
      <div className="relative">
        <div className="absolute z-40 flex flex-col items-center w-20 bottom-20 right-0">
          <div>
            <DamulButton
              variant="round"
              px={3}
              onClick={() => {
                navigate(`${to}`);
              }}
            >
              {icon}
            </DamulButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostButton;
