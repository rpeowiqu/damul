import { useNavigate } from "react-router-dom";
import DamulButton from "../common/DamulButton";

interface PostButtonProps {
  to: string;
  icon: JSX.Element | string;
}

const PostButton = ({ to, icon }: PostButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed w-full flex justify-end bottom-0 max-w-[600px] bg-white z-40">
      <div className="relative">
        <div className="absolute bottom-20 right-5 pc:right-8">
          <DamulButton
            className="size-12 transition ease-in-out duration-150 active:scale-95 rounded-full bg-white hover:bg-positive-50 border-positive-300 border-2"
            onClick={() => {
              navigate(`${to}`);
            }}
          >
            {icon}
          </DamulButton>
        </div>
      </div>
    </div>
  );
};

export default PostButton;
