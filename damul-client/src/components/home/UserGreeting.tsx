import useUserStore from "@/stores/user";

const UserGreeting = () => {
  const { myNickname } = useUserStore();

  return (
    <div className="flex items-center p-5">
      <div className="mr-2 text-xl font-bold">{myNickname}님</div> 반갑습니다.
    </div>
  );
};

export default UserGreeting;
