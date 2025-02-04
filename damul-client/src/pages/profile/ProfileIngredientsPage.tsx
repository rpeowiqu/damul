import { useOutletContext } from "react-router-dom";

const ProfileIngredientsPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <h1 className="text-lg font-bold">{user.nickname}님이 보유중인 식재료</h1>
    </div>
  );
};

export default ProfileIngredientsPage;
