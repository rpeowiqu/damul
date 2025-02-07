import { useEffect, useState } from "react";

const UserGreeting = () => {
  const [userName, setUserName] = useState("사용자");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/mocks/home/user.json");
        const data = await response.json();
        setUserName(data.userName);
      } catch (err: any) {
        console.log("유저정보가 없습니다.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center p-5">
      <div className="mr-2 text-xl font-bold">{userName}님</div> 반갑습니다.
    </div>
  );
};

export default UserGreeting;
