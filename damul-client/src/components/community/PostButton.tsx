import { useNavigate } from "react-router-dom";
import DamulButton from "../common/DamulButton";

interface PostButtonProps {
  to: string;
  icon: JSX.Element | string;
}

const PostButton = ({ to, icon }: PostButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed w-full flex justify-end bottom-0 max-w-[600px]">
      <div className="relative">
        <div className="absolute z-40 flex flex-col items-center w-20 bottom-20 right-5 pc:right-10">
          <div>
            <DamulButton
              variant="normal-outline"
              className="rounded-full w-12 h-12 text-xl"
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
