import useAuth from "@/hooks/useAuth";

const UserGreeting = () => {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <h1 className="p-5">
      <span className="text-lg font-bold">{data?.data.nickname}</span>님
      반갑습니다.
    </h1>
  );
};

export default UserGreeting;
